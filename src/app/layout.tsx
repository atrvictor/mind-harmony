import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindHarmony - Piano Meditations & Yoga",
  description: "Experience the harmony of piano meditations, concerts, and yoga sessions with Victor Kulish.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-900`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
