import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="border-b">
            <nav className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-6">
              <Link href="/" className="font-semibold">
                Xenon Aesir
              </Link>
              <div className="flex items-center gap-5 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                  首页
                </Link>
                <Link href="/blog" className="hover:text-foreground">
                  博客
                </Link>
                <ThemeToggle />
              </div>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">{children}</main>
          <footer className="border-t">
            <div className="mx-auto w-full max-w-3xl px-6 py-6 text-sm text-muted-foreground">
              © Xenon Aesir
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
