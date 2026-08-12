import type { Metadata } from 'next';
import {
  Cormorant_Garamond,
  DM_Sans,
} from 'next/font/google';

import { getSiteMetadata } from '@/features/site-settings/metadata';

import RevealObserver from '@/components/ui/reveal-observer-client';

import './globals.css';

export const dynamic = 'force-dynamic';


const dmSans = DM_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
  variable: '--font-cormorant-garamond',
});

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${dmSans.variable}
        ${cormorantGaramond.variable}
      `}
      data-scroll-behavior="smooth"
    >
      <body className="font-sans antialiased">
        <RevealObserver />
        {children}
      </body>
    </html>
  );
}