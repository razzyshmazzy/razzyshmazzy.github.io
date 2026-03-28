import type { Metadata } from "next";
import { Quicksand, Rationale, Orbitron } from "next/font/google";
import "./globals.css";
import NightSky from "@/components/NightSky";

const quicksand = Quicksand({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const rationale = Rationale({
  variable: "--font-rationale",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "razzyshmazzy's portfolio",
  description: "Personal portfolio of razzyshmazzy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${rationale.variable} ${orbitron.variable}`}>
      <body>
        <NightSky />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/aincrad.png" alt="" aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, zIndex: 100, pointerEvents: "none" }} />
        <div className="sun-orb" style={{ position: "absolute", zIndex: 100 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sun-avatar" src="/avatar.png" alt="" aria-hidden="true" />
          <div className="plasma p1" />
          <div className="plasma p2" />
          <div className="plasma p3" />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
