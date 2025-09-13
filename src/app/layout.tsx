import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from './theme-toggle';
import NavBar from '@/components/nav-bar';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'PDVL Mock Assessments',
  description: 'Practice exams for the PDVL course',
};

export default function RootLayout({children}: { children: ReactNode }) {
  const googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID;

  return (
    <html lang="en">
    <body>
    <NavBar/>
    {children}
    <ThemeToggle/>
    </body>
    {googleAnalyticsId && <GoogleAnalytics gaId={googleAnalyticsId}/>}
    </html>
  );
}
