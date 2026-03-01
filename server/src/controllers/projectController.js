import Project from "../models/Project.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const buildProjectQuery = ({ status, q, featured }) => {
  const query = {};
  if (status) {
    query.status = status;
  }
  if (q) {
    query.$text = { $search: q };
  }
  if (featured === "true") {
    query.isFeatured = true;
  }
  return query;
};

export const listProjects = asyncHandler(async (req, res) => {
  const { status, q, featured, page = 1, limit = 9 } = req.query;
  const currentPage = Number(page);
  const pageSize = Math.min(Number(limit), 50);

  const filters = buildProjectQuery({ status, q, featured });
  const [projects, total] = await Promise.all([
    Project.find(filters)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize),
    Project.countDocuments(filters)
  ]);

  return sendSuccess(res, {
    message: "Projects fetched",
    data: projects,
    meta: {
      total,
      page: currentPage,
      limit: pageSize
    }
  });
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return sendSuccess(res, {
    message: "Project fetched",
    data: project
  });
});

export const createProject = asyncHandler(async (req, res) => {
  const existing = await Project.findOne({ slug: req.body.slug });
  if (existing) {
    throw new AppError("A project with this slug already exists", 409);
  }

  const project = await Project.create({
    ...req.body,
    createdBy: req.user._id
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Project created",
    data: project
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  Object.assign(project, req.body);
  await project.save();

  return sendSuccess(res, {
    message: "Project updated",
    data: project
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await project.deleteOne();
  return sendSuccess(res, { message: "Project deleted" });
});
