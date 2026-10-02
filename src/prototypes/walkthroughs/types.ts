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

export type ConnectorIcon = "mail" | "calendar" | "drive" | "chat";

export type Connector = {
  name: string;
  by: string;
  description: string;
  icon: ConnectorIcon;
  connected?: boolean;
  // What the provider's sign-in window shows when the learner adds this connector.
  auth?: { provider: string; url: string; account: string; email: string; scopes: string[] };
};

export type Draft = { to: string; subject: string; preview: string; flag?: string };

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
  // Claude's + menu, optionally with its Connectors submenu open.
  | { type: "menu"; open: "plus" | "connectors" | null }
  | { type: "directory"; open: boolean }
  // The provider's sign-in window: pick an account, then review what Claude may access.
  | { type: "auth"; connector: string; screen: "account" | "consent" }
  | { type: "connect"; connector: string }
  | { type: "toggle"; connector: string; on: boolean }
  | { type: "drafts"; connector: string; items: Draft[] }
  // Waits for the learner instead of playing. Wrong answers get a hint from Claude.
  // "drop": drag a folder onto Claude. "pick": switch on a connector.
  | {
      type: "expect";
      action: "drop" | "pick";
      prompt: string;
      answer: string;
      hints: Record<string, string>;
      fallback: string;
    };

export type Spec = {
  id: string;
  title: string;
  learner: string;
  desktop: {
    apps: ("finder" | "claude")[];
    folder?: string;
    path?: string[];
    files?: FinderFile[];
    connectors?: Connector[];
  };
  steps: Step[];
};
