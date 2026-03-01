export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14
    }
  }
};

export const pageTransition = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
};
