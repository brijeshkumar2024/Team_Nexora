import clsx from "clsx";

const statusMap = {
  recruiting: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  "in-development": "bg-amber-500/15 text-amber-200 border-amber-400/30",
  completed: "bg-sky-500/15 text-sky-200 border-sky-400/30",
  pending: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  accepted: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  rejected: "bg-rose-500/15 text-rose-300 border-rose-400/30"
};

const labels = {
  recruiting: "Recruiting",
  "in-development": "In Development",
  completed: "Completed",
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected"
};

const StatusBadge = ({ status }) => (
  <span
    className={clsx(
      "rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
      statusMap[status] || "border-white/20 bg-white/10 text-slate-200"
    )}
  >
    {labels[status] || status}
  </span>
);

export default StatusBadge;
