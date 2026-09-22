import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import Layout from "@/components/Layout";

const ASSET_PATH = "/posts/discovery-by-example-astra";

// Frame the original screenshots in CSS so the full, unchanged captures remain
// available when readers open them. Coordinates use the source image's pixels.
function Screenshot({
  file,
  alt,
  width,
  height,
  crop = { x: 0, y: 0, width, height },
}: {
  file: string;
  alt: string;
  width: number;
  height: number;
  crop?: { x: number; y: number; width: number; height: number };
}) {
  return (
    <a
      href={`${ASSET_PATH}/${file}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open full screenshot in a new tab: ${alt}`}
      className="relative block cursor-zoom-in overflow-hidden rounded-lg ring-1 ring-black/10 focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ aspectRatio: `${crop.width} / ${crop.height}` }}
    >
      <Image
        src={`${ASSET_PATH}/${file}`}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 1100px) 1100px, 100vw"
        className="absolute h-auto max-w-none"
        style={{
          width: `${(width / crop.width) * 100}%`,
          left: `${(-crop.x / crop.width) * 100}%`,
          top: `${(-crop.y / crop.height) * 100}%`,
        }}
      />
    </a>
  );
}

const captionClass = "mt-3 text-sm leading-relaxed text-muted-foreground";
const wideFigureClass =
  "relative left-1/2 w-[min(1040px,calc(100vw-3rem))] -translate-x-1/2 py-5";

export default function DiscoveryByExampleAstra() {
  return (
    <Layout
      title="Discovery by Example — Astra"
      description="Discovery is mostly a problem of imagination, and nobody imagines from nothing. Show someone one concrete example and they start finding what they actually want."
      image={`${ASSET_PATH}/recommendation-panel.png`}
      appendSiteName={false}
    >
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <article className="space-y-4">
        <header className="space-y-2">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b pb-3 text-xs text-muted-foreground">
            <span>Astra draft · for review</span>
            <Link href="/posts/discovery-by-example" className="underline underline-offset-4">
              Read the original ↗
            </Link>
          </div>
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
          Christy, who co-owns a family agriculture business in southwest
          Michigan, described that starting point in a post about being new to
          AI. She and her husband do most of the work themselves, including
          running annual festivals about maple syrup and yaks. She wanted their
          businesses to run better, reach more people, and make more sales. But
          she was already stretched doing the marketing.
        </p>

        <figure className="py-5">
          <Screenshot
            file="christy-post.png"
            alt="Christy Olson's post, New to AI, describing her family agriculture business and wanting help with marketing, recognition, and sales."
            width={1552}
            height={712}
            crop={{ x: 40, y: 36, width: 1460, height: 494 }}
          />
          <figcaption className={captionClass}>
            &ldquo;I don&rsquo;t have all the brain space to do all the marketing
            that needs to be done.&rdquo; Christy knows the problem she wants help
            with. The specific uses of AI are still something to discover.
          </figcaption>
        </figure>

        <p className="text-foreground/80 leading-relaxed">
          We&rsquo;ve been trying to build that discovery into an interface. Instead of
          asking what you want the AI to do, we ask what you want to keep an eye
          on. The first question stumps people. The second has answers: sales, a
          competitor, emails that need a reply. So we built widgets. Each one
          watches something and keeps it up to date in your workspace.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          To show people how this might fit their own work, we made personalized
          examples. We read their website and mocked up a board of widgets around
          what they do, with sample data.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          I tried that flow using Christy&rsquo;s website, Maple Row Sugarhouse,
          and a short version of the need she described: &ldquo;I want AI to help
          with marketing and increase my sales.&rdquo; This was my walkthrough
          using her business as an example.
        </p>

        <figure className="py-5">
          <Screenshot
            file="website-and-goal.png"
            alt="Onboarding with maplerowsugarhouse.com and the goal: I want AI to help with marketing and increase my sales."
            width={2170}
            height={1368}
            crop={{ x: 610, y: 250, width: 960, height: 870 }}
          />
          <figcaption className={captionClass}>
            A website and a business goal provide the starting context. Open any
            image to see the full screenshot.
          </figcaption>
        </figure>

        <p className="text-foreground/80 leading-relaxed">
          The system reads the website to learn what the business does and who
          it serves. Here, it picks up the family&rsquo;s maple production,
          their southwest Michigan location, and an audience that includes
          gift buyers and visitors to seasonal events. Those details give the
          examples something to be about.
        </p>

        <figure className={wideFigureClass}>
          <Screenshot
            file="learning-about-the-business.png"
            alt="The system browsing Maple Row Sugarhouse's website alongside notes about its family maple production, southwest Michigan location, and customers."
            width={2014}
            height={1376}
            crop={{ x: 85, y: 335, width: 1820, height: 850 }}
          />
          <figcaption className={`${captionClass} mx-auto max-w-[624px]`}>
            The website supplies context about the products, customers, and
            events that could make a suggestion relevant.
          </figcaption>
        </figure>

        <p className="text-foreground/80 leading-relaxed">
          That context becomes a few things she could keep an eye on: upcoming
          maple events and their preparation, which product posts get a
          response, or which gift assortments attract sales. A broad goal like
          &ldquo;help with marketing&rdquo; now has concrete examples to react
          to. The previews use sample data to make those possibilities visible.
        </p>

        <figure className={wideFigureClass}>
          <div className="grid items-start gap-5 sm:grid-cols-2">
            <Screenshot
              file="widget-previews.png"
              alt="Sample seasonal maple event planner showing a Maple Education Weekend and a description of tracking preparation milestones."
              width={1788}
              height={1376}
              crop={{ x: 260, y: 402, width: 590, height: 435 }}
            />
            <Screenshot
              file="widget-previews.png"
              alt="Sample social-content widget showing a maple gift-box post and an example engagement count."
              width={1788}
              height={1376}
              crop={{ x: 951, y: 501, width: 594, height: 492 }}
            />
          </div>
          <figcaption className={`${captionClass} mx-auto max-w-[624px]`}>
            Examples about seasonal events and product marketing. The event and
            engagement figures are sample data, not Christy&rsquo;s business
            results.
          </figcaption>
        </figure>

        <p className="text-foreground/80 leading-relaxed">
          In conversations with other business owners, we&rsquo;ve seen what
          happens when someone has an example to work with. One of the people
          we showed personalized examples to was Cassandra, who runs
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

        <figure className={wideFigureClass}>
          <Screenshot
            file="recommendation-panel.png"
            alt="Maple Row Sugarhouse recommendations beside an open field asking What do you keep checking?, with options to customize widgets and connect Shopify or Brevo."
            width={2342}
            height={1376}
          />
          <figcaption className={`${captionClass} mx-auto max-w-[624px]`}>
            Back in the Maple Row Sugarhouse walkthrough, the examples sit next
            to an invitation: &ldquo;What do you keep checking?&rdquo; These
            previews still use sample data; the connected accounts would supply
            the business&rsquo;s own figures.
          </figcaption>
        </figure>

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
          <Link href="/drafts" className="text-sm underline">
            ← All drafts
          </Link>
        </footer>
      </article>
    </Layout>
  );
}
