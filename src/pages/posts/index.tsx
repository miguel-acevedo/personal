import Link from "next/link";
import Layout from "@/components/Layout";
import { POSTS } from "@/lib/posts";

export default function PostsIndex() {
  return (
    <Layout title="Posts">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Posts</h1>
      <ul className="space-y-6">
        {POSTS.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-medium group-hover:underline">
                  {post.title}
                </h2>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {post.date}
                </span>
              </div>
              {post.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {post.description}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
