# Co-op rooms

Up to four players fight the same 30-wave run together, each with their own hero.
One player hosts a room from the start menu, and the room runs in that player's browser tab.
The others join with the room's five-letter code or an invite link, pick Kael or Ysra (the same hero more than once is fine) and wait in the lobby until the host starts the run.

## Where it comes from

The owner asked for this in issue #10 and pointed at [chocobo-racing-threejs](https://github.com/SainyTK/chocobo-racing-threejs).
That game's online rooms run in the creator's tab, guests connect to it over WebRTC, and a small signaling server introduces them.
Warpblade does the same, with one change: it uses [PeerJS](https://peerjs.com) and the free public PeerJS broker for the introduction.
That keeps the game a static site on Vercel with no server of ours, at the cost of relying on a third-party broker (see Known limits).
PeerJS is the game's only runtime dependency besides the fonts, and it loads only when a player opens Co-op.

## The host runs the game

The host's browser runs the one simulation, with every player's hero in it.
The game was written around a single hero held in module state (`hero`, `progress`, the hero's ropes, the input buffer and the kit parts' own memories).
Rather than rewrite more than a hundred files to take a hero as an argument, each of those pieces registers itself as per-player memory (`src/game/seatMemory.ts`).
The host keeps a copy of that memory for every player and swaps a player's copy in before running or drawing their hero (`src/game/coop/hostRun.ts`).
Between steps the host's own hero is swapped in, so the host's keyboard, HUD and skill cards work exactly as in solo play.

The shared game code asks a small set of hooks which hero to act on (`src/game/coopHooks.ts`):

- each foe acts against the nearest standing hero, and so do coins, orbs and pickups;
- a foe's blow, shot or hazard strikes every standing hero it reaches, each one once;
- every effect remembers the hero who made it, so a flask, a brazier or an ultimate keeps hitting and following for its owner;
- the step runs each hero's update, afterimages and input ageing once per hero;
- the scene draws each hero, their anchors and thrown sword, a ring in the player's colour on the floor under each one so two of the same hero can be told apart, and a P1 to P4 tag in the same colour over each one, stacked when heroes stand together.

Solo play sets no hooks, so every one of those call sites behaves as before, and no network code is loaded or run.

## Guests send keys and watch a stream

A guest sends every key press and release to the host over a reliable WebRTC data channel, and the host feeds it into that player's input buffer.
The host streams its game picture and sound to each guest as a WebRTC video call, drawn at 640 by 360 so each art pixel is a 2 by 2 block and the video's colour samples land on whole art pixels.
The guest draws each video frame onto its own game canvas without smoothing.
Fifteen times a second the host also sends each guest the per-player memory of their own hero, and the guest loads it into its own game state, so its HUD, touch controller and skill cards run on the game's own code.

This differs from the reference, which sends the whole race state and interpolates it on every client.
Warpblade has more than a hundred effect types written as closures that move and draw themselves, plus particles and lights, and none of that can be sent as data without a rewrite of the renderer.
Streaming the picture shows guests every effect exactly as the host draws it, today, with no second renderer to keep in step.
The cost is video softness on a slow link and about one round trip plus a video frame of input delay for guests.

## Players who fall

A hero whose HP runs out lies down and is skipped by foes, coins and orbs.
Their status line reads "Down until the wave is cleared".
When the wave is cleared, every downed hero stands up with half their HP.
The run ends only when every hero is down at once, or when wave 30 is cleared.
Last Light still saves each player once per run if they bought it.

## Picks at the end of a wave

Experience is shared: an orb picked up by anyone gives its experience to every hero, so the room levels together.
Each player still has their own skill points and cards, rolled from their own hero's tree.
When a wave is cleared with points waiting, the game pauses for everyone while those players choose.
A player with nothing to choose reads "Waiting for P2 to pick".
A guest's choice travels to the host as a skill id, and the host checks that the hero can still learn it before applying it.

## Coins and the shop

Each player's hero plays with what that player bought in their own shop, since the guest sends its shop levels when it joins.
Coins a hero picks up are theirs, and coins left on the floor at the end are split evenly.
When the run ends, every player banks their own coins in their own browser and sees the result screen, then goes back to the room for another run.

## More players, more foes

Each player past the first adds 40% more minions to every wave.
Each player past the first also adds a quarter to every minion's HP, half to a mini boss's and three fifths to a boss's.
The numbers live in `COOP_SCALING` in `src/constants/coop.ts`.

## Leaving

A guest who leaves, or whose tab closes, disappears from the field; the others read "P3 left the room" and play on.
Each side sends a heartbeat every 1.5 seconds and counts the other gone after six quiet seconds.
When the host leaves from the pause menu or closes the tab, the run ends for everyone, every guest banks their coins and reads "The host left, so the room has closed."
The pause menu in a room has Resume, Controls, Options and Leave room, and the game keeps running under it since the others are still fighting.

## Failure messages

- A wrong code: "No room has that code. Check it with the host."
- A full room: "That room is full: 4 players already."
- A room that is already playing: "That room is already playing. Join when the run ends."
- A different game version: "The host plays another version. Reload the page and try again."
- No broker: "Could not reach the room server. Check your connection and try again."
- No answer within 12 seconds: "The room did not answer. Check the code and try again."

## Files

- `src/game/seatMemory.ts` and `src/game/coopHooks.ts`: the seams in the shared game code.
- `src/game/coop/`: the host's run (`hostRun.ts`), the host and guest sessions, the session entry the menu loads on demand, player tags and pick ids.
- `src/services/coop/`: the PeerJS links for host and guest, the game stream and its sender tuning, and the error texts.
- `src/store/coop.ts`: the room as the interface sees it.
- `src/ui/menu/coopScreen.ts`, `coopActions.ts` and `joinFromInvite.ts`: the Co-op screen, the lobby and invite links.
- `src/ui/coop/coopStatus.ts`: the line under the pause button with the player's tag and why they wait.
- `src/utils/roomCode.ts`, `coopScaling.ts` and `wire.ts`: codes, foe scaling and state that survives JSON.

## Known limits and what is left for later

- The public PeerJS broker can be slow or down, and it only introduces players; a self-hosted PeerServer or the reference's Worker would remove that dependency.
- There is no TURN relay, so two players behind strict NATs (some mobile carriers) cannot connect; the reference relays through its Worker for that case.
- Guests feel about one round trip of input delay, since their hero moves on the host. Client-side prediction for the guest's own hero would hide it.
- The host's upload carries one video stream per guest, about 2.5 Mbit/s each at most, so a phone host on mobile data will struggle with three guests.
- Guests see the host's frame through a video codec, which softens fine pixels on a slow link. Sending the scene as data, as the reference does, needs effects that can be described as data first.
- A player cannot join a run already under way, and a guest who drops cannot rejoin the same run.
- Banners such as Level 5 are shared by the room and show for everyone.
- Hit-stop freezes the whole room, so a hit by any player pauses every hero for a moment.
  Mash bots spend 10% of play frozen alone and 25% with four Kaels; freezing only the striking hero and the foes it hit would need a step that runs heroes apart from the world.
- Players are named P1 to P4; picking a name is left for later.
- The foe scaling is a first guess that still needs tuning from real games with people.
  Mash bots (walk to the nearest foe, press J, take the first card) in a room fall at wave 4 with one Kael and wave 5 with one Ysra, as in solo play.
  Two Kaels reach waves 5 to 7, four Kaels waves 8 to 10, two Ysras waves 10 to 13, two Kaels with two Ysras waves 15 to 16 and four Ysras waves 17 to 18, so a room of weak players is not overwhelmed; rising at each wave clear carries a team further than any one hero.
- The host's hero choice must be made in the lobby before Start; heroes cannot change during a run.
- Phones pause background tabs, so a phone host who switches apps stalls the room for everyone.
