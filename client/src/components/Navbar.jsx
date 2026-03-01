import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/apply", label: "Join Us" },
  { to: "/contact", label: "Contact" }
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-midnight/60 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-white">
          TEAM <span className="luxury-text">NEXORA</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm transition ${isActive ? "text-aurumSoft" : "text-slate-300 hover:text-white"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && (user?.role === "admin" || user?.role === "lead") ? (
            <Link
              to="/admin"
              className="rounded-lg border border-aurum/40 bg-aurum/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-aurumSoft"
            >
              Admin
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:border-aurum/40 hover:text-aurumSoft"
            >
              Team Login
            </Link>
          )}

          {isAuthenticated && (
            <button
              onClick={logout}
              className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-300 hover:text-white"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
