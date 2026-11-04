import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <header className="sticky top-4 z-50 mx-auto w-full max-w-3xl px-6">
            <nav className="glass-panel flex h-14 items-center justify-between rounded-2xl border border-border px-5">
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
          </header>
          <main className="mx-auto w-full max-w-3xl flex-1 px-6 pt-10 pb-20">{children}</main>
          <footer className="border-t border-border/60">
            <div className="mx-auto w-full max-w-3xl px-6 py-8 text-xs tracking-[0.2em] text-muted-foreground">
              © XENON AESIR
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
