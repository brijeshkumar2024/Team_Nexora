import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "../components/AdminSidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import { adminService } from "../services/adminService";
import { projectService } from "../services/projectService";
import { applicationService } from "../services/applicationService";
import { certificateService } from "../services/certificateService";
import { api } from "../services/api";

const emptyProjectForm = {
  id: "",
  title: "",
  slug: "",
  summary: "",
  description: "",
  status: "recruiting",
  domain: "Product Innovation",
  techStack: "",
  rolesNeeded: "",
  unpaid: false,
  isFeatured: false
};

const toSlug = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseRoles = (rolesText) => {
  if (!rolesText.trim()) return [];
  return rolesText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, skills = "", count = "1"] = line.split("|");
      return {
        title: (title || "").trim(),
        skills: skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        count: Number(count) || 1
      };
  });
};

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [records, setRecords] = useState([]);

  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [templateForm, setTemplateForm] = useState({ name: "", body: "" });
  const [recordForm, setRecordForm] = useState({
    application: "",
    project: "",
    contributorName: "",
    role: "",
    duration: "",
    performanceNote: "",
    template: ""
  });
  const [actionMessage, setActionMessage] = useState("");
  const [isActionError, setIsActionError] = useState(false);
  const [globalMessage, setGlobalMessage] = useState("");
  const [isGlobalError, setIsGlobalError] = useState(false);

  const setGlobalFeedback = (message, isError = false) => {
    setGlobalMessage(message);
    setIsGlobalError(isError);
  };

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, projectRes, applicationRes, templateRes, recordRes] = await Promise.all([
        adminService.stats(),
        projectService.list({ limit: 50 }),
        applicationService.list({ limit: 100 }),
        certificateService.listTemplates(),
        certificateService.listRecords()
      ]);

      setStats(statsRes.data);
      setProjects(projectRes.data || []);
      setApplications(applicationRes.data || []);
      setTemplates(templateRes.data || []);
      setRecords(recordRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const submitProject = async (event) => {
    event.preventDefault();
    setActionMessage("");
    setIsActionError(false);
    const normalizedSlug = toSlug(projectForm.slug || projectForm.title);
    const payload = {
      title: projectForm.title.trim(),
      slug: normalizedSlug,
      summary: projectForm.summary.trim(),
      description: projectForm.description.trim(),
      status: projectForm.status,
      domain: projectForm.domain.trim(),
      techStack: projectForm.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      rolesNeeded: parseRoles(projectForm.rolesNeeded),
      unpaid: projectForm.unpaid,
      isFeatured: projectForm.isFeatured
    };

    try {
      if (projectForm.id) {
        await projectService.update(projectForm.id, payload);
        setActionMessage("Project updated.");
      } else {
        await projectService.create(payload);
        setActionMessage("Project created.");
      }
      setProjectForm(emptyProjectForm);
      await loadDashboard();
    } catch (err) {
      const validationError = err?.response?.data?.errors?.[0]?.msg;
      setIsActionError(true);
      setActionMessage(validationError || err?.response?.data?.message || "Project action failed.");
    }
  };

  const editProject = (project) => {
    setProjectForm({
      id: project._id,
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description,
      status: project.status,
      domain: project.domain || "Product Innovation",
      techStack: (project.techStack || []).join(", "),
      rolesNeeded: (project.rolesNeeded || [])
        .map((role) => `${role.title}|${(role.skills || []).join(", ")}|${role.count || 1}`)
        .join("\n"),
      unpaid: Boolean(project.unpaid),
      isFeatured: Boolean(project.isFeatured)
    });
    setActiveTab("projects");
  };

  const removeProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await projectService.remove(id);
      setGlobalFeedback("Project deleted.");
      await loadDashboard();
    } catch (err) {
      setGlobalFeedback(err?.response?.data?.message || "Failed to delete project.", true);
    }
  };

  const updateApplicationStatus = async (application, status) => {
    try {
      await applicationService.update(application._id, { status, project: application.project?._id || application.project });
      setGlobalFeedback(`Application ${status}.`);
      await loadDashboard();
    } catch (err) {
      setGlobalFeedback(err?.response?.data?.message || "Failed to update application status.", true);
    }
  };

  const assignApplicationProject = async (application, projectId) => {
    try {
      await applicationService.update(application._id, { project: projectId, status: application.status });
      setGlobalFeedback("Application project assignment updated.");
      await loadDashboard();
    } catch (err) {
      setGlobalFeedback(err?.response?.data?.message || "Failed to assign project.", true);
    }
  };

  const exportCsv = async () => {
    try {
      const response = await api.get("/applications/export/csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "nexora-applications.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setGlobalFeedback("CSV exported.");
    } catch (err) {
      setGlobalFeedback(err?.response?.data?.message || "Failed to export CSV.", true);
    }
  };

  const submitTemplate = async (event) => {
    event.preventDefault();
    try {
      await certificateService.createTemplate(templateForm);
      setTemplateForm({ name: "", body: "" });
      setGlobalFeedback("Certificate template saved.");
      await loadDashboard();
    } catch (err) {
      setGlobalFeedback(err?.response?.data?.message || "Failed to save certificate template.", true);
    }
  };

  const submitRecord = async (event) => {
    event.preventDefault();
    try {
      await certificateService.createRecord(recordForm);
      setRecordForm({
        application: "",
        project: "",
        contributorName: "",
        role: "",
        duration: "",
        performanceNote: "",
        template: ""
      });
      setGlobalFeedback("Certificate record created.");
      await loadDashboard();
    } catch (err) {
      setGlobalFeedback(err?.response?.data?.message || "Failed to create certificate record.", true);
    }
  };

  const approveRecord = async (id) => {
    try {
      await certificateService.approveRecord(id);
      setGlobalFeedback("Certificate record approved.");
      await loadDashboard();
    } catch (err) {
      setGlobalFeedback(err?.response?.data?.message || "Failed to approve certificate record.", true);
    }
  };

  const statTiles = useMemo(
    () => [
      { label: "Total Projects", value: stats?.projectsTotal ?? 0 },
      { label: "Recruiting Projects", value: stats?.recruitingProjects ?? 0 },
      { label: "Applications", value: stats?.applicationsTotal ?? 0 },
      { label: "Pending Applications", value: stats?.pendingApplications ?? 0 },
      { label: "Certificates", value: stats?.certificatesTotal ?? 0 },
      { label: "Approved Certificates", value: stats?.approvedCertificates ?? 0 }
    ],
    [stats]
  );

  if (loading) {
    return <LoadingSpinner text="Loading Nexora command center..." />;
  }

  if (error) {
    return <p className="text-rose-300">{error}</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <section className="space-y-6">
        {globalMessage && (
          <p className={`text-sm ${isGlobalError ? "text-rose-300" : "text-emerald-300"}`}>{globalMessage}</p>
        )}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {statTiles.map((tile) => (
              <article key={tile.label} className="glass rounded-2xl p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-aurumSoft">{tile.label}</p>
                <p className="mt-3 font-display text-4xl text-white">{tile.value}</p>
              </article>
            ))}
          </motion.div>
        )}

        {activeTab === "projects" && (
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <form onSubmit={submitProject} className="glass rounded-2xl p-6">
              <h3 className="font-display text-2xl text-white">{projectForm.id ? "Edit Project" : "Create Project"}</h3>
              <div className="mt-5 space-y-4">
                <input
                  className="input-lux"
                  placeholder="Project title"
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm((prev) => {
                      const title = e.target.value;
                      const next = { ...prev, title };
                      if (!prev.id && (!prev.slug || prev.slug === toSlug(prev.title))) {
                        next.slug = toSlug(title);
                      }
                      return next;
                    })
                  }
                  required
                />
                <input
                  className="input-lux"
                  placeholder="project-slug"
                  value={projectForm.slug}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, slug: toSlug(e.target.value) }))}
                  required
                />
                <input
                  className="input-lux"
                  placeholder="Short summary"
                  value={projectForm.summary}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, summary: e.target.value }))}
                  required
                />
                <textarea
                  className="input-lux min-h-24"
                  placeholder="Detailed description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
                <input
                  className="input-lux"
                  placeholder="Domain"
                  value={projectForm.domain}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, domain: e.target.value }))}
                />
                <input
                  className="input-lux"
                  placeholder="Tech stack (comma separated)"
                  value={projectForm.techStack}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, techStack: e.target.value }))}
                />
                <textarea
                  className="input-lux min-h-24"
                  placeholder="Roles format per line: Role|skill1, skill2|count"
                  value={projectForm.rolesNeeded}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, rolesNeeded: e.target.value }))}
                />
                <select
                  className="input-lux"
                  value={projectForm.status}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="recruiting">Recruiting</option>
                  <option value="in-development">In Development</option>
                  <option value="completed">Completed</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={projectForm.unpaid}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, unpaid: e.target.checked }))}
                  />
                  Unpaid project (certificate eligible)
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={projectForm.isFeatured}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  />
                  Mark as featured
                </label>
                <div className="flex gap-3">
                  <button className="rounded-xl bg-gradient-to-r from-aurum to-amber-300 px-5 py-2 text-sm font-semibold text-midnight">
                    {projectForm.id ? "Update Project" : "Create Project"}
                  </button>
                  {projectForm.id && (
                    <button
                      type="button"
                      className="rounded-xl border border-white/20 px-5 py-2 text-sm text-slate-200"
                      onClick={() => setProjectForm(emptyProjectForm)}
                    >
                      Reset
                    </button>
                  )}
                </div>
                {actionMessage && <p className={`text-sm ${isActionError ? "text-rose-300" : "text-emerald-300"}`}>{actionMessage}</p>}
              </div>
            </form>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-2xl text-white">Manage Projects</h3>
              <div className="mt-5 space-y-3">
                {projects.map((project) => (
                  <div key={project._id} className="rounded-xl border border-white/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{project.title}</p>
                        <p className="text-xs text-slate-300">{project.slug}</p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        className="rounded-lg border border-white/20 px-3 py-1 text-xs text-slate-200"
                        onClick={() => editProject(project)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border border-rose-400/30 px-3 py-1 text-xs text-rose-200"
                        onClick={() => removeProject(project._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="glass rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-2xl text-white">Applicant Pipeline</h3>
              <button className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-200" onClick={exportCsv}>
                Export CSV
              </button>
            </div>
            <div className="space-y-3">
              {applications.map((application) => (
                <div key={application._id} className="rounded-xl border border-white/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">
                        {application.fullName} <span className="text-slate-400">({application.role})</span>
                      </p>
                      <p className="text-xs text-slate-300">
                        {application.email} • {application.experienceLevel}
                      </p>
                      <p className="mt-1 text-xs text-aurumSoft">Project: {application.project?.title || "Unassigned"}</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{application.whyNexora}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      className="rounded-lg border border-emerald-400/30 px-3 py-1 text-xs text-emerald-200"
                      onClick={() => updateApplicationStatus(application, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="rounded-lg border border-rose-400/30 px-3 py-1 text-xs text-rose-200"
                      onClick={() => updateApplicationStatus(application, "rejected")}
                    >
                      Reject
                    </button>
                    <select
                      className="rounded-lg border border-white/20 bg-transparent px-3 py-1 text-xs text-slate-200"
                      value={application.project?._id || application.project || ""}
                      onChange={(e) => assignApplicationProject(application, e.target.value)}
                    >
                      {projects.map((project) => (
                        <option key={project._id} value={project._id} className="bg-midnight">
                          {project.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="grid gap-6 xl:grid-cols-2">
            <form onSubmit={submitTemplate} className="glass rounded-2xl p-6">
              <h3 className="font-display text-xl text-white">Certificate Template Management</h3>
              <div className="mt-4 space-y-3">
                <input
                  className="input-lux"
                  placeholder="Template name"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                <textarea
                  className="input-lux min-h-24"
                  placeholder="Template body with placeholders like {{contributorName}}, {{projectTitle}}"
                  value={templateForm.body}
                  onChange={(e) => setTemplateForm((prev) => ({ ...prev, body: e.target.value }))}
                  required
                />
                <button className="rounded-xl bg-gradient-to-r from-aurum to-amber-300 px-5 py-2 text-sm font-semibold text-midnight">
                  Save Template
                </button>
              </div>

              <div className="mt-6 space-y-2">
                {templates.map((template) => (
                  <div key={template._id} className="rounded-lg border border-white/10 p-3">
                    <p className="text-sm text-white">{template.name}</p>
                    <p className="text-xs text-slate-300">Version {template.version}</p>
                  </div>
                ))}
              </div>
            </form>

            <div className="space-y-6">
              <form onSubmit={submitRecord} className="glass rounded-2xl p-6">
                <h3 className="font-display text-xl text-white">Contribution Record (Unpaid Projects)</h3>
                <div className="mt-4 space-y-3">
                  <select
                    className="input-lux"
                    value={recordForm.application}
                    onChange={(e) => {
                      const selected = applications.find((item) => item._id === e.target.value);
                      setRecordForm((prev) => ({
                        ...prev,
                        application: e.target.value,
                        contributorName: selected?.fullName || prev.contributorName,
                        role: selected?.role || prev.role,
                        project: selected?.project?._id || selected?.project || prev.project
                      }));
                    }}
                    required
                  >
                    <option value="">Select accepted application</option>
                    {applications
                      .filter((item) => item.status === "accepted")
                      .map((item) => (
                        <option key={item._id} value={item._id} className="bg-midnight">
                          {item.fullName} - {item.role}
                        </option>
                      ))}
                  </select>
                  <select
                    className="input-lux"
                    value={recordForm.project}
                    onChange={(e) => setRecordForm((prev) => ({ ...prev, project: e.target.value }))}
                    required
                  >
                    <option value="">Select unpaid project</option>
                    {projects
                      .filter((project) => project.unpaid)
                      .map((project) => (
                        <option key={project._id} value={project._id} className="bg-midnight">
                          {project.title}
                        </option>
                      ))}
                  </select>
                  <input
                    className="input-lux"
                    placeholder="Contributor Name"
                    value={recordForm.contributorName}
                    onChange={(e) => setRecordForm((prev) => ({ ...prev, contributorName: e.target.value }))}
                    required
                  />
                  <input
                    className="input-lux"
                    placeholder="Role"
                    value={recordForm.role}
                    onChange={(e) => setRecordForm((prev) => ({ ...prev, role: e.target.value }))}
                    required
                  />
                  <input
                    className="input-lux"
                    placeholder="Duration (e.g. Jan 2026 - Mar 2026)"
                    value={recordForm.duration}
                    onChange={(e) => setRecordForm((prev) => ({ ...prev, duration: e.target.value }))}
                    required
                  />
                  <textarea
                    className="input-lux min-h-24"
                    placeholder="Performance note"
                    value={recordForm.performanceNote}
                    onChange={(e) => setRecordForm((prev) => ({ ...prev, performanceNote: e.target.value }))}
                    required
                  />
                  <select
                    className="input-lux"
                    value={recordForm.template}
                    onChange={(e) => setRecordForm((prev) => ({ ...prev, template: e.target.value }))}
                    required
                  >
                    <option value="">Select template</option>
                    {templates.map((template) => (
                      <option key={template._id} value={template._id} className="bg-midnight">
                        {template.name}
                      </option>
                    ))}
                  </select>
                  <button className="rounded-xl bg-gradient-to-r from-aurum to-amber-300 px-5 py-2 text-sm font-semibold text-midnight">
                    Create Record
                  </button>
                </div>
              </form>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-xl text-white">Approval Queue</h3>
                <div className="mt-4 space-y-3">
                  {records.map((record) => (
                    <div key={record._id} className="rounded-xl border border-white/10 p-4">
                      <p className="text-sm text-white">
                        {record.contributorName} • {record.project?.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">{record.duration}</p>
                      <p className="mt-2 text-xs text-slate-200">{record.performanceNote}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <StatusBadge status={record.isApproved ? "accepted" : "pending"} />
                        {!record.isApproved && (
                          <button
                            className="rounded-lg border border-emerald-400/30 px-3 py-1 text-xs text-emerald-200"
                            onClick={() => approveRecord(record._id)}
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
