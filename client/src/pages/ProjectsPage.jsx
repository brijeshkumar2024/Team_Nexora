import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { pageTransition, stagger } from "../animations/motionVariants";
import { useAsyncData } from "../hooks/useAsyncData";
import { projectService } from "../services/projectService";

const filters = [
  { id: "all", label: "All" },
  { id: "recruiting", label: "Recruiting" },
  { id: "in-development", label: "In Development" },
  { id: "completed", label: "Completed" }
];

const ProjectsPage = () => {
  const [status, setStatus] = useState("all");

  const params = useMemo(() => (status === "all" ? {} : { status }), [status]);
  const { data, loading, error } = useAsyncData(() => projectService.list(params), [status]);

  const projects = data?.data || [];

  return (
    <motion.div className="section-shell py-16" variants={pageTransition} initial="hidden" animate="visible" exit="exit">
      <SectionHeading
        eyebrow="Projects"
        title="Scalable Products in Active Execution"
        description="Browse Nexora initiatives with recruitment, development, and completion status clarity."
      />

      <div className="mt-8 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStatus(filter.id)}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              status === filter.id
                ? "bg-aurum/20 text-aurumSoft"
                : "border border-white/15 bg-white/5 text-slate-300 hover:text-white"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner text="Fetching project pipeline..." />}
      {error && <p className="mt-6 text-sm text-rose-300">{error}</p>}

      {!loading && !error && (
        <motion.div
          className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
          {projects.length === 0 && (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-slate-300">
              No projects in this status right now. Check another filter or return soon.
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectsPage;
