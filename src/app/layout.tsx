import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Space_Mono,
  DM_Sans,
  Caveat,
  Ma_Shan_Zheng,
  Noto_Serif_SC,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const maShanZheng = Ma_Shan_Zheng({
  variable: "--font-ma-shan-zheng",
  weight: "400",
  subsets: ["latin"],
  preload: false,
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  title: "太一剑宗 Taiyi Sword Sect — Cultivate the Dao",
  description:
    "A digital sanctuary for wuxia cultivators. Nine gates, four scrolls, three elders — sword qi, still water, and the long path between you and the sky. 修行之路，始于足下。",
  keywords: [
    "wuxia",
    "cultivation",
    "xianxia",
    "sword sect",
    "修仙",
    "武侠",
    "anime.js",
  ],
  openGraph: {
    title: "太一剑宗 Taiyi Sword Sect — Cultivate the Dao",
    description:
      "Nine gates between you and the sky. A digital sanctuary for wuxia cultivators.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f1e9d7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-pt-24">
      <body
        className={`${fraunces.variable} ${spaceMono.variable} ${dmSans.variable} ${caveat.variable} ${maShanZheng.variable} ${notoSerifSC.variable} font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
