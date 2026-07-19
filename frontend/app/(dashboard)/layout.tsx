import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <Header />
        <MobileNav />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
