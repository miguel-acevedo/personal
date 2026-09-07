import Link from "next/link";
import Layout from "@/components/Layout";
import { DRAFTS } from "@/lib/posts";

export default function DraftsIndex() {
  return (
    <Layout title="Drafts">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Drafts</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Unpublished work-in-progress. Not linked from the main site.
      </p>
      {DRAFTS.length === 0 ? (
        <p className="text-sm text-muted-foreground">No drafts right now.</p>
      ) : (
        <ul className="space-y-6">
          {DRAFTS.map((post) => (
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
      )}
    </Layout>
  );
}
