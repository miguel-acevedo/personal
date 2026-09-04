import Link from "next/link";
import Head from "next/head";
import type { ReactNode } from "react";

const SITE_NAME = "Miguel Acevedo";

export default function Layout({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const pageTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <header className="border-b">
        <nav className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-6 text-sm">
          <Link href="/" className="font-semibold">
            miguel
          </Link>
          <div className="flex gap-4 text-muted-foreground">
            <Link href="/posts" className="hover:text-foreground">
              Posts
            </Link>
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}
