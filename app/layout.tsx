import { schoolTitle } from "@/lib/school";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: schoolTitle,
  description: "Coach-reviewed AI movement screening and athlete readiness, training, recovery, and reflection workflow.",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = { themeColor: "#6D1634", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
