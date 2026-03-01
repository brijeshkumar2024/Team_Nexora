const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex min-h-[180px] flex-col items-center justify-center gap-3">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-aurum/40 border-t-aurum" />
    <p className="text-sm text-slate-300">{text}</p>
  </div>
);

export default LoadingSpinner;
