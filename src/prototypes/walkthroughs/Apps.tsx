import type { ReactNode } from "react";
import {
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  FileSpreadsheet,
  FileText,
  Flag,
  Folder,
  LoaderCircle,
  Mail,
  Presentation,
  Calendar,
} from "lucide-react";
import { REPLY_CPS, TYPE_CPS, type Message, type State } from "./engine";
import type { Deck, FileKind } from "./types";
import Typed from "./Typed";
import s from "./walkthroughs.module.css";

type Box = { x: number; y: number; w: number; h: number };

export const LAYOUT = {
  finder: { x: 36, y: 60, w: 560, h: 330 },
  claude: { x: 628, y: 44, w: 616, h: 600 },
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

export function Dock({ previewOpen }: { previewOpen: boolean }) {
  const items = [
    { label: "Finder", icon: <Folder />, bg: "linear-gradient(#5ab0ff,#1d6fe0)", on: true },
    { label: "Claude", icon: <span className={s.claudeGlyph}>C</span>, bg: "#d97757", on: true },
    { label: "Mail", icon: <Mail />, bg: "linear-gradient(#6cc4ff,#1e88f0)" },
    { label: "Browser", icon: <Compass />, bg: "linear-gradient(#fff,#e6e6e6)", dark: true },
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
  if (kind === "xlsx") return <FileSpreadsheet size={size} color="#1e8a4c" />;
  if (kind === "pptx") return <Presentation size={size} color="#d0612b" />;
  return <FileText size={size} color={kind === "pdf" ? "#d93a2b" : "#2b6fd6"} />;
}

export function Finder({ state, folder }: { state: State; folder: string }) {
  return (
    <Window
      id="finder"
      box={LAYOUT.finder}
      title={
        <span className={s.finderTitle} data-wt="finder.title">
          <Folder size={14} fill="#7cb8f5" color="#4a90d9" /> {folder}
        </span>
      }
    >
      <div className={s.finderSidebar}>
        <div className={s.sidebarLabel}>Favorites</div>
        <div>
          <Clock size={13} /> Recents
        </div>
        <div className={s.sidebarActive}>
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

export function Claude({ state }: { state: State }) {
  const blocks = group(state.messages);
  const lastReply = blocks.filter((b) => b.kind === "reply").length - 1;
  let replyIndex = -1;

  return (
    <Window id="claude" box={LAYOUT.claude} title="Claude">
      <div className={s.claude}>
        <div className={s.conversation} data-wt="claude.conversation">
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

        <div className={s.composer} data-wt="claude.composer">
          <div className={s.composerText}>
            {state.composer ? (
              <Typed text={state.composer} cps={TYPE_CPS} caret />
            ) : (
              <span className={s.placeholder}>Describe the outcome you want…</span>
            )}
          </div>
          <div className={s.composerBar}>
            {state.attached ? (
              <span className={`${s.folderPill} ${s.folderAttached}`}>
                <Folder size={13} fill="#7cb8f5" color="#4a90d9" /> {state.attached}
              </span>
            ) : (
              <span className={s.folderPill}>
                <Folder size={13} /> Work in a folder
              </span>
            )}
            <span className={s.send} data-wt="claude.send">
              <ArrowUp size={16} />
            </span>
          </div>
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
