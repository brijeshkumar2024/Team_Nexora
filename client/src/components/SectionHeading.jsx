import { motion } from "framer-motion";
import { fadeUp } from "../animations/motionVariants";

const SectionHeading = ({ eyebrow, title, description }) => (
  <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
    {eyebrow && <p className="mb-3 text-xs uppercase tracking-[0.24em] text-aurumSoft">{eyebrow}</p>}
    <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
    {description && <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">{description}</p>}
  </motion.div>
);

export default SectionHeading;
