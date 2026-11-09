# Agent studio

Warpblade is built by an agent studio: Claude Code agents that plan, build, test, capture and ship one patch every night.
The owner sets the direction in `charter.md`; the studio does the rest.

## The night

The owner's Mac starts the studio at 00:00 Bangkok time.
A launcher refreshes a dedicated worktree at `origin/main`, so the pipeline always runs the code on `main`, and runs `npm run studio -- run` in it.
A night goes through these steps, each one an agent with its own instructions in `roles/`:

1. Prepare: pick the patch type (big when three or more days have passed since the last big patch or the day work has a headline, otherwise small), the next version, and a `studio/patch-<version>` branch.
   Commits on `main` since the last release are the owner's day work and ship in this patch. Their trailers say what they deliver: `Addresses-feedback: #N` closes that feedback item with this patch, and `Headline: <category>` makes the night a big patch with that work as its headline.
2. Baseline: typecheck, lint, build, the playtest smoke check and bot runs on the base version, including runs that start at wave 20 (the dev server reads `?wave=` and `?level=`).
3. Triage: an agent with no tools reads the open `game-feedback` GitHub issues as data and decides now, later, skip, duplicate or hide for each item, with a reply.
4. Direct: the director reads the charter, the roadmap, the feedback, the baseline and the code, and writes the plan and a decision memo.
5. Build: the developer builds the plan, checks it and commits.
6. QA: a separate agent tests the real game against the plan's acceptance checks and judges whether each change delivers in ordinary play. A failed QA gets up to two rounds of fixes; a third failure ends the night with nothing shipped. A passing QA with minor issues gets one polish round for what players would see, then QA checks again; a blocking issue found in that check gets one more round of fixes, even when the first two are used up.
7. Media: an agent records clips and stills of the change through real play.
8. Write: the writer turns the night into patch notes (`src/content/patches/<version>.json`), a journal entry (`journal/<version>.md`) and a roadmap update.
9. Finalize: the version goes into `package.json`, every check runs again, and the patch is committed.
10. Publish (live runs only): the branch merges into `main` through a pull request, which deploys the site, then a `v<version>` tag, a GitHub release with the patch notes and GIFs, and a studio comment on each feedback issue: closed when addressed, skipped or a duplicate, labelled `planned` when it is for later.

The pipeline checks each step's work in code: owner-only files untouched, each agent only writing the files it owns, and the patch notes valid against `schemas/patch.schema.json` with every media file present.
A dry run does every step except Publish and leaves a `review.md` with every decision of the night.

## Files

| Path | What it is | Who changes it |
| --- | --- | --- |
| `charter.md` | Vision, references, patch types, decision rules, quality bar | Owner |
| `roadmap.md` | The studio's backlog | Studio |
| `journal/` | One decision memo per patch | Studio |
| `roles/` | Instructions for each agent | Owner |
| `schemas/` | The shape of each agent's answer and of a patch file | Owner |
| `src/` | The pipeline | Owner |
| `playtest/` | Headless smoke checks, bots and capture | Owner |

## Run it

The scheduled job runs `system/automation/warpblade_studio.py start --mode live` in the owner's SuperU workspace.
To try a night without shipping anything, from `agent-studio/` in a clean checkout:

```sh
npm ci
npm run studio -- run --workdir .. --runs-dir /tmp/studio-runs --mode dry --feedback <feedback.json>
```

`--kind big` or `--kind small` overrides the patch type, and `--date YYYY-MM-DD` sets the night.
`--feedback github` (the default) reads the open `game-feedback` issues with the `gh` CLI. A JSON file in the same shape as `FeedbackIssue` in `src/types.ts` stands in for them on a dry run.

Environment overrides: `STUDIO_CLAUDE` (the Claude Code command) and `STUDIO_MODEL`.

## Player feedback is untrusted

Feedback issues come from anyone with a GitHub account.
Only the triage agent sees the raw text, and it runs with no tools.
The raw text is kept outside the run folder, later agents are pointed only at triage's own one-sentence summaries, and issue authors' names and comments never reach any agent.
