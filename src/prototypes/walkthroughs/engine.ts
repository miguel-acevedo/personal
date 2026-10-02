import type { Deck, Draft, FinderFile, Spec, Step } from "./types";

export const TYPE_CPS = 34;
export const REPLY_CPS = 75;

export type Message =
  | { kind: "user"; text: string }
  | { kind: "plan"; items: string[] }
  | { kind: "tool"; label: string }
  | { kind: "reply"; text: string }
  | { kind: "drafts"; connector: string; items: Draft[] };

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
  menu: "plus" | "connectors" | null;
  directory: boolean;
  connectors: Record<string, { connected: boolean; on: boolean }>;
  browser: { connector: string; screen: "account" | "consent" } | null;
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
    files: spec.desktop.files ?? [],
    newFile: null,
    preview: null,
    menu: null,
    directory: false,
    connectors: Object.fromEntries(
      (spec.desktop.connectors ?? []).map((c) => [c.name, { connected: !!c.connected, on: false }]),
    ),
    browser: null,
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
        menu: null,
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
    case "menu":
      return { ...s, menu: step.open };
    case "directory":
      return { ...s, directory: step.open, menu: null };
    case "auth":
      // A new window takes over, so the previous caption no longer points at anything.
      return { ...s, caption: null, browser: { connector: step.connector, screen: step.screen } };
    case "connect":
      return {
        ...s,
        browser: null,
        connectors: { ...s.connectors, [step.connector]: { connected: true, on: true } },
      };
    case "toggle":
      return {
        ...s,
        connectors: {
          ...s.connectors,
          [step.connector]: { ...s.connectors[step.connector], on: step.on },
        },
      };
    case "drafts":
      return {
        ...s,
        messages: [...s.messages, { kind: "drafts", connector: step.connector, items: step.items }],
      };
    case "expect":
      return { ...s, caption: { text: step.prompt }, cursor: { to: null }, waiting: step };
  }
}

export function stateAt(spec: Spec, index: number): State {
  return spec.steps.slice(0, index + 1).reduce(apply, initialState(spec));
}

// A wrong answer shows the learner's choice and Claude's hint on top of the spec state.
export function withHint(state: State, choice: string): State {
  const w = state.waiting;
  if (!w) return state;
  const shown =
    w.action === "drop"
      ? { attached: choice }
      : { connectors: { ...state.connectors, [choice]: { connected: true, on: true } } };
  return {
    ...state,
    ...shown,
    messages: [...state.messages, { kind: "reply", text: w.hints[choice] ?? w.fallback }],
  };
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
    case "menu":
      return 700;
    case "directory":
      return 1000;
    case "auth":
      return 1200;
    case "connect":
    case "toggle":
      return 900;
    case "drafts":
      return 1200 + step.items.length * 350;
    case "tryIt":
    case "expect":
      return Infinity;
  }
}
