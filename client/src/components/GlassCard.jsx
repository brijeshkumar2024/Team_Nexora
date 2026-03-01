const GlassCard = ({ children, className = "" }) => {
  return <div className={`glass rounded-2xl shadow-card ${className}`}>{children}</div>;
};

export default GlassCard;
