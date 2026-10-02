export type Scene = {
  id: string;
  label: string;
  start: number;
  title: string;
  caption: string;
  principle: string;
  state: "context" | "attach" | "prompt" | "generate" | "verify" | "revise";
  cursor: { from: [number, number]; to: [number, number] };
};

// The renderer consumes this scenario. This first example is authored, not live model output.
export const scenario = {
  id: "northstar-client-update",
  title: "From project files to a client presentation",
  duration: 72,
  context:
    "An account lead at a small design studio is preparing a monthly update for Northstar, a retail client. They have the project brief, meeting notes, and campaign results, but no presentation yet.",
  objective:
    "Provide relevant context, specify an audience and outcome, and check a generated claim against its source.",
  prompt:
    "Create a 5-slide PowerPoint for our monthly Northstar client review. Use these files. The audience is their marketing lead. Cover progress, results, and the decision we need on next month’s campaign. Include sources for the numbers, and flag anything the files don’t support.",
  revision:
    "Lead with the decision: should we extend the campaign? Keep the 25% result, but make clear that it’s a comparison with last month, not proof the campaign caused the increase.",
  files: [
    {
      id: "brief",
      name: "Project brief.pdf",
      type: "PDF",
      size: "124 KB",
      description: "The goal, audience, and scope",
      text: "NORTHSTAR / PROJECT BRIEF\n\nObjective\nHelp Northstar introduce its new collection through a four-week email campaign.\n\nAudience\nExisting subscribers. The client’s marketing lead approves next month’s scope.\n\nDeliverable\nA monthly review covering progress, results, and the decision on extending the campaign.\n\nConstraint\nAn extension needs client approval. No additional budget has been approved.",
    },
    {
      id: "notes",
      name: "Review notes.txt",
      type: "TXT",
      size: "3 KB",
      description: "What happened and what comes next",
      text: "NORTHSTAR / REVIEW NOTES\n\nSeptember 28\n\n• Four campaign emails delivered on schedule.\n• Client feedback: product photography is working well.\n• Next month’s creative is ready to scope.\n• Decision needed: extend the campaign for another four weeks?\n• We have month-over-month totals, but no controlled test. Do not attribute the entire increase to the campaign.",
    },
    {
      id: "results",
      name: "Campaign results.csv",
      type: "CSV",
      size: "2 KB",
      description: "The numbers behind the update",
      text: "period,visits,orders\nAugust,12000,360\nSeptember,15000,435\n\nVisit change: (15,000 − 12,000) ÷ 12,000 = 25%\nOrder change: (435 − 360) ÷ 360 ≈ 20.8%\n\nThese are observed monthly totals, not a measurement of causal campaign lift.",
    },
  ],
  scenes: [
    {
      id: "context",
      label: "Start with context",
      start: 0,
      title: "Your work is the starting point.",
      caption:
        "A client review is coming up. The brief, notes, and results already contain what you need. Start with those materials.",
      principle: "Start with a real task",
      state: "context",
      cursor: { from: [350, 505], to: [256, 274] },
    },
    {
      id: "attach",
      label: "Bring the right files",
      start: 9,
      title: "Give Claude the relevant material.",
      caption:
        "Attach the three project files. This supplies context for the conversation; it doesn’t give Claude access to your whole computer.",
      principle: "Choose useful context",
      state: "attach",
      cursor: { from: [264, 275], to: [821, 384] },
    },
    {
      id: "prompt",
      label: "Describe the outcome",
      start: 19,
      title: "Say who it’s for. Say what it should do.",
      caption:
        "Ask for a presentation with an audience, a purpose, and a clear output. Request sources and make uncertainty visible.",
      principle: "Define a useful outcome",
      state: "prompt",
      cursor: { from: [821, 384], to: [1056, 459] },
    },
    {
      id: "generate",
      label: "See a first draft",
      start: 32,
      title: "Let Claude assemble a starting point.",
      caption:
        "Claude combines the documents into a five-slide presentation. Treat the result as a draft you can inspect and improve.",
      principle: "Delegate the first draft",
      state: "generate",
      cursor: { from: [1056, 459], to: [860, 314] },
    },
    {
      id: "verify",
      label: "Check the evidence",
      start: 44,
      title: "A polished slide still needs a source check.",
      caption:
        "The slide says visits rose 25%. Compare it with the CSV: 12,000 to 15,000 is a 25% increase. That doesn’t establish what caused it.",
      principle: "Verify before you share",
      state: "verify",
      cursor: { from: [860, 314], to: [310, 336] },
    },
    {
      id: "revise",
      label: "Steer the result",
      start: 57,
      title: "Use your judgment to make it useful.",
      caption:
        "Ask for the decision to lead the deck, and preserve the distinction between an observed increase and a causal claim.",
      principle: "Keep the judgment yours",
      state: "revise",
      cursor: { from: [310, 336], to: [842, 306] },
    },
  ] satisfies Scene[],
};

export function sceneAt(time: number) {
  return (
    scenario.scenes.findLast((scene) => time >= scene.start) ??
    scenario.scenes[0]
  );
}

export function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
