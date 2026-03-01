import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="section-shell py-24 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-aurumSoft">404</p>
      <h1 className="mt-4 font-display text-5xl text-white">Route Not Found</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300">
        The page you requested does not exist in the Nexora environment.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-xl bg-gradient-to-r from-aurum to-amber-300 px-7 py-3 text-sm font-semibold text-midnight"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
