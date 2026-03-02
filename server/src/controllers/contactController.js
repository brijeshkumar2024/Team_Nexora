import Contact from "../models/Contact.js";
import { sendContactAcknowledgement, sendContactNotificationToTeam } from "../services/emailService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logger } from "../config/logger.js";

const getMailErrorMeta = (reason) => ({
  error: reason?.message || reason,
  code: reason?.code,
  response: reason?.response
});

export const submitContact = asyncHandler(async (req, res) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    inquiryType: req.body.inquiryType,
    message: req.body.message
  };

  const contact = await Contact.create(payload);
  logger.info("Contact inquiry submitted", {
    contactId: contact._id.toString(),
    email: contact.email,
    inquiryType: contact.inquiryType
  });

  const [teamNotification, senderAcknowledgement] = await Promise.allSettled([
    sendContactNotificationToTeam(contact),
    sendContactAcknowledgement(contact)
  ]);

  if (teamNotification.status === "rejected") {
    logger.error("Failed to send team contact notification email", {
      contactId: contact._id.toString(),
      ...getMailErrorMeta(teamNotification.reason)
    });
  }

  if (senderAcknowledgement.status === "rejected") {
    logger.error("Failed to send contact acknowledgement email", {
      contactId: contact._id.toString(),
      ...getMailErrorMeta(senderAcknowledgement.reason)
    });
  }

  return sendSuccess(res, {
    statusCode: 201,
    message: "Your message has been received. Team Nexora will contact you within 24 hours.",
    data: contact
  });
});

export const listContacts = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const currentPage = Number(page);
  const pageSize = Math.min(Number(limit), 100);

  const query = {};
  if (status) query.status = status;

  const [contacts, total] = await Promise.all([
    Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize),
    Contact.countDocuments(query)
  ]);

  return sendSuccess(res, {
    message: "Contact inquiries fetched",
    data: contacts,
    meta: {
      total,
      page: currentPage,
      limit: pageSize
    }
  });
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    throw new AppError("Contact inquiry not found", 404);
  }

  contact.status = req.body.status;
  await contact.save();

  return sendSuccess(res, {
    message: "Contact inquiry status updated",
    data: contact
  });
});
