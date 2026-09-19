import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lead Finder",
  description: "Search local businesses and discover potential website leads.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-fg font-sans antialiased">{children}</body>
    </html>
  );
}
