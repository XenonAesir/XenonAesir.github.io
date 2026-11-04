"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

function NavContent({ className = "" }: { className?: string }) {
  return (
    <nav
      className={`mx-auto flex w-full max-w-6xl items-center justify-between px-6 sm:px-10 ${className}`}
    >
      <Link href="/" className="font-heading text-lg tracking-wide">
        Xenon Aesir
      </Link>
      <div className="flex items-center gap-6 text-sm font-light text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          首页
        </Link>
        <Link href="/blog" className="transition-colors hover:text-foreground">
          博客
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* 首屏内的导航：随页面滚走 */}
      <header className="relative z-50">
        <NavContent className="h-20" />
        <div className="nav-rule" aria-hidden />
      </header>

      {/* 滚过首屏后淡入的常驻导航 */}
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-md transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        inert={!scrolled}
      >
        <NavContent className="h-16" />
        <div className="nav-rule" aria-hidden />
      </header>
    </>
  );
}
