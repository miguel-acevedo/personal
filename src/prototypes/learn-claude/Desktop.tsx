import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUp,
  BatteryFull,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  Grid2X2,
  HardDrive,
  List,
  MousePointer2,
  PanelLeft,
  Plus,
  Presentation,
  Search,
  Sheet,
  Wifi,
  X,
} from "lucide-react";
import { scenario, type Scene } from "./scenario";
import s from "./learn-claude.module.css";

function Spark({ small = false }: { small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`${s.spark} ${small ? s.smallSpark : ""}`}
    >
      ✳
    </span>
  );
}

function Window({
  title,
  className,
  children,
  trailing,
}: {
  title: string;
  className?: string;
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <section className={`${s.window} ${className ?? ""}`} aria-label={title}>
      <div className={s.windowBar}>
        <span className={s.trafficLights} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={s.windowTitle}>{title}</span>
        {trailing && <span className={s.windowTrailing}>{trailing}</span>}
      </div>
      {children}
    </section>
  );
}

function FilePreview({
  file,
  onClose,
}: {
  file: (typeof scenario.files)[number];
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    return () => node?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      role="dialog"
      aria-label={`Preview of ${file.name}`}
      className={s.previewBackdrop}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className={s.filePreview}>
        <header>
          <FileText size={17} />
          <b>{file.name}</b>
          <button autoFocus onClick={onClose} aria-label="Close file preview">
            <X size={18} />
          </button>
        </header>
        <pre>{file.text}</pre>
        <footer>Sample file · Included in this walkthrough</footer>
      </section>
    </dialog>
  );
}

function FileIcon({ type }: { type: string }) {
  return (
    <span
      className={`${s.fileIcon} ${type === "CSV" ? s.csvIcon : type === "TXT" ? s.textIcon : ""}`}
    >
      {type === "CSV" ? (
        <Sheet size={26} strokeWidth={1.4} />
      ) : (
        <FileText size={26} strokeWidth={1.4} />
      )}
      <span>{type}</span>
    </span>
  );
}

const slideNames = [
  "Monthly review",
  "What we delivered",
  "Results in context",
  "Next month",
  "The decision",
];

function Deck({ slide, revised }: { slide: number; revised: boolean }) {
  return (
    <div className={`${s.slide} ${slide === 2 ? s.resultsSlide : ""}`}>
      <div className={s.slideEyebrow}>
        <span>NORTHSTAR</span>
        <span>STUDIO / MONTHLY REVIEW</span>
      </div>
      {slide === 0 && (
        <>
          <div className={s.slideOrb} aria-hidden="true" />
          <div className={s.slideHeading}>
            {revised ? (
              <>
                A strong month.
                <br />A decision ahead.
              </>
            ) : (
              <>
                Good progress.
                <br />A clearer next step.
              </>
            )}
          </div>
          <p>
            {revised
              ? "Should we extend the campaign by four weeks?"
              : "September campaign review"}
          </p>
          {revised && (
            <div className={s.slideNote}>
              Visits increased 25% vs. August.
              <br />
              Observed growth; causation not established.
            </div>
          )}
        </>
      )}
      {slide === 1 && (
        <>
          <div className={s.slideHeading}>
            A month of
            <br />
            steady delivery.
          </div>
          <div className={s.slidePoints}>
            <span>
              04 <small>campaign emails delivered</small>
            </span>
            <span>
              01 <small>new collection introduced</small>
            </span>
          </div>
          <p>
            All four emails delivered on schedule.
            <br />
            Source: Review notes.txt
          </p>
        </>
      )}
      {slide === 2 && (
        <>
          <div className={s.resultsHeading}>
            More visits.
            <br />
            Keep the context.
          </div>
          <div className={s.bigMetric}>
            +25<span>%</span>
          </div>
          <p>15,000 visits in September · 12,000 in August</p>
          <div className={s.slideNote}>
            Month-over-month comparison. Not a causal estimate.
            <br />
            Source: Campaign results.csv
          </div>
        </>
      )}
      {slide === 3 && (
        <>
          <div className={s.slideHeading}>
            Build on what
            <br />
            we learned.
          </div>
          <p>
            Scope another four weeks of creative.
            <br />
            Continue monitoring visits and orders.
            <br />
            Agree on a plan to measure campaign impact.
          </p>
          <div className={s.slideNote}>
            Proposed next steps, subject to client approval.
          </div>
        </>
      )}
      {slide === 4 && (
        <>
          <div className={s.slideHeading}>
            The next move
            <br />
            is yours.
          </div>
          <p>Approve scoping a four-week extension.</p>
          <div className={s.slideNote}>
            Budget and final scope remain to be agreed.
            <br />
            Source: Project brief.pdf · Review notes.txt
          </div>
        </>
      )}
      <div className={s.slideFooter}>
        <span>SEPTEMBER 2026</span>
        <span>{String(slide + 1).padStart(2, "0")} / 05</span>
      </div>
    </div>
  );
}

