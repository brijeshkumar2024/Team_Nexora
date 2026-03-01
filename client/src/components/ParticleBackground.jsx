import { motion } from "framer-motion";

const particles = Array.from({ length: 18 }).map((_, index) => ({
  id: index,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: 2 + Math.random() * 4,
  duration: 8 + Math.random() * 8
}));

const ParticleBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-aurum/40 blur-[1px]"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.15, 0.8, 0.15]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
