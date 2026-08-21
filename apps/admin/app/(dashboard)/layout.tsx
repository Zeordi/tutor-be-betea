export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] hidden lg:block">
        <div className="p-6">
          <h2 className="text-xl font-bold">Tutor Be Betea</h2>
          <p className="text-sm opacity-70 mt-1">Admin Console</p>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          <a href="/admin" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Dashboard
          </a>
          <a href="/admin/users" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Users
          </a>
          <a href="/admin/verification" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Verification Queue
          </a>
          <a href="/admin/contracts" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Contracts & Escrow
          </a>
          <a href="/admin/attendance" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Attendance
          </a>
          <a href="/admin/tickets" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Support Tickets
          </a>
          <a href="/admin/audit-logs" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Audit Logs
          </a>
          <a href="/admin/analytics" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Analytics
          </a>
          <a href="/admin/settings" className="block rounded-lg px-3 py-2 hover:bg-white/10">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-6">
          <h1 className="font-semibold text-[var(--foreground)]">Admin Panel</h1>
          <div className="text-sm text-[var(--secondary)]">
            Super Admin
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
