import CertificateTemplate from "../models/CertificateTemplate.js";
import CertificateRecord from "../models/CertificateRecord.js";
import Application from "../models/Application.js";
import Project from "../models/Project.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTemplate = asyncHandler(async (req, res) => {
  const template = await CertificateTemplate.create(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Certificate template created",
    data: template
  });
});

export const listTemplates = asyncHandler(async (req, res) => {
  const templates = await CertificateTemplate.find().sort({ createdAt: -1 });
  return sendSuccess(res, {
    message: "Certificate templates fetched",
    data: templates
  });
});

export const createRecord = asyncHandler(async (req, res) => {
  const [application, project, template] = await Promise.all([
    Application.findById(req.body.application),
    Project.findById(req.body.project),
    CertificateTemplate.findById(req.body.template)
  ]);

  if (!application) throw new AppError("Application not found", 404);
  if (!project) throw new AppError("Project not found", 404);
  if (!template) throw new AppError("Certificate template not found", 404);
  if (!project.unpaid) {
    throw new AppError("Certificate records are intended for unpaid projects only", 400);
  }

  const record = await CertificateRecord.create(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Certificate record created",
    data: record
  });
});

export const listRecords = asyncHandler(async (req, res) => {
  const records = await CertificateRecord.find()
    .populate("project", "title status")
    .populate("application", "fullName email")
    .populate("template", "name version")
    .populate("approvedBy", "name email")
    .sort({ createdAt: -1 });

  return sendSuccess(res, {
    message: "Certificate records fetched",
    data: records
  });
});

export const approveRecord = asyncHandler(async (req, res) => {
  const record = await CertificateRecord.findById(req.params.id);
  if (!record) throw new AppError("Certificate record not found", 404);

  record.isApproved = true;
  record.approvedAt = new Date();
  record.approvedBy = req.user._id;
  await record.save();

  return sendSuccess(res, {
    message: "Certificate approved",
    data: record
  });
});
