import type { Deck, FinderFile, Spec, Step } from "./types";

export const TYPE_CPS = 34;
export const REPLY_CPS = 75;

export type Message =
  | { kind: "user"; text: string }
  | { kind: "plan"; items: string[] }
  | { kind: "tool"; label: string }
  | { kind: "reply"; text: string };

export type State = {
  caption: { text: string; focus?: string } | null;
  cursor: { to: string | null; carry?: string; clickAt?: number };
  attached: string | null;
  composer: string;
  messages: Message[];
  done: number[];
  files: FinderFile[];
  newFile: string | null;
  preview: { file: string; deck: Deck } | null;
  tryIt: Extract<Step, { type: "tryIt" }> | null;
  waiting: Extract<Step, { type: "expect" }> | null;
};

export function initialState(spec: Spec): State {
  return {
    caption: null,
    cursor: { to: null },
    attached: null,
    composer: "",
    messages: [],
    done: [],
    files: spec.desktop.files,
    newFile: null,
    preview: null,
    tryIt: null,
    waiting: null,
  };
}

export function apply(prev: State, step: Step, i: number): State {
  // Leaving an "expect" step clears its instruction caption.
  const s = { ...prev, waiting: null, caption: prev.waiting ? null : prev.caption };
  switch (step.type) {
    case "caption":
      return { ...s, caption: { text: step.text, focus: step.focus } };
    case "cursor":
      return {
        ...s,
        cursor: { to: step.to, carry: step.carry, clickAt: step.click ? i : undefined },
      };
    case "attach":
      return { ...s, attached: step.folder, cursor: { ...s.cursor, carry: undefined } };
    case "type":
      return { ...s, composer: step.text };
    case "send":
      return {
        ...s,
        composer: "",
        messages: [...s.messages, { kind: "user", text: s.composer }],
      };
    case "plan":
      return { ...s, messages: [...s.messages, { kind: "plan", items: step.items }] };
    case "tool":
      return {
        ...s,
        messages: [...s.messages, { kind: "tool", label: step.label }],
        done: step.done === undefined ? s.done : [...s.done, step.done],
      };
    case "file":
      return { ...s, files: [...s.files, step.file], newFile: step.file.name };
    case "reply":
      return { ...s, messages: [...s.messages, { kind: "reply", text: step.text }] };
    case "open":
      return { ...s, preview: { file: step.file, deck: step.deck } };
    case "tryIt":
      return { ...s, caption: null, tryIt: step };
    case "expect":
      return { ...s, caption: { text: step.prompt }, cursor: { to: null }, waiting: step };
  }
}

export function stateAt(spec: Spec, index: number): State {
  return spec.steps.slice(0, index + 1).reduce(apply, initialState(spec));
}

const words = (t: string) => t.split(/\s+/).length;

export function duration(step: Step): number {
  switch (step.type) {
    case "caption":
      return 800 + words(step.text) * 220;
    case "cursor":
      return step.click ? 1300 : 1000;
    case "attach":
      return 800;
    case "type":
      return 700 + (step.text.length / TYPE_CPS) * 1000;
    case "send":
      return 700;
    case "plan":
      return 2200;
    case "tool":
      return 1100;
    case "file":
      return 1400;
    case "reply":
      return 1200 + (step.text.length / REPLY_CPS) * 1000;
    case "open":
      return 1600;
    case "tryIt":
    case "expect":
      return Infinity;
  }
}
