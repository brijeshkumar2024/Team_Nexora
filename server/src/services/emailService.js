import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let cachedTransporter = null;
const requiredSmtpKeys = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"];
const smtpMissingByKey = {
  SMTP_HOST: () => !env.smtpHost,
  SMTP_USER: () => !env.smtpUser,
  SMTP_PASS: () => !env.smtpPass
};

export const getSmtpStatus = () => {
  const missing = requiredSmtpKeys.filter((key) => smtpMissingByKey[key]());
  return {
    configured: missing.length === 0,
    missing
  };
};

const mailFromAddress = () => {
  const fromEmail = env.mailFromEmail || env.smtpUser;
  if (env.mailFromName) {
    return `${env.mailFromName} <${fromEmail}>`;
  }
  return fromEmail;
};

const buildTransporter = () => {
  if (cachedTransporter) return cachedTransporter;
  const smtpStatus = getSmtpStatus();
  if (!smtpStatus.configured) return null;

  cachedTransporter = nodemailer.createTransport({
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
  });

  return cachedTransporter;
};

const getTransporter = () => {
  const transporter = buildTransporter();
  if (!transporter) {
    const smtpStatus = getSmtpStatus();
    throw new Error(`SMTP is not configured. Missing: ${smtpStatus.missing.join(", ")}.`);
  }
  return transporter;
};

export const verifySmtpConnection = async () => {
  const smtpStatus = getSmtpStatus();
  if (!smtpStatus.configured) {
    return {
      ok: false,
      reason: "missing_env",
      missing: smtpStatus.missing
    };
  }

  try {
    const transporter = getTransporter();
    await transporter.verify();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: "verify_failed",
      code: error?.code,
      response: error?.response,
      message: error?.message
    };
  }
};

export const sendContactNotificationToTeam = async (contact) => {
  const transporter = getTransporter();
  const timestamp = new Date(contact.createdAt || Date.now()).toISOString();

  return transporter.sendMail({
    from: mailFromAddress(),
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
  const transporter = getTransporter();

  return transporter.sendMail({
    from: mailFromAddress(),
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
