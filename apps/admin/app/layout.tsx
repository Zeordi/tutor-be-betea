import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/ThemeProvider";

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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
