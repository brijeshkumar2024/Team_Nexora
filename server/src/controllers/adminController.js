import Project from "../models/Project.js";
import Application from "../models/Application.js";
import CertificateRecord from "../models/CertificateRecord.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [projectsTotal, recruitingProjects, applicationsTotal, pendingApplications, certificatesTotal, approvedCertificates] =
    await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: "recruiting" }),
      Application.countDocuments(),
      Application.countDocuments({ status: "pending" }),
      CertificateRecord.countDocuments(),
      CertificateRecord.countDocuments({ isApproved: true })
    ]);

  return sendSuccess(res, {
    message: "Dashboard stats fetched",
    data: {
      projectsTotal,
      recruitingProjects,
      applicationsTotal,
      pendingApplications,
      certificatesTotal,
      approvedCertificates
    }
  });
});
