import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

import SecurityShield from "@/components/SecurityShield";
import LoadingScreen from "@/components/LoadingScreen";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://diuskyward.vercel.app"
  ),
  title: "DIU Skyward | Flagship Program | Rocket and Satellite Research Initiative",
  description: "DIU Skyward is a student-led aerospace engineering initiative focused on rockets, satellites and robotics.",
  openGraph: {
    title: "DIU Skyward Aerospace Program",
    description: "Rocket and Satellite Research Initiative",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

import HideOnAdmin from "@/components/HideOnAdmin";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans bg-rl-black text-rl-white flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <LoadingScreen />
        <SecurityShield />
        <HideOnAdmin>
          <Navbar />
        </HideOnAdmin>
        <main className="flex-grow">
          {children}
        </main>
        <HideOnAdmin>
          <Footer />
        </HideOnAdmin>
      </body>
    </html>
  );
}
