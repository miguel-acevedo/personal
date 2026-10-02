import Head from "next/head";
import Walkthroughs from "@/prototypes/walkthroughs/Walkthrough";
import type { Spec } from "@/prototypes/walkthroughs/types";
import teacher from "@/prototypes/walkthroughs/specs/teacher.json";
import teacherTry from "@/prototypes/walkthroughs/specs/teacher-try.json";

const specs = {
  watch: { spec: teacher as Spec, file: "teacher.json" },
  try: { spec: teacherTry as Spec, file: "teacher-try.json" },
};

export default function WalkthroughsPage() {
  return (
    <>
      <Head>
        <title>Claude Walkthroughs — Prototype</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Walkthroughs specs={specs} />
    </>
  );
}
