import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import { pageTransition } from "../animations/motionVariants";
import { useAsyncData } from "../hooks/useAsyncData";
import { projectService } from "../services/projectService";
import { applicationService } from "../services/applicationService";

const initialForm = {
  fullName: "",
  email: "",
  role: "",
  skills: "",
  experienceLevel: "intermediate",
  portfolioUrl: "",
  whyNexora: "",
  project: ""
};

const ApplyPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedProject = searchParams.get("project");

  const { data, loading: projectsLoading, error: projectsError } = useAsyncData(
    () => projectService.list({ status: "recruiting", limit: 50 }),
    []
  );
  const projects = data?.data || [];

  const [form, setForm] = useState(() => ({
    ...initialForm,
    project: preselectedProject || ""
  }));
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const canSubmit = useMemo(() => !submitting && !projectsLoading, [submitting, projectsLoading]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setMessage("");
    try {
      const payload = {
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        role: form.role.trim(),
        whyNexora: form.whyNexora.trim(),
        skills: form.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      };

      const portfolioUrl = form.portfolioUrl.trim();
      if (portfolioUrl) {
        payload.portfolioUrl = portfolioUrl;
      } else {
        delete payload.portfolioUrl;
      }

      await applicationService.submit(payload);
      setMessage("Application submitted successfully. Nexora team will review your profile.");
      setForm(initialForm);
    } catch (err) {
      const validationError = err?.response?.data?.errors?.[0]?.msg;
      setSubmitError(validationError || err?.response?.data?.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div className="section-shell py-16" variants={pageTransition} initial="hidden" animate="visible" exit="exit">
      <SectionHeading
        eyebrow="Recruitment"
        title="Apply to Build with Team Nexora"
        description="Tell us how you execute, what you have built, and where you want to create impact."
      />

      <form onSubmit={onSubmit} className="glass mt-10 grid gap-5 rounded-2xl p-6 md:grid-cols-2 md:p-8">
        <label className="text-sm">
          <span className="mb-2 block text-slate-200">Full Name</span>
          <input className="input-lux" name="fullName" value={form.fullName} onChange={onChange} required />
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-slate-200">Email</span>
          <input className="input-lux" type="email" name="email" value={form.email} onChange={onChange} required />
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-slate-200">Role</span>
          <input className="input-lux" name="role" value={form.role} onChange={onChange} placeholder="Frontend Engineer" required />
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-slate-200">Skills (comma separated)</span>
          <input className="input-lux" name="skills" value={form.skills} onChange={onChange} placeholder="React, Node.js, MongoDB" />
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-slate-200">Experience Level</span>
          <select className="input-lux" name="experienceLevel" value={form.experienceLevel} onChange={onChange}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-2 block text-slate-200">GitHub / Portfolio</span>
          <input
            className="input-lux"
            type="url"
            name="portfolioUrl"
            value={form.portfolioUrl}
            onChange={onChange}
            placeholder="https://github.com/username"
          />
        </label>

        <label className="text-sm md:col-span-2">
          <span className="mb-2 block text-slate-200">Project</span>
          <select className="input-lux" name="project" value={form.project} onChange={onChange} required>
            <option value="">Select recruiting project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm md:col-span-2">
          <span className="mb-2 block text-slate-200">Why Nexora?</span>
          <textarea
            className="input-lux min-h-36 resize-y"
            name="whyNexora"
            value={form.whyNexora}
            onChange={onChange}
            placeholder="Describe your motivation, ownership mindset, and how you execute."
            required
          />
        </label>

        <div className="md:col-span-2">
          {submitError && <p className="mb-3 text-sm text-rose-300">{submitError}</p>}
          {projectsError && <p className="mb-3 text-sm text-rose-300">{projectsError}</p>}
          {!projectsLoading && !projects.length && !projectsError && (
            <p className="mb-3 text-sm text-amber-200">No recruiting projects are open right now.</p>
          )}
          {message && <p className="mb-3 text-sm text-emerald-300">{message}</p>}
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-xl bg-gradient-to-r from-aurum to-amber-300 px-7 py-3 text-sm font-semibold text-midnight transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ApplyPage;
