import type { Metadata } from "next";

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

import { Geist, Geist_Mono, Reenie_Beanie } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const reenieBeanie = Reenie_Beanie({
  variable: "--font-reenie-beanie",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Graysons Services",
  description: "Graysons Services Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${reenieBeanie.variable} h-full antialiased`}
    >

      <body className="flex flex-col">
        <Header/>
        
        <main>
          {children}
        </main>

        <Footer/>
      </body>

    </html>
  );
}
