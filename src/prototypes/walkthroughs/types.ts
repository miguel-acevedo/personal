export type FileKind = "docx" | "xlsx" | "pdf" | "pptx" | "folder";

export type FinderFile = {
  name: string;
  kind: FileKind;
  modified: string;
  size: string;
};

export type Deck = {
  slideCount: number;
  slide: {
    number: number;
    title: string;
    chart: {
      values: number[];
      unit: string;
      flag: number;
      note: string;
    };
    notes: string;
  };
};

// A walkthrough is a list of steps. The spec says what happens;
// the engine decides how long each step takes.
export type Step =
  | { type: "caption"; text: string; focus?: string }
  | { type: "cursor"; to: string; click?: boolean; carry?: string }
  | { type: "attach"; folder: string }
  | { type: "type"; text: string }
  | { type: "send" }
  | { type: "plan"; items: string[] }
  | { type: "tool"; label: string; done?: number }
  | { type: "file"; file: FinderFile }
  | { type: "reply"; text: string }
  | { type: "open"; file: string; deck: Deck }
  | { type: "tryIt"; title: string; text: string; prompt: string }
  // Waits for the learner instead of playing. Wrong answers get a hint from Claude.
  | {
      type: "expect";
      action: "drop";
      prompt: string;
      answer: string;
      hints: Record<string, string>;
      fallback: string;
    };

export type Spec = {
  id: string;
  title: string;
  learner: string;
  desktop: { folder: string; path: string[]; files: FinderFile[] };
  steps: Step[];
};
