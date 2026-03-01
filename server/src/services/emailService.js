import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let cachedTransporter = null;

const mailFromAddress = () => {
  const fromEmail = env.mailFromEmail || env.smtpUser;
  if (env.mailFromName) {
    return `${env.mailFromName} <${fromEmail}>`;
  }
  return fromEmail;
};

const buildTransporter = () => {
  if (cachedTransporter) return cachedTransporter;
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) return null;

  cachedTransporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
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
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS.");
  }
  return transporter;
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
<p>${contact.message.replace(/\n/g, "<br/>")}</p>`
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
