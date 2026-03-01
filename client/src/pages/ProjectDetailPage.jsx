import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import { pageTransition } from "../animations/motionVariants";
import { useAsyncData } from "../hooks/useAsyncData";
import { projectService } from "../services/projectService";

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const { data, loading, error } = useAsyncData(() => projectService.getBySlug(slug), [slug]);
  const project = data?.data;

  if (loading) {
    return (
      <div className="section-shell py-16">
        <LoadingSpinner text="Loading project intelligence..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="section-shell py-16">
        <p className="text-rose-300">{error || "Project not found"}</p>
      </div>
    );
  }

  return (
    <motion.div className="section-shell py-16" variants={pageTransition} initial="hidden" animate="visible" exit="exit">
      <div className="mb-5">
        <StatusBadge status={project.status} />
      </div>
      <SectionHeading eyebrow={project.domain} title={project.title} description={project.summary} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <article className="glass rounded-2xl p-7">
          <h3 className="font-display text-2xl text-white">Project Brief</h3>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-200">{project.description}</p>

          <div className="mt-7">
            <p className="text-xs uppercase tracking-[0.24em] text-aurumSoft">Tech Stack</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.techStack?.map((tech) => (
                <span key={tech} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h4 className="font-display text-xl text-white">Role Requirements</h4>
            <div className="mt-4 space-y-4">
              {project.rolesNeeded?.length ? (
                project.rolesNeeded.map((role) => (
                  <div key={role.title} className="rounded-xl border border-white/10 p-4">
                    <p className="text-sm font-medium text-white">
                      {role.title} <span className="text-xs text-slate-400">(x{role.count || 1})</span>
                    </p>
                    <p className="mt-2 text-xs text-slate-300">{role.skills?.join(" • ") || "Generalist capability"}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-300">Role requirements will be published by project leads.</p>
              )}
            </div>
          </div>

          <Link
            to={`/apply?project=${project._id}`}
            className="block rounded-xl bg-gradient-to-r from-aurum to-amber-300 px-6 py-3 text-center text-sm font-semibold text-midnight transition hover:brightness-110"
          >
            Apply for This Project
          </Link>
        </aside>
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;
