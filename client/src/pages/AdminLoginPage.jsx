import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import { pageTransition } from "../animations/motionVariants";
import { useAuth } from "../hooks/useAuth";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email, password });
      const destination = location.state?.from?.pathname || "/admin";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="section-shell py-16" variants={pageTransition} initial="hidden" animate="visible" exit="exit">
      <div className="mx-auto max-w-lg">
        <SectionHeading
          eyebrow="Secure Access"
          title="Nexora Admin Login"
          description="JWT-protected admin environment with role-based access controls."
        />

        <form onSubmit={onSubmit} className="glass mt-8 space-y-5 rounded-2xl p-6 md:p-8">
          <label className="block text-sm">
            <span className="mb-2 block text-slate-200">Email</span>
            <input className="input-lux" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-slate-200">Password</span>
            <input
              className="input-lux"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-aurum to-amber-300 px-7 py-3 text-sm font-semibold text-midnight transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Authenticating..." : "Access Admin Dashboard"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminLoginPage;
