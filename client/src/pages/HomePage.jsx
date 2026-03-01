import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Cpu, Users } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { fadeUp, pageTransition, stagger } from "../animations/motionVariants";
import { useAsyncData } from "../hooks/useAsyncData";
import { projectService } from "../services/projectService";

const whatWeDo = [
  {
    title: "Build Scalable Products",
    description:
      "We move from concept to production with disciplined architecture, measurable milestones, and relentless execution.",
    icon: Rocket
  },
  {
    title: "Ship with Startup Velocity",
    description:
      "Every sprint is outcome-driven. We validate, iterate, and deploy quickly without sacrificing engineering quality.",
    icon: Cpu
  },
  {
    title: "Recruit Elite Builders",
    description:
      "Nexora is a proving ground for ambitious developers who want ownership, accountability, and high-growth environments.",
    icon: Users
  }
];

const reasons = [
  {
    title: "Growth",
    text: "Work beside founders, senior engineers, and operators who push your craft to a higher standard."
  },
  {
    title: "Ownership",
    text: "You lead meaningful modules, drive product decisions, and get recognized for execution."
  },
  {
    title: "Real Impact",
    text: "Your code powers live products with active users, real constraints, and strategic business goals."
  }
];

const HomePage = () => {
  const { data, loading } = useAsyncData(() => projectService.list({ limit: 3 }), []);
  const projects = data?.data || [];

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit">
      <section className="section-shell relative py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 text-xs uppercase tracking-[0.28em] text-aurumSoft"
          >
            Engineering the Future. Executing Bold Ideas.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="font-display text-5xl font-semibold leading-tight text-white md:text-7xl"
          >
            Where Vision Meets Execution.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24 }}
            className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg"
          >
            Team Nexora builds high-impact products for real markets.
            <br className="hidden md:block" /> We recruit operators, engineers, and creators who deliver at startup speed.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/apply"
              className="rounded-xl bg-gradient-to-r from-aurum to-amber-300 px-7 py-3 text-sm font-semibold text-midnight shadow-glow transition hover:brightness-110"
            >
              Join Nexora
            </Link>
            <Link
              to="/projects"
              className="rounded-xl border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-slate-100 transition hover:border-aurum/40 hover:text-aurumSoft"
            >
              Explore Our Projects
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="mt-16 flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <span className="h-10 w-6 rounded-full border border-white/25">
            <span className="mx-auto mt-2 block h-2 w-2 rounded-full bg-aurum" />
          </span>
        </motion.div>
      </section>

      <section className="section-shell py-16">
        <SectionHeading
          eyebrow="What We Do"
          title="Elite Product Execution with Measurable Outcomes."
          description="Nexora combines startup speed with enterprise discipline to build products that scale from day one."
        />
        <motion.div
          className="mt-10 grid gap-6 md:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {whatWeDo.map((item) => (
            <motion.article key={item.title} variants={fadeUp} className="glass rounded-2xl p-6">
              <item.icon className="h-7 w-7 text-aurumSoft" />
              <h3 className="mt-4 font-display text-xl font-medium text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="section-shell py-16">
        <SectionHeading
          eyebrow="Why Join Nexora"
          title="High Standards. High Growth. High Ownership."
          description="You are not joining a student club. You are joining a disciplined innovation collective."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-display text-2xl text-white">{reason.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{reason.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-16">
        <SectionHeading
          eyebrow="Recent Projects"
          title="Live Innovation Pipeline"
          description="Freshly updated projects fetched from the Nexora backend."
        />
        {loading ? (
          <LoadingSpinner text="Loading recent initiatives..." />
        ) : (
          <motion.div
            className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </motion.div>
        )}
      </section>

      <section className="section-shell py-16">
        <SectionHeading
          eyebrow="Testimonials"
          title="Future-Ready Social Proof Layer"
          description="Dedicated testimonial architecture is ready for investor updates and contributor success stories."
        />
        <div className="mt-8 rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-sm text-slate-300">
          Testimonial module is intentionally reserved for validated stories from shipped products and accepted contributors.
        </div>
      </section>

      <section className="section-shell pb-20 pt-8">
        <div className="rounded-3xl border border-aurum/30 bg-gold-radial p-10 text-center shadow-glow">
          <p className="text-xs uppercase tracking-[0.3em] text-aurumSoft">Final Call</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold text-white md:text-5xl">
            Build What Matters with People Who Execute.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-slate-200">
            Whether you are an engineer, product thinker, or technical operator, Nexora is where bold ideas become deployed systems.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/apply"
              className="rounded-xl bg-gradient-to-r from-aurum to-amber-300 px-7 py-3 text-sm font-semibold text-midnight transition hover:brightness-110"
            >
              Join Nexora
            </Link>
            <Link
              to="/projects"
              className="rounded-xl border border-white/20 bg-midnight/60 px-7 py-3 text-sm font-semibold text-white transition hover:border-aurum/40 hover:text-aurumSoft"
            >
              Review Open Projects
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
