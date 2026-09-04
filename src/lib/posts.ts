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
    slug: "the-discovery-problem",
    title: "The Discovery Problem",
    date: "2026-09-03",
    description:
      "The biggest bottleneck to AI adoption isn't intelligence. It's discovery. The system can do almost anything, but it still requires you to already know what to ask for.",
  },
  // Temporarily hidden — kept for later.
  // {
  //   slug: "ai-bandwidth-problem",
  //   title: "AI Has a Bandwidth Problem",
  //   date: "2026-08-25",
  //   description:
  //     "AI can start more work than we can track. The bottleneck is shifting from machine capability to human attention.",
  // },
];

export const POSTS: Post[] = [...ALL_POSTS].sort((a, b) =>
  b.date.localeCompare(a.date)
);
