import nodemailer from "nodemailer";
import dns from "node:dns/promises";
import net from "node:net";
import { env } from "../config/env.js";

let cachedTransporter = null;
const requiredSmtpKeys = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"];
const requiredResendKeys = ["RESEND_API_KEY", "MAIL_FROM_EMAIL"];
const smtpMissingByKey = {
  SMTP_HOST: () => !env.smtpHost,
  SMTP_USER: () => !env.smtpUser,
  SMTP_PASS: () => !env.smtpPass
};
const resendMissingByKey = {
  RESEND_API_KEY: () => !env.resendApiKey,
  MAIL_FROM_EMAIL: () => !env.mailFromEmail
};

export const getSmtpStatus = () => {
  const missing = requiredSmtpKeys.filter((key) => smtpMissingByKey[key]());
  return {
    configured: missing.length === 0,
    missing
  };
};

export const getResendStatus = () => {
  const missing = requiredResendKeys.filter((key) => resendMissingByKey[key]());
  return {
    configured: missing.length === 0,
    missing
  };
};

export const getEmailStatus = () => {
  const resendStatus = getResendStatus();
  const smtpStatus = getSmtpStatus();

  if (resendStatus.configured) {
    return {
      provider: "resend",
      configured: true,
      missing: []
    };
  }

  if (smtpStatus.configured) {
    return {
      provider: "smtp",
      configured: true,
      missing: []
    };
  }

  if (env.resendApiKey || env.mailFromEmail) {
    return {
      provider: "resend",
      configured: false,
      missing: resendStatus.missing
    };
  }

  return {
    provider: "smtp",
    configured: false,
    missing: smtpStatus.missing
  };
};

const getConfiguredProviderPriority = () => {
  const providers = [];
  if (getResendStatus().configured) providers.push("resend");
  if (getSmtpStatus().configured) providers.push("smtp");
  return providers;
};

const mailFromAddress = () => {
  const fromEmail = env.mailFromEmail || env.smtpUser || "no-reply@nexora.dev";
  if (env.mailFromName) {
    return `${env.mailFromName} <${fromEmail}>`;
  }
  return fromEmail;
};

const buildTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;
  const smtpStatus = getSmtpStatus();
  if (!smtpStatus.configured) return null;

  let transportConfig = {
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  };

  const smtpOverride = await resolveSmtpConfig();
  if (smtpOverride) {
    transportConfig = {
      ...transportConfig,
      host: smtpOverride.host,
      tls: smtpOverride.tls
    };
  }

  cachedTransporter = nodemailer.createTransport(transportConfig);

  return cachedTransporter;
};

const resolveSmtpConfig = async () => {
  if (!env.smtpHost || net.isIP(env.smtpHost)) {
    return null;
  }

  try {
    const ipv4Addresses = await dns.resolve4(env.smtpHost);
    const ipv4Host = ipv4Addresses?.[0];
    if (!ipv4Host) return null;

    return {
      host: ipv4Host,
      tls: {
        servername: env.smtpHost
      }
    };
  } catch (_error) {
    return null;
  }
};

const getTransporter = async () => {
  const transporter = await buildTransporter();
  if (!transporter) {
    const smtpStatus = getSmtpStatus();
    throw new Error(`SMTP is not configured. Missing: ${smtpStatus.missing.join(", ")}.`);
  }
  return transporter;
};

const readResponseBody = async (response) => {
  try {
    const raw = await response.text();
    if (!raw) return "";
    try {
      return JSON.parse(raw);
    } catch (_error) {
      return raw;
    }
  } catch (_error) {
    return "";
  }
};

const buildResendError = (status, details) => {
  const error = new Error(`Resend request failed with status ${status}`);
  error.code = `HTTP_${status}`;
  error.response = typeof details === "string" ? details : JSON.stringify(details);
  return error;
};

