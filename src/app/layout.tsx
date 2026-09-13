import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from './theme-toggle';
import NavBar from '@/components/nav-bar';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ReactNode } from 'react';

const host = process.env.HOST ?? 'http://localhost:3000';
export const metadata: Metadata = {
  metadataBase: new URL(host),
  title: 'Steady Signal | PDVL Practice Tests',
  description: 'Clear, timed practice for Singapore\'s PDVL course.',
  openGraph: {
    title: 'Steady Signal | PDVL Practice Tests',
    description: 'Clear, timed practice for Singapore\'s PDVL course.',
    locale: 'en_SG',
    url: '/',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Steady Signal PDVL Practice Tests',
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
