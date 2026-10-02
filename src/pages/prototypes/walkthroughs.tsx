import Head from "next/head";
import Walkthroughs, { type Example } from "@/prototypes/walkthroughs/Walkthrough";
import type { Spec } from "@/prototypes/walkthroughs/types";
import teacher from "@/prototypes/walkthroughs/specs/teacher.json";
import teacherTry from "@/prototypes/walkthroughs/specs/teacher-try.json";
import bakery from "@/prototypes/walkthroughs/specs/bakery.json";
import bakeryTry from "@/prototypes/walkthroughs/specs/bakery-try.json";

// The first example is the one shown on load.
const examples: Example[] = [
  {
    id: "bakery",
    label: "Bakery owner",
    who: "a small bakery owner",
    watch: { spec: bakery as Spec, file: "bakery.json" },
    try: { spec: bakeryTry as Spec, file: "bakery-try.json" },
  },
  {
    id: "teacher",
    label: "Biology teacher",
    who: "a high school biology teacher",
    watch: { spec: teacher as Spec, file: "teacher.json" },
    try: { spec: teacherTry as Spec, file: "teacher-try.json" },
  },
];

export default function WalkthroughsPage() {
  return (
    <>
      <Head>
        <title>Claude Walkthroughs — Prototype</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Walkthroughs examples={examples} />
    </>
  );
}
