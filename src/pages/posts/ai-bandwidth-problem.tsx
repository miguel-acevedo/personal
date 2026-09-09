import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";

export default function AiBandwidthProblem() {
  return (
    <Layout
      title="AI Has a Bandwidth Problem"
      description="AI can start more work than we can track. The bottleneck is shifting from machine capability to human attention."
      image="/posts/ai-bandwidth-problem.png"
      appendSiteName={false}
    >
      <article className="space-y-4">
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground tabular-nums">
            2026-08-25
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            AI Has a Bandwidth Problem
          </h1>
        </header>

        <Image
          src="/posts/ai-bandwidth-problem.png"
          alt="A person in a suit juggling many task cards labeled Market Research, Find Prospects, Customer Calls, Launch Plan, Follow-ups, and more."
          width={2162}
          height={1216}
          priority
          className="w-full h-auto rounded-lg"
        />

        <p className="text-foreground/80 leading-relaxed">
          AI can do more work every few months.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Models can now take actions across the web, work with files and
          external tools. Agents can work for minutes at a time, and we can run
          several of them at once.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          But there is a strange bottleneck emerging.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          The AI can increasingly do more work than we can comfortably keep
          track of.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Imagine having five agents working for you. A couple are doing
          research. One is finding potential customers. Another finished twenty
          minutes ago and left you a spreadsheet you haven&rsquo;t looked at
          yet.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          The models can handle this. Can you?
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Chat works very well when there is one main thread of attention. You
          ask something, get a response, ask a follow-up, and keep going.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Delegating work to agents is different. Every additional task creates
          state you have to keep track of. What was that agent doing? Did the
          other one finish? What was I waiting on?
        </p>

        <p className="text-foreground/80 leading-relaxed">
          At some point, the human becomes the bottleneck.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          We think this problem is especially important in knowledge work.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          A programmer might run several coding agents at once, but they often
          still operate inside the same general world: a shared codebase and a
          larger objective.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Knowledge work is much more scattered.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Someone working on a launch might be researching a market, finding
          people to contact, reviewing customer conversations, and preparing the
          launch itself. Each piece of work lives in a different context.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          The problem isn&rsquo;t that four things are happening. It&rsquo;s that
          each one asks you to hold a different context in your head.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          It feels a little like cooking five different dishes at once. Each dish
          might be manageable on its own, but together you have to remember what
          is in every pan, what needs attention next, and what you were doing
          before you got interrupted. Eventually something burns.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Each piece of work carries its own context. Every time you switch, you
          have to reconstruct what you knew, why it mattered, and what should
          happen next. That reconstruction has a cost.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          We already deal with this without AI. Our work is scattered across
          tabs, documents, messages, and different applications. We mentally
          stitch it together.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Agents can remove some of the manual work, but they can also make the
          coordination problem worse. If AI lets us start much more work, it can
          also create much more work that needs to be understood, checked,
          redirected, and acted on.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          AI is increasing machine bandwidth much faster than human bandwidth.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          This is where we think the interface matters.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Good interfaces move information out of your head and into the
          environment. A desktop shows what&rsquo;s open. A calendar holds your
          schedule. The interface carries some of the state for you.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Agentic work should work the same way.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          If I can glance at a workspace and understand what is running, what is
          waiting, and what has finished, I no longer need to carry all of that
          state in my head.
        </p>

        <p className="text-foreground leading-relaxed font-semibold">
          Visibility creates bandwidth.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Control matters too. The faster I can understand and redirect an
          agent, the less management overhead each additional task creates.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Clarity matters for the same reason. I should be able to see what an
          agent is doing, what it can access, and what it needs from me without
          reconstructing the conversation. The less I have to infer, the less
          attention it demands.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          This is part of what we&rsquo;re exploring with Marble.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          We don&rsquo;t think chat is going away. Chat is a great thinking
          surface.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          But we think agentic knowledge work needs something closer to a working
          surface: somewhere the state of your work remains visible, where you
          can leave one context, enter another, and come back without
          reconstructing everything from memory.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          There is a common assumption that as models get better, interfaces will
          matter less. Maybe we will eventually tell an AI what we want and walk
          away.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          We suspect the opposite may happen in knowledge work.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          When AI can only answer questions, a chat box is enough. When AI can
          take on many pieces of work at once, the challenge becomes
          understanding and directing that work without becoming overwhelmed.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          The question is no longer only:
        </p>

        <p className="text-foreground leading-relaxed font-semibold">
          How much work can an AI do?
        </p>

        <p className="text-foreground/80 leading-relaxed">It is also:</p>

        <p className="text-foreground leading-relaxed font-semibold">
          How much AI-powered work can one person effectively keep in motion?
        </p>

        <p className="text-foreground/80 leading-relaxed">
          The first number is increasing incredibly quickly.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          The second is still constrained by human attention, working memory, and
          interfaces designed around one conversation at a time.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          AI made doing work cheaper.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Now we need to make managing work cheaper.
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
