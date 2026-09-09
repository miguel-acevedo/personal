import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout title="About">
      <article className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Miguel Acevedo
        </h1>

        <p className="text-foreground/80 leading-relaxed">
          I was born in Michoacán, Mexico and now live in San Francisco.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          Previously, I was building an AI tutor for teaching the skills of the
          future. Along the way I learned that the best way to teach those skills
          isn&rsquo;t to teach them at all. It&rsquo;s to build a place where you
          learn by doing the work you actually want to be doing. Now I&rsquo;m
          working on{" "}
          <a
            href="https://marbleos.com"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            MarbleOS
          </a>
          , exploring what broader AI adoption and diffusion could look like.
        </p>

        <p className="text-foreground/80 leading-relaxed">
          You can find me on{" "}
          <a
            href="https://x.com/miguelace_"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            X
          </a>
          , or reach me via{" "}
          <a href="mailto:miguel.acevedo0461@gmail.com" className="underline">
            email
          </a>
          .
        </p>
      </article>
    </Layout>
  );
}
