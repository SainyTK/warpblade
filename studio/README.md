# Warpblade Studio

A local tool for posing every frame of every hero's moves.

The studio draws each hero with the game's own code and art (`drawHero`, the rope physics, the hero's sprite), at the game's detail, so a pose in the studio looks exactly as it will in the game.
Nothing here ships with the game: the Vite build at the repository root does not include `studio/`.

## Run it

```sh
cd studio
npm install
npm run dev
```

Open http://127.0.0.1:5280.
The page talks to a small server on port 5281, which saves the drafts.
The same port serves the game's training ground at http://127.0.0.1:5280/training/, for Play.

Other commands: `npm run typecheck`, `npm run lint`, `npm run format`.

## Use it

- Pick the hero at the top. The same move stays open, so Run on Kael becomes Run on Saya. A yellow dot in the list marks a hero with edits.
- The left column shows every move the hero has, each playing on a loop. Click one to open it. A yellow dot marks a move with edits the game does not have yet.
- The stage and the gallery play every move at the speed the game plays it: run takes one stride (38 px) per loop at full speed, brake, land, dash, wall kick and the slashes last as long as those states do, and the rest play at 30 frames a second. A run clip is one stride, two steps; more frames add detail, not length.
- The stage shows the frame at the playhead, with the frames before (red) and after (blue) as onion skins. The strip under it has every frame of the move; the red tag marks the frame the blow lands.
- Drag the handles on the hero: hip, chest (bends the spine), neck, both hands, both feet, both toes (tilt the foot), both elbows (drag across the arm to flip the bend) and the sword tip. Shift-drag the hip to carry the upper body with it.
- The right column has the same pose as numbers and switches, Snap to this frame (the game jumps to it without blending in), and Copy, Paste and Reset (back to the game's pose for that frame). Revert to the game puts the whole move back.
- Keys: Left and Right step frames, Space plays, Ctrl+Z and Ctrl+Shift+Z undo and redo, Ctrl+C and Ctrl+V copy and paste a pose.

Every edit saves as a draft of that move a moment later.

**Play** opens the picked hero on the game's training ground in a new tab, with every saved draft in place of the game's moves.
The tab follows each save, so a pose edited in the studio shows up in the next swing without a reload.
The training ground has a husk and a wisp that stand again after they fall; a fallen hero starts over at once, and nothing is saved to the game.

## Work on several moves at once

Several people or agents can work on different moves in one checkout, each in their own tab.
Nothing reloads a page when a move changes on disk:

- When a draft changes on disk (an agent writes it, or another tab saves it), every studio tab picks it up. If that move is open, the stage shows the new frames and the header says Reloaded from disk; undo goes back to what you had.
- When a move is applied to the game, the game's dev server swaps that one clip in the running game, and the studio updates its yellow dots. Neither page reloads.
- To play drafts in the game before applying them, use Play, or open the game with `?drafts=` and the moves, such as `http://127.0.0.1:5280/training/?drafts=run,brake` (`?drafts=all` for every draft). That tab plays the drafts of those moves for the hero in play and follows each save, and every other move plays as the game has it.

## Hand the edits to Claude

**Copy for Claude** lists the edited moves, with the open one ticked.
**Copy selected** copies a note for the ticked moves, and **Copy all** for every edited move: where each draft is and the command that applies them.
Paste it into the chat.

Claude, or anyone, applies the drafts to the game from `studio/`:

```sh
npm run apply-motion -- kael/strikes/first saya/run
```

With no move named, it writes every draft that differs from the game.
Each move is named `<hero>/<move>`.
It writes `src/heroes/<hero>/motion/<move>.json` (the format is in `docs/hero-module.md`, Motion clips), and the running game swaps that clip in without reloading.
Once a move is applied, its yellow dot goes away.

## Where things are kept

Drafts are in `studio/.data/drafts/` (git-ignored), one JSON file per move under a folder per hero, such as `saya/strikes/first.json`.

## Code

```text
shared/      the draft type, used by the page and the server
server/      the loopback API that saves drafts, apply-motion, and the Vite plugins (vite/): the game's dev server under /training/, and the one the studio and the game
             use to send changed clips and drafts to open pages
src/
  constants/ stage size, joints, every hero's moves and their groups
  utils/     pure helpers: rig geometry, ropes, the stage picture, thumbnails, clip edits
  services/  calls to the server, the clipboard, loading the hero art
  store/     the open move with undo and every draft, and the editor state
  hooks/ components/ pages/
```
