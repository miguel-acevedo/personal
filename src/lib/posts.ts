export type Post = {
  slug: string;
  title: string;
  date: string; // ISO: YYYY-MM-DD
  description?: string;
};

// Add a new entry here whenever you create a new file under src/pages/posts/.
// Order doesn't matter — POSTS is sorted by date (newest first) below.
const ALL_POSTS: Post[] = [
  {
    slug: "hello-world-v1",
    title: "Hello World v1",
    date: "2026-04-04",
    description: "The very first post.",
  },
  {
    slug: "hello-world-v2",
    title: "Hello World v2",
    date: "2026-04-05",
    description: "A slightly more polished hello.",
  },
  {
    slug: "ai-bandwidth-problem",
    title: "AI Has a Bandwidth Problem",
    date: "2026-08-25",
    description:
      "AI can start more work than we can track. The bottleneck is shifting from machine capability to human attention.",
  },
];

export const POSTS: Post[] = [...ALL_POSTS].sort((a, b) =>
  b.date.localeCompare(a.date)
);
