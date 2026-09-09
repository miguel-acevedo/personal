import Link from "next/link";
import Layout from "@/components/Layout";
import { POSTS } from "@/lib/posts";

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
    </Layout>
  );
}
