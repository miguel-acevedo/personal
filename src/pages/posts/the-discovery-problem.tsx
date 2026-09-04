import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";

export default function TheDiscoveryProblem() {
  return (
    <Layout title="The Discovery Problem">
      <article className="space-y-4">
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground tabular-nums">
            2026-09-03
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            The Discovery Problem
          </h1>
        </header>

        <p className="text-foreground/80 leading-relaxed">
          The biggest bottleneck to AI adoption is a simple question: what can
          this do for me?
        </p>

        <p className="text-foreground/80 leading-relaxed">
          The hard part is that you don&rsquo;t know what you don&rsquo;t know.
          You don&rsquo;t know what a button does until you press it. You
          don&rsquo;t know what a prompt can produce until you write it, hit go,
          and watch it run. As long as capabilities stay locked behind a blank
          text box, the possibilities stay invisible. That&rsquo;s a discovery
          problem, and it&rsquo;s the one we&rsquo;re still stuck on.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          There are partial fixes. Templates give people something to run
          without needing to invent the request themselves — but then the
          question becomes relevance. Do these templates actually match your
          work? Do you care? Context helps too: a system that knows about you can
          suggest things that matter to you instead of things that matter in
          general. Both help. Neither solves it.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Alan Kay has a metaphor for this. Imagine you&rsquo;re an ant at the
          bottom of the Grand Canyon. You look up, and your entire notion of the
          sky is a thin sliver of blue between two canyon walls. Someone standing
          on the rim sees the whole blue plane. Same sky, completely different
          sense of what exists. It&rsquo;s not that the ant is less capable — it
          just can&rsquo;t see the axis of possibility from where it&rsquo;s
          standing.
        </p>

        <Image
          src="/posts/ant-rim.png"
          alt="An ant at the bottom of a canyon sees only a sliver of sky, while a person on the rim sees the whole plane."
          width={1448}
          height={1086}
          className="w-full h-auto rounded-lg"
        />

        <p className="text-foreground/80 leading-relaxed">
          That&rsquo;s the gap between a skilled AI user and everyone else. Take
          a non-technical marketing person and someone fluent in agents and tool
          use. The agent-fluent person can watch the marketer work for an hour
          and immediately see a dozen things to automate, delegate, or reinvent —
          including things the marketer hasn&rsquo;t even tried yet. But put the
          most intelligent tool in the world in front of the marketer, and
          they&rsquo;re staring at a blank prompt, unsure what to type. All that
          intelligence, and no way to see it.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          This is the strange state we&rsquo;re in: the system could do almost
          anything, but it requires the user to already know what to ask for. Too
          much of the work of discovering what&rsquo;s possible falls on the
          person, when it should fall on the system. You&rsquo;d expect something
          this advanced to reveal its own capabilities — gradually, contextually,
          in ways that match your actual work. We&rsquo;re not there yet.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Somehow, the interface has to start showing you the sky.
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
