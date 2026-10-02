# Learn Claude prototype

Route: `/learn-claude`. The only file outside this directory is the Pages Router entry at `src/pages/learn-claude.tsx`. No homepage/navigation link is added; the route has `noindex, nofollow` metadata. It is unlisted, not access controlled.

## First slice

A 72-second, local, deterministic walkthrough: project files → presentation → source verification → revision. Play/pause, replay, seeking, chapter selection, playback speed, sample-file previews, and slide navigation are available. File previews and slide navigation pause playback. No API key, network generation, upload, connector, or actual document export is involved.

- `scenario.ts`: learner context, objective, sample file content, prompts, chapters, and cursor coordinates.
- `usePlayback.ts`: animation clock, playback speed, seeking, and end behavior.
- `Desktop.tsx`: simulated Finder, Claude conversation, presentation, and sample-file previews.
- `LearnClaude.tsx`: page, player controls, captions, and scenario inspection.
- `learn-claude.module.css`: isolated page and desktop styles. Desktop uses a 1200 × 660 coordinate space, scaled to the player; narrow screens can scroll the stage horizontally.

The desktop visual language draws on Miguel’s existing learncode simulator. It does not import its game state, services, or dependencies. Browser chrome is illustrative, not an exact product replica.

## Scope and next step

The first scenario is authored. The inspector explicitly says so. This is not yet a general validated model-to-scenario pipeline: the presentation and several visual milestones are specific to this first example. A second scenario should drive extraction of the remaining timeline milestones and output content into a constrained action schema before claiming arbitrary composition. Then add model generation with validation and educator review. An interactive exercise can reuse the same file and window primitives.

Official workflow references checked during implementation:

- https://support.claude.com/en/articles/8241126-upload-files-to-claude
- https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude

## Checks

From the repository root: `npx tsc --noEmit --incremental false` and `npx eslint src/prototypes/learn-claude src/pages/learn-claude.tsx`. Run the existing dev script, then open `/learn-claude` to verify playback and layouts. No extra dependencies are required by the prototype.

Verification completed: source TypeScript check and scoped ESLint passed; browser checks covered playback/pause, scrubbing, chapter jumps, completion/replay, slide selection reset, modal focus and dismissal, scenario inspection, desktop rendering, and mobile overflow/automatic panning. No browser runtime errors were reported. The repository-wide TypeScript command encounters duplicate `PagesPageConfig` declarations from the existing `.next/types` and `.next/dev/types`; a temporary source-only config was used to check source without modifying those generated directories. A production build was not run against the shared active dev checkout.
