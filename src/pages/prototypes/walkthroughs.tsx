import Head from "next/head";
import Walkthrough from "@/prototypes/walkthroughs/Walkthrough";
import type { Spec } from "@/prototypes/walkthroughs/types";
import teacher from "@/prototypes/walkthroughs/specs/teacher.json";

export default function WalkthroughsPage() {
  return (
    <>
      <Head>
        <title>Claude Walkthroughs — Prototype</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Walkthrough spec={teacher as Spec} />
    </>
  );
}