export default function Desktop({
  scene,
  time,
  playing,
  pause,
  navigationVersion,
}: {
  scene: Scene;
  time: number;
  playing: boolean;
  pause: () => void;
  navigationVersion: number;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const previewTrigger = useRef<HTMLButtonElement | null>(null);
  const [scale, setScale] = useState(1);
  const [preview, setPreview] = useState<
    (typeof scenario.files)[number] | null
  >(null);
  const [selectedSlide, setSelectedSlide] = useState<{
    scene: string;
    index: number;
    navigationVersion: number;
  } | null>(null);
  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / 1200),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const local = time - scene.start;
  const attached = time >= 14;
  useEffect(() => {
    const container = scrollContainer.current;
    if (!container || container.scrollWidth <= container.clientWidth) return;
    const target =
      scene.state === "context" ||
      (scene.state === "attach" && !attached) ||
      scene.state === "verify"
        ? 270
        : 840;
    container.scrollTo({
      left: target * scale - container.clientWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [scene.state, attached, scale]);

  function closePreview() {
    setPreview(null);
    previewTrigger.current?.focus();
  }
  const submitted = time >= 29;
  const hasDeck = time >= 36;
  const checking = scene.state === "verify";
  const revised = time >= 64;
  const typed = scenario.prompt.slice(
    0,
    Math.floor(Math.max(0, time - 19) * 38),
  );
  const slide =
    selectedSlide?.scene === scene.id &&
    selectedSlide.navigationVersion === navigationVersion &&
    !playing
      ? selectedSlide.index
      : checking
        ? 2
        : 0;
  const cursorProgress = Math.min(
    1,
    Math.max(0, local / (scene.state === "attach" ? 5 : 2.5)),
  );
  const eased = cursorProgress * cursorProgress * (3 - 2 * cursorProgress);
  const cursorX =
    scene.cursor.from[0] + (scene.cursor.to[0] - scene.cursor.from[0]) * eased;
  const cursorY =
    scene.cursor.from[1] + (scene.cursor.to[1] - scene.cursor.from[1]) * eased;

  return (
    <div className={s.desktopScroll} ref={scrollContainer}>
      <div className={s.desktopViewport} ref={viewport}>
        <div
          className={s.desktop}
          style={{ transform: `scale(${scale})` }}
          aria-label="Simulated desktop walkthrough"
        >
          <div className={s.wallpaperShapeOne} />
          <div className={s.wallpaperShapeTwo} />
          <div className={s.menuBar}>
            <div>
              <span className={s.menuMark}>●</span>
              <b>{hasDeck ? "Preview" : "Finder"}</b>
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Go</span>
            </div>
            <div>
              <Wifi size={14} />
              <BatteryFull size={18} />
              <span>Tue 29 Sep</span>
              <b>9:41 AM</b>
            </div>
          </div>
          <div className={s.desktopFolder}>
            <Folder size={46} fill="#a9cfe2" stroke="#d0e8f1" strokeWidth={1} />
            <span>Northstar</span>
          </div>

          <Window
            title={checking ? "Campaign results.csv" : "Northstar — September"}
            className={`${s.finder} ${checking ? s.finderChecking : ""}`}
            trailing={<Search size={15} />}
          >
            <div className={s.finderBody}>
              <aside className={s.finderSidebar}>
                <span>Favorites</span>
                <div>
                  <HardDrive size={15} /> Desktop
                </div>
                <div className={s.sidebarSelected}>
                  <FolderOpen size={15} /> Northstar
                </div>
                <div>
                  <Folder size={15} /> Documents
                </div>
                <span className={s.sidebarTagLabel}>Tags</span>
                <div>
                  <i className={s.greenDot} /> Client work
                </div>
              </aside>
              <div className={s.finderContent}>
                <div className={s.finderToolbar}>
                  <ChevronLeft size={16} />
                  <ChevronRight size={16} />
                  <span>{checking ? "Source preview" : "3 items"}</span>
                  <Grid2X2 size={15} />
                  <List size={16} />
                </div>
                {checking ? (
                  <div className={s.sourceTable}>
                    <div className={s.sourceHeading}>
                      <Sheet size={20} />
                      <div>
                        <b>Campaign results</b>
                        <small>Original source · September 2026</small>
                      </div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Visits</th>
                          <th>Orders</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>August</td>
                          <td>12,000</td>
                          <td>360</td>
                        </tr>
                        <tr>
                          <td>September</td>
                          <td className={s.highlightCell}>15,000</td>
                          <td>435</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className={s.calculation}>
                      <Check size={16} />
                      <span>
                        (15,000 − 12,000) ÷ 12,000 <b>= 25%</b>
                      </span>
                    </div>
                    <p>
                      The increase is real. What caused it is a separate
                      question.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className={s.finderColumnHead}>
                      <span>Name</span>
                      <span>Size</span>
                    </div>
                    {scenario.files.map((file) => (
                      <button
                        key={file.id}
                        className={`${s.fileRow} ${scene.state === "attach" ? s.fileSelected : ""}`}
                        onClick={(event) => {
                          previewTrigger.current = event.currentTarget;
                          pause();
                          setPreview(file);
                        }}
                        aria-label={`Preview ${file.name}`}
                      >
                        <FileIcon type={file.type} />
                        <span>
                          <b>{file.name}</b>
                          <small>{file.description}</small>
                        </span>
                        <em>{file.size}</em>
                      </button>
                    ))}
                    <div className={s.folderFootnote}>
                      Everything for the monthly client review.
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={s.finderFooter}>
              <Folder size={12} /> Studio <ChevronRight size={11} /> Clients{" "}
              <ChevronRight size={11} /> Northstar
            </div>
          </Window>

          <Window
            title="Claude"
            className={`${s.claudeWindow} ${hasDeck ? s.claudeBehind : ""}`}
            trailing={<PanelLeft size={15} />}
          >
            <div className={s.claudeContent}>
              {!submitted ? (
                <>
                  <div className={s.greeting}>
                    <Spark />
                    <h2>
                      A little context.
                      <br />A useful starting point.
                    </h2>
                    <p>What are we working on today?</p>
                  </div>
                  <div
                    className={`${s.composer} ${scene.state === "attach" && !attached ? s.dropTarget : ""}`}
                  >
                    {attached && (
                      <div className={s.attachments}>
                        {scenario.files.map((file) => (
                          <span key={file.id}>
                            <FileText size={13} />
                            {file.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className={s.promptText}>
                      {typed || (
                        <span className={s.placeholder}>
                          {attached
                            ? "Describe what you’d like to make…"
                            : "How can I help you today?"}
                        </span>
                      )}
                      {scene.state === "prompt" && (
                        <span className={s.typingCaret} />
                      )}
                    </div>
                    <div className={s.composerBottom}>
                      <Plus size={19} />
                      <span>Extended thinking</span>
                      <span className={s.sendButton}>
                        <ArrowUp size={17} />
                      </span>
                    </div>
                  </div>
                  <p className={s.mockNotice}>
                    Simulated conversation · Sample files
                  </p>
                </>
              ) : (
                <>
                  <div className={s.chatTitle}>
                    <Spark small />
                    <span>Northstar client review</span>
                  </div>
                  <div className={s.userMessage}>
                    <div className={s.messageFiles}>
                      <FileText size={14} /> 3 project files attached
                    </div>
                    {scenario.prompt}
                  </div>
                  <div className={s.assistantMessage}>
                    <Spark small />
                    <div>
                      <p>
                        I’ll build a five-slide review around the client’s
                        decision, using your files for the facts.
                      </p>
                      <div className={s.taskList}>
                        <span>
                          <Check size={13} /> Read the brief and meeting notes
                        </span>
                        <span>
                          <Check size={13} /> Compare the monthly results
                        </span>
                        <span>
                          {hasDeck ? (
                            <Check size={13} />
                          ) : (
                            <i className={s.workingDot} />
                          )}{" "}
                          Create the presentation
                        </span>
                      </div>
                    </div>
                  </div>
                  {hasDeck && (
                    <div className={s.outputFile}>
                      <Presentation size={25} />
                      <span>
                        <b>Northstar — September review</b>
                        <small>PowerPoint · 5 slides · Draft</small>
                      </span>
                      <Check size={16} />
                    </div>
                  )}
                </>
              )}
            </div>
          </Window>

          {hasDeck && (
            <Window
              title="Northstar — September review"
              className={s.presentationWindow}
              trailing={
                <span className={s.draftBadge}>
                  {revised ? "Revised draft" : "Draft"}
                </span>
              }
            >
              <div className={s.deckBody}>
                <div className={s.thumbnails}>
                  {slideNames.map((name, index) => (
                    <button
                      key={name}
                      className={index === slide ? s.thumbnailActive : ""}
                      onClick={() => {
                        pause();
                        setSelectedSlide({
                          scene: scene.id,
                          index,
                          navigationVersion,
                        });
                      }}
                      aria-label={`Show slide ${index + 1}: ${name}`}
                      aria-pressed={index === slide}
                    >
                      <span>{index + 1}</span>
                      <div>
                        <i />
                        <i />
                        <small>{name}</small>
                      </div>
                    </button>
                  ))}
                </div>
                <div className={s.slideContainer}>
                  <Deck slide={slide} revised={revised} />
                  <div className={s.deckControls}>
                    <span>{slideNames[slide]}</span>
                    <span>{slide + 1} of 5</span>
                  </div>
                </div>
              </div>
            </Window>
          )}

          {scene.state === "revise" && (
            <div className={s.revisionBubble}>
              <Spark small />
              <div>
                <b>
                  {revised
                    ? "The deck now leads with the decision."
                    : "A more useful direction"}
                </b>
                <p>
                  {revised
                    ? "The 25% comparison stays, with a clear note that causation hasn’t been established."
                    : scenario.revision}
                </p>
              </div>
              {revised && <Check size={20} />}
            </div>
          )}

          <div className={s.dock} aria-hidden="true">
            <div className={s.finderDock}>
              <span>⌣</span>
            </div>
            <div className={s.claudeDock}>
              <Spark />
            </div>
            <i />
            <div className={s.previewDock}>
              <Presentation size={29} />
            </div>
            <div className={s.folderDock}>
              <Folder size={32} fill="#9dccde" strokeWidth={1} />
            </div>
          </div>
          <span className={s.simulationLabel}>SIMULATED WORKSPACE</span>
          {playing && (
            <div
              className={s.simulatedCursor}
              style={{ left: cursorX, top: cursorY }}
              aria-hidden="true"
            >
              <MousePointer2
                size={25}
                fill="#222923"
                stroke="white"
                strokeWidth={1.6}
              />
              {scene.state === "attach" && local > 1 && local < 5 && (
                <span className={s.dragBundle}>
                  <FileText size={18} />3 files<span>+</span>
                </span>
              )}
            </div>
          )}

          {preview && <FilePreview file={preview} onClose={closePreview} />}
        </div>
      </div>
    </div>
  );
}
