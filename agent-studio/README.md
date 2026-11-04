# Agent studio

Warpblade is built by an agent studio: Claude Code agents that plan, build, test, capture and ship one patch every night.
The owner sets the direction in `charter.md`; the studio does the rest.

## The night

The owner's Mac starts the studio at 00:00 Bangkok time.
A launcher refreshes a dedicated worktree at `origin/main`, so the pipeline always runs the code on `main`, and runs `npm run studio -- run` in it.
A night goes through these steps, each one an agent with its own instructions in `roles/`:

1. Prepare: pick the patch type (big when three or more days have passed since the last big patch, otherwise small), the next version, and a `studio/patch-<version>` branch.
2. Baseline: typecheck, lint, build, the playtest smoke check and bot runs on the base version.
3. Triage: an agent with no tools reads the open player feedback as data and decides now, later, skip, duplicate or hide for each item, with a reply.
4. Direct: the director reads the charter, the roadmap, the feedback, the baseline and the code, and writes the plan and a decision memo.
5. Build: the developer builds the plan, checks it and commits.
6. QA: a separate agent tests the real game against the plan's acceptance checks. A failed QA gets up to two rounds of fixes; a third failure ends the night with nothing shipped.
7. Media: an agent records clips and stills of the change through real play.
8. Write: the writer turns the night into patch notes (`src/content/patches/<version>.json`), a journal entry (`journal/<version>.md`) and a roadmap update.
9. Finalize: the version goes into `package.json`, every check runs again, and the patch is committed.
10. Publish (live runs only): the branch merges into `main` through a pull request, which deploys the site, then a `v<version>` tag, a GitHub release with the patch notes and GIFs, and each feedback item's new status and studio reply.

The pipeline checks each step's work in code: owner-only files untouched, no new runtime dependencies, each agent only writing the files it owns, and the patch notes valid against `schemas/patch.schema.json` with every media file present.
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
`--feedback api` reads the live feedback API with the admin token in `~/.config/warpblade/feedback-admin-token`.

Environment overrides: `STUDIO_CLAUDE` (the Claude Code command), `STUDIO_MODEL`, `STUDIO_FEEDBACK_API` and `STUDIO_FEEDBACK_TOKEN_FILE`.

## Player feedback is untrusted

Feedback comes from anyone on the internet.
Only the triage agent sees the raw text, and it runs with no tools.
The raw text is kept outside the run folder, later agents are pointed only at triage's own one-sentence summaries, and player names never reach any agent.
