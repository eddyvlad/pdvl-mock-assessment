import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from './theme-toggle';
import NavBar from '@/components/nav-bar';

export const metadata: Metadata = {
  title: 'PDVL Mock Assessments',
  description: 'Practice exams for the PDVL course',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body>
    <NavBar/>
    {children}
    <ThemeToggle/>
    </body>
    </html>
  );
}
