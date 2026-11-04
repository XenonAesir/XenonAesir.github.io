import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Great_Vibes } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 标题衬线字体；中文没有 Cormorant 字形，会落到 --font-heading 里的宋体栈
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

// IB 署名用的手写体，只有 400 一档，仅拉丁字形
const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Xenon Aesir",
    template: "%s · Xenon Aesir",
  },
  description: "Xenon Aesir 的个人主页与博客。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <header className="relative z-50">
            <nav className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
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
            <div className="nav-rule" aria-hidden />
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border/60">
            <div className="mx-auto w-full max-w-6xl px-6 py-8 text-xs tracking-[0.2em] text-muted-foreground sm:px-10">
              © XENON AESIR
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
