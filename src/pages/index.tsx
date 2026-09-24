import Link from "next/link";
import Layout from "@/components/Layout";
import { POSTS } from "@/lib/posts";

const WORK: { name: string; href?: string; description: string }[] = [
  {
    name: "MarbleOS",
    href: "https://marbleos.com",
    // description: "widgets that watch your work and keep it current",
    description: "helping people discover what AI can do for them",
  },
  {
    name: "Marble learning platform",
    href: "https://withmarble.ai",
    description: "project-based learning with an AI tutor",
  },
  {
    name: "LeetCode Tutor",
    href: "https://chromewebstore.google.com/detail/marble-leetcode-tutor/mpjcipoidkmiiebdbdfknmpncmnpoboe",
    description: "Socratic AI tutor for LeetCode",
  },
];

export default function Home() {
  return (
    <Layout>
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Hello.</h1>
        <p className="text-foreground/80 leading-relaxed">
          I build and write about AI adoption. More{" "}
          <Link href="/about" className="underline">
            about me
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Writing
        </h2>
        <ul className="space-y-3">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="group flex items-baseline justify-between gap-4"
              >
                <span className="group-hover:underline">{post.title}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {post.date}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Work
        </h2>
        <ul className="space-y-3">
          {WORK.map((item) => (
            <li key={item.name} className="leading-relaxed">
              {item.href ? (
                <a
                  href={item.href}
                  className="underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.name}
                </a>
              ) : (
                <span>{item.name}</span>
              )}
              <span className="text-foreground/80"> — {item.description}</span>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
