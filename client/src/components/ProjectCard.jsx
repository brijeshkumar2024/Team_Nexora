import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import GlassCard from "./GlassCard";
import { fadeUp } from "../animations/motionVariants";

const ProjectCard = ({ project }) => {
  return (
    <motion.div variants={fadeUp}>
      <GlassCard className="h-full p-6 transition hover:-translate-y-1 hover:border-aurum/35 hover:shadow-glow">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-semibold text-white">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="text-sm leading-relaxed text-slate-300">{project.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack?.slice(0, 4).map((tech) => (
            <span key={tech} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200">
              {tech}
            </span>
          ))}
        </div>

        <Link
          to={`/projects/${project.slug}`}
          className="mt-7 inline-flex items-center text-sm font-medium text-aurumSoft transition hover:text-white"
        >
          View project details →
        </Link>
      </GlassCard>
    </motion.div>
  );
};

export default ProjectCard;
