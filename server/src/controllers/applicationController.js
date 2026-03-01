import Application from "../models/Application.js";
import Project from "../models/Project.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toCsv } from "../utils/csvExport.js";

export const submitApplication = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.project);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const application = await Application.create(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Application submitted successfully",
    data: application
  });
});

export const listApplications = asyncHandler(async (req, res) => {
  const { status, project, page = 1, limit = 20 } = req.query;
  const currentPage = Number(page);
  const pageSize = Math.min(Number(limit), 100);

  const query = {};
  if (status) query.status = status;
  if (project) query.project = project;

  const [applications, total] = await Promise.all([
    Application.find(query)
      .populate("project", "title slug status")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize),
    Application.countDocuments(query)
  ]);

  return sendSuccess(res, {
    message: "Applications fetched",
    data: applications,
    meta: {
      total,
      page: currentPage,
      limit: pageSize
    }
  });
});

export const updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (req.body.project) {
    const project = await Project.findById(req.body.project);
    if (!project) {
      throw new AppError("Assigned project not found", 404);
    }
    application.project = req.body.project;
  }

  if (req.body.status) application.status = req.body.status;
  if (typeof req.body.reviewerNote === "string") application.reviewerNote = req.body.reviewerNote;
  application.assignedBy = req.user._id;
  await application.save();

  return sendSuccess(res, {
    message: "Application updated",
    data: application
  });
});

export const listProjectApplicants = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const applicants = await Application.find({ project: req.params.id }).sort({ createdAt: -1 });
  return sendSuccess(res, {
    message: "Project applicants fetched",
    data: applicants
  });
});

export const exportApplicationsCsv = asyncHandler(async (req, res) => {
  const { project } = req.query;
  const filter = project ? { project } : {};

  const applications = await Application.find(filter).populate("project", "title");

  const rows = applications.map((item) => ({
    fullName: item.fullName,
    email: item.email,
    role: item.role,
    experienceLevel: item.experienceLevel,
    status: item.status,
    project: item.project?.title || "",
    submittedAt: item.createdAt.toISOString()
  }));

  const csv = toCsv(rows, [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "experienceLevel", label: "Experience Level" },
    { key: "status", label: "Status" },
    { key: "project", label: "Project" },
    { key: "submittedAt", label: "Submitted At" }
  ]);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=nexora-applications.csv");
  return res.status(200).send(csv);
});
