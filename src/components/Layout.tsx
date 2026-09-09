import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

const SITE_NAME = "Miguel Acevedo";
const SITE_URL = "https://mhacevedo.com";
const DEFAULT_DESCRIPTION = "I build and write about AI adoption.";

export default function Layout({
  children,
  title,
  description,
  image,
  appendSiteName = true,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  image?: string;
  appendSiteName?: boolean;
}) {
  const router = useRouter();

  const bareTitle = title ?? SITE_NAME;
  const documentTitle =
    title && appendSiteName ? `${title} — ${SITE_NAME}` : bareTitle;
  const metaDescription = description ?? DEFAULT_DESCRIPTION;

  const path = router.asPath.split(/[?#]/)[0];
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const imageUrl = image ? `${SITE_URL}${image}` : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{documentTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={url} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={bareTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={url} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}

        <meta
          name="twitter:card"
          content={imageUrl ? "summary_large_image" : "summary"}
        />
        <meta name="twitter:title" content={bareTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
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
