import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import { pageTransition } from "../animations/motionVariants";
import { contactService } from "../services/contactService";

const inquiryOptions = ["Project Collaboration", "Client Inquiry", "Join Nexora", "General Question"];

const initialForm = {
  fullName: "",
  email: "",
  inquiryType: inquiryOptions[0],
  message: ""
};

const ContactPage = () => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const remainingChars = useMemo(() => Math.max(0, 20 - form.message.trim().length), [form.message]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await contactService.submit({
        name: form.fullName.trim(),
        email: form.email.trim(),
        inquiryType: form.inquiryType,
        message: form.message.trim()
      });

      setSuccessMessage("Thank you for reaching out. Team Nexora will respond within 24 hours.");
      setForm(initialForm);
    } catch (error) {
      const validationError = error?.response?.data?.errors?.[0]?.msg;
      setErrorMessage(validationError || error?.response?.data?.message || "Unable to submit your inquiry right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div className="section-shell py-16" variants={pageTransition} initial="hidden" animate="visible" exit="exit">
      <SectionHeading
        eyebrow="Contact Team Nexora"
        title="Let Us Build, Collaborate, or Solve Together"
        description="One unified channel for developers, clients, and collaborators to reach the Nexora team."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={onSubmit} className="glass rounded-2xl p-6 md:p-8">
          <div className="grid gap-5">
            <label className="text-sm">
              <span className="mb-2 block text-slate-200">Full Name</span>
              <input
                className="input-lux"
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                placeholder="Your full name"
                required
              />
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-slate-200">Email</span>
              <input
                className="input-lux"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-slate-200">Inquiry Type</span>
              <select className="input-lux" name="inquiryType" value={form.inquiryType} onChange={onChange} required>
                {inquiryOptions.map((option) => (
                  <option key={option} value={option} className="bg-midnight">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-2 block text-slate-200">Message</span>
              <textarea
                className="input-lux min-h-40 resize-y"
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Share your requirement, context, and expected outcome."
                minLength={20}
                required
              />
              <span className={`mt-2 block text-xs ${remainingChars === 0 ? "text-emerald-300" : "text-slate-400"}`}>
                {remainingChars === 0 ? "Message length requirement met" : `${remainingChars} more characters required`}
              </span>
            </label>

            {errorMessage && <p className="text-sm text-rose-300">{errorMessage}</p>}
            {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-gradient-to-r from-aurum to-amber-300 px-7 py-3 text-sm font-semibold text-midnight transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        <aside className="glass rounded-2xl p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-aurumSoft">Direct Channel</p>
          <h3 className="mt-4 font-display text-3xl text-white">Team Nexora Contact Desk</h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Every inquiry is reviewed by the Nexora team. We respond with clear next steps and timeline expectations.
          </p>
          <div className="mt-6 space-y-3 rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Response SLA</p>
            <p className="text-sm text-white">Within 24 hours</p>
            <p className="text-xs text-slate-300">For urgent business matters, include context and desired decision timeline.</p>
          </div>
          <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Inquiry Types</p>
            <ul className="space-y-2 text-sm text-slate-200">
              <li>Project Collaboration</li>
              <li>Client Inquiry</li>
              <li>Join Nexora</li>
              <li>General Question</li>
            </ul>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default ContactPage;
