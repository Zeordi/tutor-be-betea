import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tutor Be Betea | Admin Console",
  description: "Super Admin Console for Tutor Be Betea",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="admin-shell">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-title">Tutor Be Betea</div>
            <div style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
              Admin Console
            </div>

            <a href="/">Dashboard</a>
            <a href="/users">Users</a>
            <a href="/verification">Verification Queue</a>
            <a href="/contracts">Contracts & Escrow</a>
            <a href="/attendance">Attendance</a>
            <a href="/tickets">Support Tickets</a>
            <a href="/audit-logs">Audit Logs</a>
            <a href="/analytics">Analytics</a>
            <a href="/settings">Settings</a>
          </aside>

          {/* Main Content */}
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}