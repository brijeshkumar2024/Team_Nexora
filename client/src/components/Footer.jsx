const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="section-shell flex flex-col items-start justify-between gap-5 text-sm text-slate-300 md:flex-row md:items-center">
        <p>© {new Date().getFullYear()} Team Nexora. Engineering the Future.</p>
        <p>Built for bold builders, serious execution, and real product impact.</p>
      </div>
    </footer>
  );
};

export default Footer;
