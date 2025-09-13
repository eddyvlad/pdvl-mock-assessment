import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDVL Mock Assessments",
  description: "Practice exams for the PDVL course",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
