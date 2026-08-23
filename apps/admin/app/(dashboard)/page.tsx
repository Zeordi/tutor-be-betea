export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Parents", value: "—" },
    { label: "Verified Tutors", value: "—" },
    { label: "Active Contracts", value: "—" },
    { label: "Pending Verifications", value: "—" },
  ];

  return (
    <div>
      <h1 className="page-title">Executive Dashboard</h1>
      <p className="page-subtitle">Overview of platform performance</p>

      <div className="stat-grid">
        {stats.map((item) => (
          <div key={item.label} className="stat-card">
            <div className="stat-label">{item.label}</div>
            <div className="stat-value">{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }} className="card">
        <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 18, fontWeight: 700 }}>
          Quick Notes
        </h2>
        <p style={{ color: "var(--secondary)", margin: 0 }}>
          Connect this dashboard to the live API endpoint
          <code> /admin/dashboard </code>
          to show real numbers for parents, tutors, contracts, and pending verifications.
        </p>
      </div>
    </div>
  );
}