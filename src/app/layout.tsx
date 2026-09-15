import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { ReactNode } from "react";
import NavBar from "@/components/nav-bar";
import { APP_VERSION } from "@/lib/app-version";
import { homepageDescription, homepageTitle, siteUrl } from "@/lib/site-metadata";
import ThemeToggle from "./theme-toggle";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: homepageTitle,
  description: homepageDescription,
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    locale: "en_SG",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Steady Signal PDVL Practice Tests",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID;

  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
        <footer className="site-footer">
          <p>v{APP_VERSION}</p>
        </footer>
        <ThemeToggle />
      </body>
      {googleAnalyticsId && <GoogleAnalytics gaId={googleAnalyticsId} />}
    </html>
  );
}
