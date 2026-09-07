"use client";

import { useState } from "react";
import Preloader from "@/components/wuxia/Preloader";
import Cursor from "@/components/wuxia/Cursor";
import SmoothScroll from "@/components/wuxia/SmoothScroll";
import Nav from "@/components/wuxia/Nav";
import Hero from "@/components/wuxia/Hero";
import Marquee from "@/components/wuxia/Marquee";
import Manifesto from "@/components/wuxia/Manifesto";
import Realms from "@/components/wuxia/Realms";
import Techniques from "@/components/wuxia/Techniques";
import Masters from "@/components/wuxia/Masters";
import Scripture from "@/components/wuxia/Scripture";
import Gate from "@/components/wuxia/Gate";
import SiteFooter from "@/components/wuxia/SiteFooter";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <div className="noise-overlay" aria-hidden="true" />
      <SmoothScroll />
      <Cursor />
      <Preloader onComplete={() => setLoaded(true)} />
      <Nav start={loaded} />

      <main className="flex-1">
        <Hero start={loaded} />
        <Marquee />
        <Manifesto />
        <Realms />
        <Techniques />
        <Masters />
        <Scripture />
        <Gate />
      </main>

      <SiteFooter />
    </div>
  );
}
