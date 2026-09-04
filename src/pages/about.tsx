import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout title="About">
      <article className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
        <p className="text-muted-foreground leading-relaxed">
          Hi, I&apos;m Miguel. This is my personal site.
        </p>
      </article>
    </Layout>
  );
}