const sendWithResend = async ({ to, subject, text, html }) => {
  const response = await fetch(`${env.resendApiBaseUrl}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: mailFromAddress(),
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html
    })
  });

  if (!response.ok) {
    const details = await readResponseBody(response);
    throw buildResendError(response.status, details);
  }

  return response.json();
};

const sendWithSmtp = async ({ to, subject, text, html }) => {
  const transporter = await getTransporter();
  return transporter.sendMail({
    from: mailFromAddress(),
    to,
    subject,
    text,
    html
  });
};

const sendByProvider = (provider, payload) => {
  if (provider === "resend") return sendWithResend(payload);
  return sendWithSmtp(payload);
};

const sendEmail = async (payload) => {
  const configuredProviders = getConfiguredProviderPriority();
  if (!configuredProviders.length) {
    const emailStatus = getEmailStatus();
    throw new Error(`Email provider is not configured. Provider: ${emailStatus.provider}. Missing: ${emailStatus.missing.join(", ")}.`);
  }

  const errors = [];
  for (const provider of configuredProviders) {
    try {
      return await sendByProvider(provider, payload);
    } catch (error) {
      errors.push({
        provider,
        message: error?.message,
        code: error?.code,
        response: error?.response
      });
    }
  }

  const details = errors
    .map((entry) => `${entry.provider}: ${entry.message || "unknown error"}`)
    .join(" | ");
  const error = new Error(`Email send failed for all configured providers. ${details}`);
  error.code = errors[0]?.code;
  error.response = errors[0]?.response;
  throw error;
};

const verifyResendConnection = async () => {
  const resendStatus = getResendStatus();
  if (!resendStatus.configured) {
    return {
      ok: false,
      provider: "resend",
      reason: "missing_env",
      missing: resendStatus.missing
    };
  }

  try {
    const response = await fetch(`${env.resendApiBaseUrl}/domains?limit=1`, {
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`
      }
    });

    if (!response.ok) {
      const details = await readResponseBody(response);
      const isRestrictedSendOnlyKey =
        response.status === 401 &&
        ((typeof details === "object" && details?.name === "restricted_api_key") ||
          (typeof details === "string" && details.includes("restricted_api_key")));

      // Restricted "send-only" keys cannot access /domains, but can still send mail via /emails.
      if (isRestrictedSendOnlyKey) {
        return {
          ok: true,
          provider: "resend",
          limited: true
        };
      }

      const error = buildResendError(response.status, details);
      throw error;
    }

    return { ok: true, provider: "resend" };
  } catch (error) {
    return {
      ok: false,
      provider: "resend",
      reason: "verify_failed",
      code: error?.code,
      response: error?.response,
      message: error?.message
    };
  }
};

const verifySmtpConnection = async () => {
  const smtpStatus = getSmtpStatus();
  if (!smtpStatus.configured) {
    return {
      ok: false,
      provider: "smtp",
      reason: "missing_env",
      missing: smtpStatus.missing
    };
  }

  try {
    const transporter = await getTransporter();
    await transporter.verify();
    return { ok: true, provider: "smtp" };
  } catch (error) {
    return {
      ok: false,
      provider: "smtp",
      reason: "verify_failed",
      code: error?.code,
      response: error?.response,
      message: error?.message
    };
  }
};

export const verifyEmailConnection = async () => {
  const configuredProviders = getConfiguredProviderPriority();
  if (!configuredProviders.length) {
    const emailStatus = getEmailStatus();
    return {
      ok: false,
      provider: emailStatus.provider,
      reason: "missing_env",
      missing: emailStatus.missing
    };
  }

  const failures = [];
  for (const provider of configuredProviders) {
    const result = provider === "resend" ? await verifyResendConnection() : await verifySmtpConnection();
    if (result.ok) return result;
    failures.push(result);
  }

  return {
    ...failures[0],
    reason: "verify_failed_all",
    attempts: failures.map((item) => ({
      provider: item.provider,
      code: item.code,
      message: item.message
    }))
  };
};

export const sendContactNotificationToTeam = async (contact) => {
  const timestamp = new Date(contact.createdAt || Date.now()).toISOString();

  return sendEmail({
    to: env.contactReceiverEmail,
    subject: "New Contact Inquiry - Team Nexora",
    text: `New contact inquiry received.

Name: ${contact.name}
Email: ${contact.email}
Inquiry Type: ${contact.inquiryType}
Timestamp: ${timestamp}

Message:
${contact.message}`,
    html: `<h2>New Contact Inquiry - Team Nexora</h2>
<p><strong>Name:</strong> ${contact.name}</p>
<p><strong>Email:</strong> ${contact.email}</p>
<p><strong>Inquiry Type:</strong> ${contact.inquiryType}</p>
<p><strong>Timestamp:</strong> ${timestamp}</p>
<p><strong>Message:</strong></p>
<p>${(contact.message || "").replace(/\n/g, "<br/>")}</p>`
  });
};

export const sendContactAcknowledgement = async (contact) => {
  return sendEmail({
    to: contact.email,
    subject: "Thank You for Contacting Team Nexora",
    text: `Dear ${contact.name},

Thank you for reaching out to Team Nexora.

We truly appreciate your message and will carefully review your inquiry.
Our team will get back to you within 24 hours.

We value your time and interest.

Best Regards,
Team Nexora`,
    html: `<p>Dear ${contact.name},</p>
<p>Thank you for reaching out to Team Nexora.</p>
<p>We truly appreciate your message and will carefully review your inquiry.<br/>Our team will get back to you within 24 hours.</p>
<p>We value your time and interest.</p>
<p>Best Regards,<br/>Team Nexora</p>`
  });
};
