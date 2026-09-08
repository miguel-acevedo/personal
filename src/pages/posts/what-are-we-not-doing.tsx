import Link from "next/link";
import Layout from "@/components/Layout";

export default function WhatAreWeNotDoing() {
  return (
    <Layout title="What Are We Not Doing?">
      <article className="space-y-4">
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground tabular-nums">
            2026-09-07
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            What Are We Not Doing?
          </h1>
        </header>

        <p className="text-foreground/80 leading-relaxed">
          I know the director of a volunteer-run immigration center in San
          Francisco. He&rsquo;s reluctant to introduce AI into his team&rsquo;s
          work because he worries about people taking shortcuts. He wants them to
          understand the families they&rsquo;re helping, ask the right questions,
          and think carefully. A superficial conclusion could affect
          someone&rsquo;s whole life.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          I think that&rsquo;s a reasonable concern. If the introduction to AI is
          &ldquo;it can write your first draft,&rdquo; then the question becomes
          whether you want people delegating that part of their thinking. For
          him, the process itself matters. Going through it is part of how people
          learn to do the work well.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          But I keep coming back to a different question: what is his team{" "}
          <em>not</em> doing because they don&rsquo;t have enough time? What
          questions go unexplored? Could they investigate similar cases more
          thoroughly, or arrive at a conversation with a deeper understanding of
          the circumstances? Those possibilities deserve an experiment, too.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Resource constraints shape what people even think to attempt. After
          years of having too little time or too few people, you organize your
          work around what seems feasible. Some questions stop making it onto the
          agenda. You might forget they were ever questions you wanted to pursue.
          Giving someone a more capable tool doesn&rsquo;t automatically make
          them revisit those boundaries.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          In my{" "}
          <Link href="/posts/the-discovery-problem" className="underline">
            last essay
          </Link>
          , I wrote about the difficulty of discovering what AI can do. This is
          one reason that problem matters. Someone can understand their work
          deeply and still have a limited picture of what they could undertake
          with more help. The expertise to recognize a worthwhile problem and the
          ability to put AI to work on it don&rsquo;t necessarily belong to the
          same person.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          And telling people to experiment more doesn&rsquo;t really solve this.
          Experimentation takes time, and you need some reason to believe it will
          be worthwhile. Why should running an immigration center require becoming
          an AI enthusiast?
        </p>

        <p className="text-foreground/80 leading-relaxed">
          I think the system needs to take on more of that work. It should help
          people recognize opportunities that matter to them and make a first
          attempt approachable. For this director, a useful starting point might
          be: <em>What do you wish your team had the time to understand more
          thoroughly?</em> From there, it could help propose a specific
          investigation whose results the team can examine. His commitment to
          careful work becomes the reason to try.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          In{" "}
          <a
            href="https://openai.com/index/an-alien-mind/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            &ldquo;An Alien Mind,&rdquo;
          </a>{" "}
          Jakub Pachocki writes about finding ways to &ldquo;keep people in the
          loop&rdquo; as AI increasingly participates in its own development. I
          think there&rsquo;s a related challenge in everyday work. Meaningful
          participation includes deciding which questions deserve attention and
          recognizing when something previously out of reach becomes possible.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          As machines become more capable, we need systems that help people
          become more capable of directing them. The people who understand the
          families, the communities, and the problems should be able to put that
          understanding to work on a larger scale. Helping them discover what they
          can now attempt is part of bringing them along.
        </p>

        <footer className="pt-6">
          <Link href="/posts" className="text-sm underline">
            ← All posts
          </Link>
        </footer>
      </article>
    </Layout>
  );
}
