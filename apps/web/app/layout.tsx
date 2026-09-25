import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Tutor Be Betea | Verified Tutors in Ethiopia",
  description:
    "Ethiopia's premier home and online tutoring platform. Verified tutors, escrow-protected payments, and weekly progress reports.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}