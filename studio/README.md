# Warpblade Studio

A local tool for sketching Kael's moves and effects, then handing the sketch to a Claude Code agent that builds it into the game.

The studio draws Kael with the game's own code (`drawHero`, the rope physics, `sampleKeys`), so a pose in the studio looks and moves exactly as it will in the game.
Nothing here ships with the game: the Vite build at the repository root does not include `studio/`.

## Run it

```sh
cd studio
npm install
npm run dev
```

Open http://127.0.0.1:5280.
The page talks to a small server on port 5281, which saves sketches and runs the agents.

Other commands: `npm run typecheck`, `npm run lint`, `npm run format`.

Agents run through the local CLIProxyAPI proxy (`http://127.0.0.1:8317`, key in `~/.config/cliproxyapi/client-key`) with the Claude Code executable at `~/.local/bin/claude`, the same setup as the SuperU PWA Chat page.
The model list comes from the proxy.
When the proxy is down, the build dialog says so and no agent starts.

## Motion

- Drag the handles on Kael: hip, neck, both hands, both feet, the sword tip, and the yellow diamond at his feet, which moves him through the air or along the ground.
  Shift-drag the hip to carry the whole upper body with it.
- The small handles bend the body: the chest handle arches or hunches the spine, a toe handle tilts that foot, and dragging an elbow across its arm flips which way it bends.
  The Pose panel has the same values as numbers and switches.
- **Snapshot** (or `S`) keeps the pose at the playhead and moves on by the gap (3 frames by default) with a copy to pose next.
  On a snapshot, edits change it in place. Between snapshots, the first edit starts a draft that the next Snapshot keeps.
- **Snap to this pose** holds the previous pose and jumps to this one, as the game's `"snap"` keyframes do. **Hit frame** marks when the blow lands.
- **Start from** loads any of the game's clips as snapshots (every move and action, and the states such as idle, walk, run, jump and hurt), or applies one of its named poses. Undo brings back what was there.
- Play loops the motion at the game's 30 frames a second. Onion skin shows the snapshots before (red) and after (blue).

## Effect

- Draw at the game's pixel scale with the pencil (`B`), eraser (`E`), line (`L`), fill (`G`) and color picker (`I`, or Alt-click).
- The colors are the game's own ramps, named as the code names them (`PAL.crystal`, `FIRE_RAMP` and so on).
- Each drawn frame starts at a frame of the timeline and holds for a number of frames. Painting where there is none makes one.
  **Copy last** starts from the previous drawing. Kael shows faintly behind, in his pose at that frame.

## Agents

**Build with an agent** sends the open sketch with your instruction.
Pick the model, the permission mode (Auto by default, as in PWA Chat) and where the agent works:

- **New worktree**: a fresh git worktree from `main` at `~/orca/workspaces/warpblade/studio-<name>` on branch `<git user>/studio-<name>`, with packages installed and SuperU activated. The agent commits there and does not merge or push.
- **This checkout**: the repository the studio runs from. The agent does not commit.

The agent gets a brief (`brief.md`) and the sketch's files: contact sheets of the snapshots, every frame and the drawn frames, the motion as a ready-to-paste clip in the game's format, the drawn frames as pixel rows, and the sketch itself.
The job panel streams the agent's work, asks you for approvals it needs, and takes follow-up messages.
**Play this build** starts the game from the job's folder on a free port.

Agents keep running while the page is closed. Restarting the studio server ends them; a follow-up message resumes the same Claude Code session.

## Where things are kept

Sketches and jobs are in `studio/.data/` (git-ignored): `sketches/<id>.json`, and per job `job.json`, `timeline.json`, `exports/` and `media/`.

## Code

The agent server is ported from the SuperU PWA Chat service (the Agent SDK run, the live timeline, approvals and the event stream), and the job timeline UI from its Chat page components.

```text
shared/      types and pure helpers used by the page and the server (the sketch, the API, the clip source)
server/      the loopback API: sketches, jobs, worktrees, game previews and the Claude Code runs
src/
  constants/ stage size, joints, swatches from the game palette, tools
  utils/     pure helpers: sampling, rig geometry, painting, the stage picture, thumbnails
  services/  calls to the server, the exported contact sheets
  store/     the open sketch with undo, and the editor state
  hooks/ providers/ components/ pages/
```
