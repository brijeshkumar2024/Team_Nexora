const tabs = [
  { id: "overview", label: "Overview" },
  { id: "projects", label: "Projects" },
  { id: "applications", label: "Applications" },
  { id: "certificates", label: "Certificates" }
];

const AdminSidebar = ({ activeTab, onTabChange }) => {
  return (
    <aside className="glass rounded-2xl p-4">
      <p className="mb-4 text-xs uppercase tracking-[0.25em] text-aurumSoft">Admin Console</p>
      <div className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
              activeTab === tab.id
                ? "bg-aurum/20 text-aurumSoft"
                : "bg-white/0 text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default AdminSidebar;
