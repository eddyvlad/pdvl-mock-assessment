import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from './theme-toggle';
import NavBar from '@/components/nav-bar';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ReactNode } from 'react';

const host = process.env.HOST ?? 'http://localhost:3000';
export const metadata: Metadata = {
  metadataBase: new URL(host),
  title: 'PDVL Practice Tests',
  description: 'Practice tests for the Singapore PDVL course',
  openGraph: {
    title: 'PDVL Practice Tests',
    description: 'Study smarter for Singapore\'s PDVL: module notes, quizzes, and trick question practice built around the official syllabus. Fast reviews, instant feedback',
    locale: 'en_SG',
    url: '/',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'PDVL Practice Tests',
    }]
  }
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
