import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fomo — Don't Miss Out",
  description: "Posts that disappear. Save them or lose them forever.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-fomo-bg text-gray-200 antialiased">
        <nav className="sticky top-0 z-50 border-b border-fomo-border bg-fomo-bg/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
            <a href="/" className="text-xl font-bold tracking-tight">
              <span className="text-fomo-amber">fomo</span>
              <span className="ml-1 text-xs text-fomo-muted">⏳</span>
            </a>
            <div className="flex items-center gap-3">
              <a
                href="/saved"
                className="rounded-lg px-3 py-1.5 text-sm text-gray-400 transition hover:bg-fomo-card hover:text-white"
              >
                Saved
              </a>
              <a
                href="/profile"
                className="rounded-lg px-3 py-1.5 text-sm text-gray-400 transition hover:bg-fomo-card hover:text-white"
              >
                Profile
              </a>
              <a
                href="/post"
                className="rounded-lg bg-fomo-amber px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
              >
                + Post
              </a>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
