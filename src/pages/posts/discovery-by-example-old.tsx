import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";

export default function DiscoveryByExampleOld() {
  return (
    <Layout
      title="Discovery by Example"
      description="Discovery is mostly a problem of imagination, and nobody imagines from nothing. Show someone one concrete example and they start finding what they actually want."
      image="/posts/example_widget_hn.png"
      appendSiteName={false}
    >
      <article className="space-y-4">
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground tabular-nums">
            2026-09-22
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Discovery by Example
          </h1>
        </header>

        <p className="text-foreground/80 leading-relaxed">
          In my{" "}
          <Link href="/posts/the-discovery-problem" className="underline">
            last essay
          </Link>
          , I argued that the biggest bottleneck to AI adoption is discovery.
          The system can do almost anything, but it needs you to already know
          what to ask for. Somehow, the interface has to start showing you the
          sky.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          The people who tinker find their own way. They try things, follow dead
          ends, and occasionally discover something useful enough to change how
          they work. Everyone else gets some of that knowledge secondhand: a
          video, a coworker, a friend who says, &ldquo;You should try
          this.&rdquo;
        </p>

        <p className="text-foreground/80 leading-relaxed">
          But as AI gains capabilities, there&rsquo;s more to discover. Learning
          what a tool could do six months ago doesn&rsquo;t tell you what you
          could be doing with it now.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          I&rsquo;ve come to think discovery is mostly a problem of imagination,
          and nobody imagines from nothing. Ask someone what an AI could do for
          them and you&rsquo;re asking them to invent from a blank page. Almost
          no one can. Show them one concrete example and something different
          happens. They start adjusting it: right idea, wrong subject. Right
          source, wrong people. The example gives them something to work with,
          and working with it is how they find what they actually want.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          We&rsquo;ve been trying to build that into an interface. Instead of
          asking what you want the AI to do, we ask what you want to keep an eye
          on. The first question stumps people. The second has answers: sales, a
          competitor, emails that need a reply. So we built widgets. Each one
          watches something and keeps it up to date in your workspace.
        </p>

        <div className="flex justify-center rounded-lg bg-[#35434E] px-4 py-10">
          <Image
            src="/posts/example_widget_hn.png"
            alt="A widget watching AI adoption on Hacker News, showing a ranked story with points and comments, updated a day ago."
            width={676}
            height={500}
            className="w-full max-w-sm h-auto rounded-lg"
          />
        </div>

        <p className="text-foreground/80 leading-relaxed">
          To show people how this might fit their own work, we made personalized
          examples. We read their website and mocked up a board of widgets around
          what they do, with sample data.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          One of the people we showed these to was Cassandra, who runs
          businesses in executive relocation and land-use consulting in Las
          Vegas. One widget got her thinking about how to introduce herself to
          potential clients. Another, a map of development news, brought up
          projects she&rsquo;d learned about too late: a cleared corner in her
          neighborhood, a construction company arriving in town, new towers in
          Henderson. Within minutes she was describing what she&rsquo;d want to
          know and listing other things she could track.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          She went home and built one. Six hours later she emailed us: a
          manufacturer had announced two months earlier that it was relocating
          to her city, she hadn&rsquo;t known, and she&rsquo;d already set a
          30-day plan.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          The examples didn&rsquo;t have to capture exactly what she wanted. They
          were concrete enough for her to see her own business in them, and
          that&rsquo;s what let her make the connections herself.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Michelle, a realtor Cassandra referred to us, saw an example about
          local knowledge and started describing the newsletter she writes and
          the hours she spends collecting community events for it. She wanted
          events near her clients&rsquo; neighborhoods and not the Strip, then
          companies relocating to the area, then developments that had just been
          permitted. Her goal: &ldquo;be ahead of what&rsquo;s going on in Las
          Vegas and in Henderson.&rdquo;
        </p>

        <p className="text-foreground/80 leading-relaxed">
          An example helps someone imagine a use you never showed them.
          Understand one widget that watches a topic and you can imagine it
          watching another. Swap the source, the subject, or the people, and a
          new use appears. A small, specific example hands someone a manageable
          piece of a much larger capability, and they can extend it without
          first understanding everything the system can do.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          A recommendation can be useful even when someone doesn&rsquo;t choose
          it. We might show them ten widgets and help them imagine an eleventh
          that fits their work better.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          So the recommendation panel puts the examples next to an open field:
          what would you like to keep an eye on? The examples get the ideas
          started, and the field gives them somewhere to go before they fade.
        </p>

        <Image
          src="/posts/discovery-recommendation-panel.png"
          alt="A recommendation panel asking what deserves your attention, with an open field and a set of example widgets for an executive-relocation business."
          width={2000}
          height={1172}
          className="w-full h-auto rounded-lg"
        />

        <p className="text-foreground/80 leading-relaxed">
          These are early conversations, but the moment that stays with me is
          when someone starts describing a use we never showed them. The example
          didn&rsquo;t give them the idea. It gave them enough to have one of
          their own.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          That&rsquo;s what I want an interface to make possible: help people see
          enough of what the system can do that they begin to see what they could
          do with it.
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
