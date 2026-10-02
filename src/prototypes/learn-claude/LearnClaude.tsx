import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Copy,
  FileText,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import Desktop from "./Desktop";
import { formatTime, scenario, sceneAt } from "./scenario";
import { usePlayback } from "./usePlayback";
import s from "./learn-claude.module.css";

export default function LearnClaude() {
  const playback = usePlayback(scenario.duration);
  const scene = sceneAt(playback.time);
  const sceneIndex = scenario.scenes.indexOf(scene);
  const completed = playback.time >= scenario.duration;
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [showSpec, setShowSpec] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(scenario.prompt);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <>
      <Head>
        <title>Learning, in context — Miguel Acevedo</title>
        <meta
          name="description"
          content="An independent prototype exploring Claude walkthroughs composed from a simulated desktop and reusable interface primitives."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className={s.page}>
        <nav className={s.topbar}>
          <Link href="/" className={s.homeLink}>
            <ArrowLeft size={14} /> Miguel Acevedo
          </Link>
          <span className={s.experimentLabel}>
            <span /> AN INTERACTIVE EXPERIMENT
          </span>
          <a href="#how-it-works" className={s.howLink}>
            Behind the scenes <ArrowDown size={13} />
          </a>
        </nav>
        <header className={s.intro}>
          <div>
            <p className={s.eyebrow}>LEARN CLAUDE / THROUGH YOUR WORK</p>
            <h1>Learning, in context.</h1>
            <p className={s.subtitle}>
              See what’s possible. Understand the choices. Make it your own.
            </p>
          </div>
          <div className={s.prototypeNote}>
            <span>01 / THE WALKTHROUGH</span>
            <p>
              A small exploration of how AI could
              <br />
              compose learning around your work.
            </p>
          </div>
        </header>

        <section
          className={s.experience}
          aria-label="Client presentation walkthrough"
        >
          <div className={s.scenarioHeader}>
            <div className={s.scenarioIcon}>
              <FileText size={19} strokeWidth={1.5} />
            </div>
            <div>
              <span className={s.miniLabel}>YOUR SCENARIO</span>
              <h2>{scenario.title}</h2>
            </div>
            <span className={s.durationBadge}>
              6 moments <i /> 1 min 12 sec
            </span>
            <button
              className={s.watchButton}
              onClick={(event) => {
                playback.toggle();
                event.currentTarget
                  .closest("section")
                  ?.scrollIntoView({ block: "start" });
              }}
            >
              {playback.playing ? (
                <Pause size={13} />
              ) : (
                <Play size={13} fill="currentColor" />
              )}
              {playback.playing
                ? "Pause"
                : completed
                  ? "Watch again"
                  : playback.time > 0
                    ? "Continue"
                    : "Watch walkthrough"}
            </button>
          </div>
          <Desktop
            navigationVersion={playback.navigationVersion}
            scene={scene}
            time={playback.time}
            playing={playback.playing}
            pause={playback.pause}
          />
          <div className={s.mobileHint}>
            Swipe across the desktop to explore the workspace.
          </div>
          <div className={s.transport}>
            <button
              className={s.playButton}
              onClick={playback.toggle}
              aria-label={
                playback.playing
                  ? "Pause walkthrough"
                  : completed
                    ? "Replay walkthrough"
                    : "Play walkthrough"
              }
            >
              {playback.playing ? (
                <Pause size={17} fill="currentColor" />
              ) : (
                <Play size={17} fill="currentColor" />
              )}
            </button>
            <button
              className={s.iconButton}
              onClick={playback.replay}
              aria-label="Restart walkthrough"
            >
              <RotateCcw size={16} />
            </button>
            <span className={s.time}>
              {formatTime(playback.time)}{" "}
              <span>/ {formatTime(scenario.duration)}</span>
            </span>
            <input
              className={s.timeline}
              aria-label="Walkthrough progress"
              type="range"
              min={0}
              max={scenario.duration}
              step={0.1}
              value={playback.time}
              onChange={(event) => playback.seek(Number(event.target.value))}
              style={{
                background: `linear-gradient(to right, #354d43 ${(playback.time / scenario.duration) * 100}%, #e6e5dd ${(playback.time / scenario.duration) * 100}%)`,
              }}
            />
            <label className={s.speedLabel}>
              <span className={s.srOnly}>Playback speed</span>
              <select
                value={playback.speed}
                onChange={(event) =>
                  playback.setSpeed(Number(event.target.value))
                }
              >
                <option value={0.75}>0.75×</option>
                <option value={1}>1×</option>
                <option value={1.5}>1.5×</option>
                <option value={2}>2×</option>
              </select>
            </label>
            <span className={s.soundNote}>No audio needed</span>
          </div>
          <div
            className={s.lessonCaption}
            aria-live="polite"
            aria-atomic="true"
          >
            <div className={s.captionNumber}>
              {String(sceneIndex + 1).padStart(2, "0")}
              <span>/ 06</span>
            </div>
            <div>
              <h3>
                {completed ? "Now bring your own judgment." : scene.title}
              </h3>
              <p>
                {completed
                  ? "Try the same workflow with your own materials. Before sharing the result, trace one important claim back to a source."
                  : scene.caption}
              </p>
            </div>
            <span className={s.principle}>
              {completed ? "Your turn" : scene.principle}
            </span>
          </div>
          <div className={s.chapters} aria-label="Walkthrough chapters">
            {scenario.scenes.map((item, index) => (
              <button
                key={item.id}
                onClick={() => playback.seek(item.start)}
                aria-current={item.id === scene.id ? "step" : undefined}
                className={item.id === scene.id ? s.activeChapter : ""}
              >
                <span>
                  {index < sceneIndex ? (
                    <Check size={12} />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className={s.below}>
          <div className={s.learningNote}>
            <p className={s.eyebrow}>THE IDEA</p>
            <h2>
              A familiar workspace.
              <br />A different way to learn.
            </h2>
            <p>
              This walkthrough starts with a task someone already has a reason
              to do. The interface makes the process visible; the explanation
              draws attention to the decisions that matter.
            </p>
            <p>
              Watching is a starting point. The next step is trying it on your
              own work.
            </p>
          </div>
          <div className={s.tryCard}>
            <span className={s.miniLabel}>TAKE IT INTO YOUR WORK</span>
            <h3>Your files. Your next presentation.</h3>
            <p>
              Pick a brief, some notes, and a source of evidence. Tell Claude
              who the presentation is for and what it needs to accomplish. Then
              check one claim before you share it.
            </p>
            <button onClick={copyPrompt}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Prompt copied" : "Copy the example prompt"}
              <ArrowRight size={15} />
            </button>
            {copyError && (
              <p role="status">
                Clipboard unavailable. You can select the prompt in “Behind the
                scenes” below.
              </p>
            )}
            <span className={s.tryFootnote}>
              Use your own files in Claude. This demo uses sample data.
            </span>
          </div>
        </section>

        <section className={s.behind} id="how-it-works">
          <details>
            <summary>
              <span>
                <Code2 size={18} />
                <b>Behind the scenes</b>
                <span>A scenario, reusable components, and a timeline.</span>
              </span>
              <ChevronDown size={17} />
            </summary>
            <div className={s.behindBody}>
              <div className={s.pipeline}>
                <span>Learning objective</span>
                <ArrowRight size={16} />
                <span>Scenario & actions</span>
                <ArrowRight size={16} />
                <span>Simulated workspace</span>
              </div>
              <div className={s.behindColumns}>
                <div>
                  <h3>The learner’s context</h3>
                  <p>{scenario.context}</p>
                  <h3>The objective</h3>
                  <p>{scenario.objective}</p>
                </div>
                <div>
                  <h3>What this prototype demonstrates</h3>
                  <p>
                    One authored scenario rendered with reusable file,
                    conversation, presentation, and annotation components.
                    Playback is local and deterministic. There is no live model,
                    file upload, or connection to your computer.
                  </p>
                  <p>
                    The next experiment: have a model compose scenarios using
                    these primitives, then let a learner take over the same
                    workspace.
                  </p>
                </div>
              </div>
              <h3>The example prompt</h3>
              <blockquote>{scenario.prompt}</blockquote>
              <button
                className={s.specToggle}
                aria-expanded={showSpec}
                onClick={() => setShowSpec(!showSpec)}
              >
                <Code2 size={15} />
                {showSpec ? "Hide scenario spec" : "Inspect scenario spec"}
                <ChevronDown size={14} />
              </button>
              {showSpec && (
                <pre className={s.spec}>
                  {JSON.stringify(scenario, null, 2)}
                </pre>
              )}
              <p className={s.sourceNote}>
                Workflow references:{" "}
                <a
                  href="https://support.claude.com/en/articles/8241126-upload-files-to-claude"
                  target="_blank"
                  rel="noreferrer"
                >
                  uploading files
                </a>{" "}
                and{" "}
                <a
                  href="https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude"
                  target="_blank"
                  rel="noreferrer"
                >
                  creating presentations in Claude
                </a>
                . The interface and outputs here are illustrative.
              </p>
            </div>
          </details>
        </section>
        <footer className={s.footer}>
          <span>A prototype by Miguel Acevedo</span>
          <span>Independent exploration · Not affiliated with Anthropic</span>
        </footer>
      </main>
    </>
  );
}
