import type { DragEvent, ReactNode } from "react";
import {
  ArrowUp,
  Blocks,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  FileSpreadsheet,
  FileText,
  Flag,
  Folder,
  HardDrive,
  LibraryBig,
  LoaderCircle,
  Lock,
  Mail,
  MessageSquare,
  Paperclip,
  Plus,
  Presentation,
  Calendar,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { REPLY_CPS, TYPE_CPS, type Message, type State } from "./engine";
import type { Connector, ConnectorIcon, Deck, FileKind } from "./types";
import Typed from "./Typed";
import s from "./walkthroughs.module.css";

type Box = { x: number; y: number; w: number; h: number };

export const LAYOUT = {
  finder: { x: 36, y: 60, w: 560, h: 330 },
  claude: { x: 628, y: 44, w: 616, h: 600 },
  // Claude on its own, when the desktop has no Finder.
  claudeSolo: { x: 290, y: 44, w: 700, h: 600 },
  browser: { x: 400, y: 110, w: 480, h: 450 },
  preview: { x: 70, y: 196, w: 600, h: 404 },
} satisfies Record<string, Box>;

export function Window({
  id,
  box,
  title,
  children,
}: {
  id: string;
  box: Box;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={s.window}
      data-wt={id}
      style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
    >
      <div className={s.windowHeader}>
        <div className={s.windowControls}>
          <span className={s.close} />
          <span className={s.minimize} />
          <span className={s.maximize} />
        </div>
        <div className={s.windowTitle}>{title}</div>
      </div>
      <div className={s.windowBody}>{children}</div>
    </div>
  );
}

export function MenuBar() {
  return (
    <div className={s.menuBar}>
      <div className={s.menuGroup}>
        <b>Finder</b>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Go</span>
        <span>Window</span>
      </div>
      <div className={s.menuGroup}>
        <span>Mon 7:42 AM</span>
      </div>
    </div>
  );
}

export function Dock({ previewOpen, browserOpen }: { previewOpen: boolean; browserOpen: boolean }) {
  const items = [
    { label: "Finder", icon: <Folder />, bg: "linear-gradient(#5ab0ff,#1d6fe0)", on: true },
    { label: "Claude", icon: <span className={s.claudeGlyph}>C</span>, bg: "#d97757", on: true },
    { label: "Mail", icon: <Mail />, bg: "linear-gradient(#6cc4ff,#1e88f0)" },
    {
      label: "Browser",
      icon: <Compass />,
      bg: "linear-gradient(#fff,#e6e6e6)",
      dark: true,
      on: browserOpen,
    },
    { label: "Calendar", icon: <Calendar />, bg: "#fff", dark: true },
    { label: "Keynote", icon: <Presentation />, bg: "linear-gradient(#ffb057,#e9731c)", on: previewOpen },
  ];
  return (
    <div className={s.dock}>
      {items.map((it) => (
        <div key={it.label} className={`${s.dockItem} ${it.on ? s.dockOn : ""}`}>
          <div
            className={s.dockIcon}
            style={{ background: it.bg, color: it.dark ? "#555" : "#fff" }}
          >
            {it.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

export function FileIcon({ kind, size = 16 }: { kind: FileKind; size?: number }) {
  if (kind === "folder") return <Folder size={size} fill="#7cb8f5" color="#4a90d9" />;
  if (kind === "xlsx") return <FileSpreadsheet size={size} color="#1e8a4c" />;
  if (kind === "pptx") return <Presentation size={size} color="#d0612b" />;
  return <FileText size={size} color={kind === "pdf" ? "#d93a2b" : "#2b6fd6"} />;
}

// While the engine waits on an "expect" step, folders can be dragged (or clicked).
function pickable(name: string, onPick?: (name: string) => void) {
  if (!onPick) return {};
  return {
    draggable: true,
    onDragStart: (e: DragEvent) => e.dataTransfer.setData("text/plain", name),
    onClick: () => onPick(name),
    "data-pick": "",
  };
}

export function Finder({
  state,
  folder,
  onPick,
}: {
  state: State;
  folder: string;
  onPick?: (name: string) => void;
}) {
  return (
    <Window
      id="finder"
      box={LAYOUT.finder}
      title={
        <span className={s.finderTitle} data-wt="finder.title" {...pickable(folder, onPick)}>
          <Folder size={14} fill="#7cb8f5" color="#4a90d9" /> {folder}
        </span>
      }
    >
      <div className={s.finderSidebar}>
        <div className={s.sidebarLabel}>Favorites</div>
        <div>
          <Clock size={13} /> Recents
        </div>
        <div className={s.sidebarActive} {...pickable("Documents", onPick)}>
          <Folder size={13} /> Documents
        </div>
        <div>
          <Folder size={13} /> Desktop
        </div>
        <div>
          <Folder size={13} /> Downloads
        </div>
      </div>
      <div className={s.finderMain}>
        <div className={s.finderToolbar}>
          <ChevronLeft size={16} /> <ChevronRight size={16} color="#bbb" />
        </div>
        <div className={`${s.finderRow} ${s.finderHead}`}>
          <span>Name</span>
          <span>Date Modified</span>
          <span>Size</span>
        </div>
        {state.files.map((f) => (
          <div
            key={f.name}
            data-wt={`finder.file:${f.name}`}
            className={`${s.finderRow} ${f.name === state.newFile ? s.finderNew : ""}`}
            {...(f.kind === "folder" ? pickable(f.name, onPick) : {})}
          >
            <span className={s.finderName}>
              <FileIcon kind={f.kind} /> {f.name}
            </span>
            <span>{f.modified}</span>
            <span>{f.size}</span>
          </div>
        ))}
      </div>
    </Window>
  );
}

// Consecutive tool calls render as one activity card.
function group(messages: Message[]) {
  const blocks: (Message | { kind: "tools"; labels: string[] })[] = [];
  for (const m of messages) {
    const last = blocks[blocks.length - 1];
    if (m.kind === "tool" && last?.kind === "tools") last.labels.push(m.label);
    else if (m.kind === "tool") blocks.push({ kind: "tools", labels: [m.label] });
    else blocks.push(m);
  }
  return blocks;
}

const CONNECTOR_ICONS: Record<ConnectorIcon, ReactNode> = {
  mail: <Mail size={16} />,
  calendar: <Calendar size={16} />,
  drive: <HardDrive size={16} />,
  chat: <MessageSquare size={16} />,
};

export function Claude({
  state,
  connectors,
  box,
  showFolder,
  onPick,
}: {
  state: State;
  connectors: Connector[];
  box: Box;
  showFolder: boolean;
  onPick?: (name: string) => void;
}) {
  const blocks = group(state.messages);
  const lastReply = blocks.filter((b) => b.kind === "reply").length - 1;
  let replyIndex = -1;
  const action = state.waiting?.action;
  const onDrop = action === "drop" ? onPick : undefined;
  const connected = connectors.filter((c) => state.connectors[c.name]?.connected);
  const on = connectors.filter((c) => state.connectors[c.name]?.on);

  return (
    <Window id="claude" box={box} title="Claude">
      <div
        className={s.claude}
        onDragOver={onDrop && ((e) => e.preventDefault())}
        onDrop={
          onDrop &&
          ((e) => {
            e.preventDefault();
            onDrop(e.dataTransfer.getData("text/plain"));
          })
        }
      >
        <div
          className={`${s.conversation} ${state.menu ? s.conversationRaised : ""}`}
          data-wt="claude.conversation"
        >
          {blocks.length === 0 && (
            <div className={s.claudeEmpty}>What should we work on?</div>
          )}
          {blocks.map((b, i) => {
            if (b.kind === "user")
              return (
                <div key={i} className={s.userBubble}>
                  {b.text}
                </div>
              );
            if (b.kind === "plan")
              return (
                <div key={i} className={s.plan} data-wt="claude.plan">
                  <div className={s.cardLabel}>Plan</div>
                  {b.items.map((item, j) => (
                    <div key={j} className={s.planItem}>
                      <span className={`${s.box} ${state.done.includes(j) ? s.boxDone : ""}`}>
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              );
            if (b.kind === "tools")
              return (
                <div key={i} className={s.activity}>
                  {b.labels.map((label) => (
                    <div key={label} className={s.tool}>
                      <span className={s.toolIcon}>
                        <LoaderCircle size={13} className={s.spin} />
                        <Check size={13} className={s.toolCheck} />
                      </span>
                      {label}
                    </div>
                  ))}
                </div>
              );
            if (b.kind === "drafts")
              return (
                <div key={i} className={s.plan} data-wt="claude.drafts">
                  <div className={s.cardLabel}>
                    {b.items.length} drafts · saved in {b.connector} · not sent
                  </div>
                  {b.items.map((d, j) => (
                    <div
                      key={d.to}
                      className={s.draft}
                      style={{ animationDelay: `${j * 0.35}s` }}
                    >
                      <div className={s.draftHead}>
                        <b>{d.to}</b>
                        <span>{d.subject}</span>
                        {d.flag && (
                          <span className={s.draftFlag}>
                            <Flag size={10} /> {d.flag}
                          </span>
                        )}
                      </div>
                      <div className={s.draftPreview}>{d.preview}</div>
                    </div>
                  ))}
                </div>
              );
            replyIndex++;
            return (
              <div
                key={i}
                className={s.reply}
                data-wt={replyIndex === lastReply ? "claude.reply" : undefined}
              >
                <Typed text={b.kind === "reply" ? b.text : ""} cps={REPLY_CPS} />
              </div>
            );
          })}
        </div>

        <div
          className={`${s.composer} ${onDrop ? s.dropTarget : ""}`}
          data-wt="claude.composer"
        >
          <div className={s.composerText}>
            {state.composer ? (
              <Typed text={state.composer} cps={TYPE_CPS} caret />
            ) : (
              <span className={s.placeholder}>Describe the outcome you want…</span>
            )}
          </div>
          <div className={s.composerBar}>
            <div className={s.composerPills}>
              <span className={s.plusButton} data-wt="claude.plus">
                <Plus size={15} />
              </span>
              {state.attached ? (
                <span className={`${s.folderPill} ${s.folderAttached}`}>
                  <Folder size={13} fill="#7cb8f5" color="#4a90d9" /> {state.attached}
                </span>
              ) : (
                showFolder && (
                  <span className={s.folderPill}>
                    <Folder size={13} /> {onDrop ? "Drop a folder here" : "Work in a folder"}
                  </span>
                )
              )}
              {on.map((c) => (
                <span key={c.name} className={`${s.folderPill} ${s.folderAttached}`}>
                  {CONNECTOR_ICONS[c.icon]} {c.name}
                </span>
              ))}
            </div>
            <span className={s.send} data-wt="claude.send">
              <ArrowUp size={16} />
            </span>
          </div>

          {state.menu && (
            <div className={s.menu} data-wt="claude.menu">
              <div className={s.menuItem}>
                <Paperclip size={15} /> Add files or photos
              </div>
              <div className={s.menuItem}>
                <Folder size={15} /> Add folder
              </div>
              <div
                className={`${s.menuItem} ${state.menu === "connectors" ? s.menuItemOn : ""}`}
                data-wt="claude.menu.connectors"
              >
                <Blocks size={15} /> Connectors <ChevronRight size={14} className={s.menuChevron} />
              </div>

              {state.menu === "connectors" && (
                <div className={s.submenu} data-wt="claude.connectors">
                  <div className={s.menuItem} data-wt="claude.menu.browse">
                    <LibraryBig size={15} /> Browse connectors
                  </div>
                  <div className={s.menuItem}>
                    <Briefcase size={15} /> Manage connectors
                  </div>
                  {connected.length > 0 && <div className={s.menuDivider} />}
                  {connected.map((c) => (
                    <div
                      key={c.name}
                      className={s.menuItem}
                      data-wt={`connector:${c.name}`}
                      {...(action === "pick" && onPick
                        ? { onClick: () => onPick(c.name), "data-pick": "" }
                        : {})}
                    >
                      {CONNECTOR_ICONS[c.icon]} {c.name}
                      <span
                        className={`${s.switch} ${state.connectors[c.name]?.on ? s.switchOn : ""}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {state.directory && (
          <div className={s.directory} data-wt="directory">
            <div className={s.directoryHead}>
              <span className={s.directoryTitle}>Connectors</span>
              <span className={s.directorySearch}>
                <Search size={13} /> Search connectors
              </span>
              <span className={s.directoryClose} data-wt="directory.close">
                <X size={16} />
              </span>
            </div>
            <div className={s.directoryGrid}>
              {connectors.map((c) => {
                const done = state.connectors[c.name]?.connected;
                return (
                  <div key={c.name} className={s.connectorCard} data-wt={`directory.card:${c.name}`}>
                    <span className={s.connectorIcon}>{CONNECTOR_ICONS[c.icon]}</span>
                    <div className={s.connectorText}>
                      <b>{c.name}</b>
                      <span>{c.description}</span>
                      <small>by {c.by}</small>
                    </div>
                    <span
                      className={`${s.connectorAdd} ${done ? s.connectorDone : ""}`}
                      data-wt={`directory.add:${c.name}`}
                    >
                      {done ? <Check size={15} /> : <Plus size={15} />}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Window>
  );
}

// The provider's sign-in page, kept generic: an account to continue as, then the
// permissions Claude is asking for. No password field and no provider branding.
export function Browser({
  connector,
  screen,
}: {
  connector: Connector;
  screen: "account" | "consent";
}) {
  const auth = connector.auth!;
  return (
    <Window id="browser" box={LAYOUT.browser} title={`Sign in · ${auth.provider}`}>
      <div className={s.browser}>
        <div className={s.addressBar}>
          <Lock size={11} /> {auth.url}
        </div>
        <div className={s.authCard}>
          <div className={s.authProvider}>{auth.provider}</div>
          {screen === "account" ? (
            <>
              <div className={s.authTitle}>Choose an account</div>
              <div className={s.authSub}>to continue to Claude</div>
              <div className={s.authAccount} data-wt="browser.account">
                <span className={s.avatar}>{auth.account[0]}</span>
                <div>
                  <b>{auth.account}</b>
                  <span>{auth.email}</span>
                </div>
              </div>
              <div className={s.authAccount}>
                <span className={s.avatarGhost}>
                  <UserRound size={14} />
                </span>
                <div>
                  <span>Use another account</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={s.authTitle}>Claude wants access to your {auth.provider} account</div>
              <div className={s.authSub}>{auth.email}</div>
              <div className={s.scopes} data-wt="browser.scopes">
                <div className={s.scopesLabel}>This will allow Claude to:</div>
                {auth.scopes.map((sc) => (
                  <div key={sc} className={s.scope}>
                    {CONNECTOR_ICONS[connector.icon]} {sc}
                  </div>
                ))}
              </div>
              <div className={s.authActions}>
                <span className={s.authCancel}>Cancel</span>
                <span className={s.authAllow} data-wt="browser.allow">
                  Allow
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </Window>
  );
}

export function Preview({ file, deck }: { file: string; deck: Deck }) {
  const { slide } = deck;
  const { values, flag, unit, note } = slide.chart;
  const max = Math.max(...values.map(Math.abs));
  const top = Math.max(0, ...values); // headroom above the zero line
  const span = top + max;

  return (
    <Window id="preview" box={LAYOUT.preview} title={file}>
      <div className={s.filmstrip}>
        {Array.from({ length: deck.slideCount }, (_, i) => (
          <div key={i} className={`${s.thumb} ${i + 1 === slide.number ? s.thumbOn : ""}`}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className={s.slideArea}>
        <div className={s.slide}>
          <div className={s.slideTitle}>{slide.title}</div>
          <div className={s.chart}>
            <div className={s.zero} style={{ top: `${(top / span) * 100}%` }} />
            {values.map((v, i) => (
              <div key={i} className={s.barCol}>
                <div
                  className={`${s.bar} ${i === flag ? s.barFlag : ""}`}
                  style={{
                    top: `${((top - Math.max(v, 0)) / span) * 100}%`,
                    height: `${(Math.abs(v) / span) * 100}%`,
                  }}
                >
                  <span className={s.barValue}>
                    {v > 0 ? "+" : ""}
                    {v}
                    {unit}
                  </span>
                </div>
                {i === flag && (
                  <span className={s.flag}>
                    <Flag size={11} /> {note}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={s.notes}>
          <b>Speaker notes</b> {slide.notes}
        </div>
      </div>
    </Window>
  );
}
