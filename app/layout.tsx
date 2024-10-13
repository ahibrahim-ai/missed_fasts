import type { Metadata } from "next";
import { Inter } from 'next/font/google' ; 
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Missed Fasts Calculator",
  description: "Calculate what days you can make up your fasts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        
      >
        {children}
      </body>
    </html>
  );
}
