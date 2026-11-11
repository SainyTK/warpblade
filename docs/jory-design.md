# Jory, the war drummer

The ninth hero and the sixth built in the hero sprint (patch 0.9.0).
Id `jory`, kit `jory`, name Jory (he/him), title "The war drummer".
Blurb: "He beat the march for an army that never came home. He still keeps time, and the rift has started to move to it. Miss a beat and he is a big man with two sticks."
Price: 1800 coins in `src/constants/heroUnlocks.ts`, the seventh price by the rule written there.
Accent `#5a82ff` (cobalt), which no other hero uses: Kael's is cyan, Ysra's orange, Sable's mint, Hulda's coral, Orrin's amber, Mirel's teal, Wenna's violet and Tallis's rose.

Code layout follows Tallis and Wenna: kit `src/game/hero/jory/`, character `src/constants/characters/jory/` (index, look, skills), numbers `src/constants/jory/`, clips `src/constants/clips/jory/`, types and kit events `src/types/jory.ts`, skill behaviours `src/game/skills/jory/`, effects `src/game/effects/jory/`, icons `src/ui/skills/icons/jory/`, touch icons `src/ui/touch/icons/joryArt.ts`, the GV bar `src/ui/grooveBar.ts`, his ability tabs `src/ui/joryTabs.ts`, his mallets and drum `src/game/hero/draw/drum.ts`, and his skill tables `docs/skills/jory.md`.
The shared beat clock is `src/game/beat.ts`.

## How he differs from every hero in the game

- Kael (warp swordsman) dashes untouchable through foes whenever he likes, double jumps and teleports. His Keen timing is a short window after his own blow lands and only makes the next J a crit. Jory's beat is one clock for the whole run, shown on screen and heard, and it judges every J, K, L and I. Missing it costs Groove, and keeping it speeds up his whole kit.
- Ysra (planted glaive, brace and parry, pole vault, Heat) meets one blow from the front at the right moment. Jory cannot block or parry. His Boom pushes everything around him away and drowns foe shots, on his timing, whatever the foes are doing.
- Sable (ranged hunter, aimed bolts, ammo and reload) fights from 250 px. Jory fights at mallet reach (26 px) and his reach grows only with Groove, through the sound wave of his Crash.
- Hulda (unarmed grappler, armour, grabs) walks into blows. Jory has no armour and no grab; he clears space.
- Orrin (chain dancer, pendulum swing, Momentum from speed) earns his resource by moving fast. Jory earns his by moving in time, and his travel is a short measured step.
- Mirel (time mage, Stillfield, Sand refilled by waiting) changes how fast foes act. Jory changes how fast he acts; foes keep their pace.
- Wenna (summoner, Wicks, Wax from kills) fights through bodies. Jory fights alone; his summons are skill procs.
- Tallis (shadow assassin, Veil, Sink, blows from behind) wins by where he stands. Jory wins by when he presses.

The axes:

- Movement: walk and run with one jump of the shared height, plus Beat Step, a short step whose length grows with Groove and which is safe only on the beat.
- Defence: Boom, a radial push that drowns foe shots; on the beat it is a moment of untouchability. No block, parry or armour.
- Resource: Groove (GV), built only by pressing on the beat, which sets his tempo.
- Range: 26 px mallets, a 44 px Crash (54 px from tier 2), and a sound wave of 90 px at tier 3 and 150 px at Crescendo.
- Attack shape: rhythmic. One fixed string whose blows hit harder on the beat and speed up with the tempo.

## Stats

`base: { ad: 12, ap: 8, hp: 105, mp: 85, stamina: 110, crit: 0.04, move: 1, aspd: 1, haste: 1 }`, `growth: { hp: 1, mp: 0.3 }`, `comboHits: 3`, `special: "drumroll"`.
AD 12 is high because off the beat he swings at the slowest tempo in the roster; a player who never keeps time still plays like an ordinary hero.

## The beat

- Each seat playing Jory has a beat clock in his kit's seat memory (`jory` in `src/game/hero/jory/memory.ts`). A run starts it at 0 on its first frame.
- Tempo by Groove tier, in real beats a minute: tier 1 96, tier 2 108, tier 3 120, Crescendo 132 (`TEMPO_BPM`). In game seconds a beat lasts `60 / bpm * PACE`: 0.5, 0.444, 0.4 and 0.364, so 0.625, 0.556, 0.5 and 0.455 real seconds.
- A tempo change takes effect at the next beat, so the beat never jumps.
- `advanceBeats(dt)` in `src/game/beat.ts` runs from `stepGame` after the pick and chest check and before the hit-stop branch and the update. It ticks the clock of every seat whose kit is Jory's by `STEP * PACE`, so beats stay evenly spaced in real time through hit-stop and the perfect-dodge slow motion. The skill pick, the chest and solo pause stop it, and it resumes where it stopped. With no Jory in the run it does nothing.
- Every judged button's press is stamped with the beat-clock time it was first seen, also during hit-stop, so a press made in a freeze is judged where it was made, not where it is used.
- Judging: a press is on the beat when it falls within 0.10 s of real time (0.08 game s, `BEAT.window`) of the nearest beat, before or after.
- Judged presses: J (the press that starts a blow), K, L and I. W, walking, O and U are never judged. A press refused for stamina, MP or a recharge is not judged.
- Every judged press emits the kit event `beat` with `onBeat`, `button`, `groove` and `downbeat`.

### The guest window, as shipped

The room did not measure a round trip, so tonight's patch adds one.
On each heartbeat (every 1.5 s) the host sends every guest a `probe` stamped with its clock, the guest sends it straight back, and the host keeps each guest's round trip smoothed over the probes (`RTT_SMOOTHING`) on the guest and on its seat in a run (`inputLag()` in `src/game/coopHooks.ts`).
A guest sees the beat a one-way trip and a video frame late, and its keys take another one-way trip to the host.
So a guest seat (`heroSlot() > 0`) is judged within 0.14 s (`BEAT.guestWindow`) against the beat shifted later by its round trip plus one video frame (1/30 s), at most 0.3 s.
Until the first probe comes back the shift is 0.12 s (`BEAT.guestLag`).

### Cues

- Floor ring: an ellipse at his feet in `PAL.beat[3]`, one art pixel wide and 3 px tall, closing from 26 px to 14 px wide over each beat and flashing `PAL.beat[5]` for two frames on the beat; on a bar's downbeat the flash is 2 px wider, and at Crescendo the ring is doubled. It is drawn by the kit's new `drawFloor` hook, which the scene calls after the shadows and before the foes, so it never covers a wind-up.
- Body: his idle rides the beat. The near mallet rises through the second half of each beat, peaks just before the beat and taps down on it; his head nods on each beat in his idle, walk and run, and the sash moves with the nod.
- GV bar: a lamp after the bar flashes on each beat.
- Sound: `sfx.beat(downbeat)` plays on each beat, `tone(110, 70, 0.07, "sine", 0.04)` and 0.06 on a downbeat. An on-beat press adds `sfx.thump()`, an off-beat press the muted `sfx.offBeat()`, and a tier up two rising triangle notes (`sfx.tierUp()`; `tone` takes an optional start delay for the second note). In a room with two Jorys only the first seat's tick plays.

## Groove (GV bar)

- A whole number from 0 to 12; a run starts at 0.
- An on-beat judged press: +1. An off-beat judged press: -3. A blow that takes his HP: -4. While a foe stands on the stage, every beat after four beats with no judged press: -1. Between waves it holds, since no foe stands.
- Tiers: 1 at 0 to 3, 2 at 4 to 7, 3 at 8 to 11, Crescendo at 12.
- His blow clips play at `attackRate()` = tier bpm / 96 (1.0, 1.125, 1.25 and 1.375) on top of attack speed, so a blow played through lasts one beat at any tier.
- Tier 2: Crash reaches 54 px. Tier 3: Crash also sends a sound wave along the floor, 90 px at 300 px/s for 0.6x AD, that passes through foes and staggers minions. Crescendo: the wave runs 150 px for 0.8x AD and knocks minions down, Accents deal 1.6x, the floor ring doubles and his mallet heads trail cobalt sparks.
- HUD: a second bar under stamina, label GV. Twelve pips in three groups of four. Fill by tier: `--beat-low`, `--beat`, `--beat-pale`, then `--beat-hot` with a soft glow at Crescendo (the `PAL.beat` colours in `src/tokens.css`). A lost pip blinks grey for 0.2 s.

## Controls

| Key | Jory |
| --- | --- |
| A / D | Walk; a double tap runs |
| W | One jump of the shared height. No double jump |
| S | With W, drop through a ledge |
| J | Mallet string: Tap, Roll, Crash, the same every time. In the air, Downstroke, once per airtime |
| K | Boom |
| L | Beat Step, toward the side held, or back with none held |
| I | Selected ability: Steady Hand, Thunder Skin, or a spell skill (MP) |
| O | Switch ability |
| U | Special: Drumroll (shared charge and MP rules) |

Touch buttons read Mallets, Jump, Boom, Step, Ability, Switch and Special, with icons in `joryArt.ts`; nothing has to be held that a key does not hold.
The Controls screen lists every key above from `ACTION_TEXT.jory` and, on touch screens, the stick (`STICK_DIRECTIONS.jory`) and the buttons (`TOUCH_TEXT.jory`).

## J: the mallet string

J on the floor plays Tap, Roll and Crash in that order every time, wherever foes stand, and never turns him (`docs/combo-design.md`).
Each blow's clip lasts one beat at the current tempo: 15 clip frames at 96 bpm, played faster by `attackRate()` at higher tiers. A queued J starts the next blow from 0.8 of the clip. Crash lasts 1.25 beats and the next string's Tap may start from 1.0 beat.

Which press is judged: every J. A J pressed before the current blow's hit frame still queues the next blow but counts as off the beat, so mashing never builds Groove. A later J on the beat, after the hit frame, turns the queued blow into an Accent. A J from a stand is judged at once, and a J during the flinch after a blow is judged at once, with its thump or click, and kept: if it was pressed at most 0.2 game s before the flinch ends (`BEAT.keepJ`), its blow starts the moment the flinch ends, as any hero's late press does, with the judgement it already had. Every press gets an answer.

Accent: a blow started by an on-beat press deals 1.4x (1.6x at Crescendo), shows a cobalt ring at the struck point (one image pixel wide, 4 to 14 px over 0.15 s, with a one-pixel white core and a small cobalt light on the hit frame only, in place of the shared hit spark, so a crowd of Accents never washes the foes out), plays the thump, and emits the kit event `accent` with `foe`, `blow` and `downbeat`. Off the beat the blow is plain and shows only the shared hit spark.

| Blow | Clip frames at 96 bpm | Hit on | Reach | Power | Knockback | Hit-stop, shake, pitch | Extra |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tap | 15 | 2 | 6 to 26 px, 4 to 30 px up | 0.95x AD | 6 | 0.05 s, 1 px, 1.2 | |
| Roll | 15 | 2 and 5 | 6 to 26 px, 4 to 30 px up | 0.55x AD each | 4 each | 0.04 s, 1 px, 1.3 | two hits, one judged press |
| Crash | 19 | 3 | 4 to 44 px ahead, 0 to 36 px up | 1.45x AD | 60 | 0.12 s, 3 px, 0.75 | heavy (breaks a guard), knockdown |
| Downstroke (air) | 12 | 4 | 4 to 22 px ahead, 30 px down | 1.1x AD | 20 | 0.06 s, 1.5 px, 1.0 | once per airtime; an Accent that lands bounces him 18 px up |

Every string blow staggers for the shared `COMBO.stagger`.
Crash's knockdown is a short throw of 120 px/s up (`KNOCKDOWN`), which lays a minion on its back stunned until it gets up.
Hit frames are early on purpose, so the impact lands close to the beat pressed on; the wind-up is carried by the beat ride, which has the mallet raised on the beat, and each blow still shows one calm wind-up frame before its hit frame (`src/constants/clips/jory/mallets.ts`).

## K: Boom

- 25 stamina, then 0.5 game s before the next Boom. With too little stamina the press gets the shared tired puff and is not judged.
- On the beat: a ring of radius 40 px. Minions inside are pushed out to 52 px from him over 0.12 s (elites to 46 px) and staggered. Mini bosses and the bosses take the damage only. Every foe shot within 48 px vanishes with a cobalt spark (a shot ward held for 0.12 s, `src/game/shotWards.ts`). He is untouchable for 0.12 s from the press, and a blow that meets that moment is a perfect dodge, once per Boom.
- Off the beat: a ring of 26 px, the same push and stagger inside it, no shot erasing, no untouchable moment, and -3 Groove.
- Damage to each foe in the ring: 0.5x AP + 0.2x AD, from his abilities.
- Works on the floor and in the air, and emits the kit event `boom` with `onBeat` and `foes`.

## L: Beat Step

- A step of 34, 40, 46 or 52 px by tier over 0.15 game s, after a two frame load, toward the side held, or back with none held. 18 stamina, then 0.25 game s before the next step.
- On the beat: untouchable from the press to the end of the slide, through ground foes; a blow in its first 0.12 s is a perfect dodge, once per step.
- Off the beat: the same travel, he can be hit, he stops against a ground foe's body, and -3 Groove.
- In the air: once per airtime, a level step of 70% of the distance.
- Each step calls `travelEnded()` (Aftershock) and emits the shared `dash` with its direction and the foes it passed.

## Abilities on I (MP), rotation on O

Both are judged presses: on the beat +1 Groove, off the beat -3.

- Steady Hand: 20 MP, 12 s recharge. For the next 8 beats his window is 0.18 s and Groove cannot fall. A small cobalt metronome arm swings over his head on each beat until it ends.
- Thunder Skin: 16 MP, 5 s recharge. He drops to one knee and beats the drum against the floor. A wave runs 160 px ahead at 260 px/s, 0.9x AP + 0.4x AD to each foe it passes, staggering minions. On the beat it runs 200 px and knocks minions down.

Both emit `cast` with ability `steadyHand` or `thunderSkin`; his spell skills emit theirs with their own ids.
The HUD tabs (STEADY, THUNDER and the spell skills) and the touch Ability button show the selected one and its recharge.

## U: Drumroll

Shared charge levels and MP costs.

- On release he plants the drum in front of him and plays a roll of 2, 3, 4 or 6 heavy beats by charge level at 150 real beats a minute, whatever his tempo.
- Each beat sends a ring of 70, 90, 110 or 140 px that deals the level's power x 0.3 x (AD + AP) and staggers minions. The last ring throws minions up (160 px/s) and knocks elites down.
- Screen shake 2 px a ring, 4 px on the last. He is untouchable from the release to the last ring.
- After it his Groove is at least 8 (tier 3), and silence costs no Groove for the next 8 beats (`DRUMROLL.grace`), so tier 3 lasts long enough to use: the first silent pip goes 12 beats after the roll.
- The ultimate skill `j_finale` replaces it with Grand Finale.

## The 20 skills

Full level tables in `docs/skills/jory.md`, written from the data.
Each skill adds a new property on at least four of its seven level ups, as `docs/skill-design.md` requires.
The precise skills pay off on an on-beat press, his hard move.
Skills that act "on each beat" read his beat clock (the kit event `tick`), so they speed up with Groove; they are budgeted at tier 2, the tempo an ordinary player holds.

Counts: attack 6, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 1. Risk: precise 5, easy 7, timed 8.

Kit events declared in `src/types/jory.ts`: `beat`, `accent`, `boom`, `tier` and `tick` (a beat of his clock went by, with `beats` and `downbeat`). The shared `cast`, `jump`, `dash` and `perfectDodge` are emitted as for Tallis.

## Look

Shared rig with his own skin in `src/constants/characters/jory/look.ts`.

- Deep brown skin, shaved sides with a short black topknot, a cobalt headband whose two short ends ride the ponytail's rope (the new `headband` skin flag), and a short black beard.
- A sleeveless slate jerkin with pewter studs, bare forearms with cobalt wrist wraps, wide dark trousers tucked into wrapped boots, and a cobalt sash along the scarf's rope.
- The war drum on a leather strap from his far shoulder, at his hip: an oxblood shell (the new `DRUM` ramp), pewter hoops, a pale hide head and cobalt lacing in a zigzag (`src/game/hero/draw/drum.ts`). A new pose key, `dr`, swings it from the hip (axis level) to the front of his belly (axis upright, head up) for Crash, Boom, Thunder Skin, the charge and Drumroll. `dr` is 0 in the shared standing pose, so no other hero changes.
- Two mallets with dark wood shafts and cobalt felt heads, the near one at the clip's blade angle and the far one along its forearm.

New ramps in `src/constants/palette.ts`: `PAL.beat` (`#0a0f2a`, `#182a66`, `#2c4fb0`, `#5a82ff`, `#a6c0ff`, `#eef3ff`), `SPARKS.beat`, and `DRUM` (`#3a1210`, `#7a2a24`, `#a8443a`, `#d07060`).
His own clips in `src/constants/clips/jory/`: the stance, the ride poses and the rest idle, every blow, Boom, Beat Step, Steady Hand, Thunder Skin, the spell cast, the charge and the Drumroll. Walk, run, jump, fall, hurt and death use the shared clips through the motion layer with the drum at the hip and the mallets close, so they never cut through the body.

## Achievements

- `heroTrial("jory", "Jory")`: clear wave 10 with him, 40 coins.
- In Time (Skill, 60 coins): "As Jory, hold Crescendo for 20 seconds in a row." Tracked stat `crescendoSeconds`, the best of a run in whole real seconds, through the feat `crescendo` (`src/utils/trackedStats.ts`).
- The plan expected 30 achievements worth 1,870 coins before him. The day work had already added Lights Out, so the game had 31 worth 2,370; with his two it has 33 worth 2,470 (`docs/achievements.md` now says so).

## Shop items (docs/meta-progress.md)

Vitality: his HP. Honed Edge: every mallet blow, the Crash wave, Downstroke and Step Touch. Arcana: Boom, Thunder Skin, the spells, the ability power dots and Drumroll. Wellspring: abilities and the special spend MP. Precision: every hit. Light Boots: walk, run and Beat Step's distance. Endurance: Boom and Beat Step spend stamina. Aftershock: every Beat Step's end calls `travelEnded()`. Lodestone, Head Start and Last Light work in shared code.

## Co-op

The beat clock, Groove, the press stamps, the Boom and Step waits, Steady Hand's beats and the selected ability live in his seat memory (`rememberPerSeat(objectMemory(jory))`), so each Jory keeps his own tempo and a guest's HUD and touch buttons read his own Groove.
His rings and waves are host-side effects, and the foes his kit holds on to are in host-only memory.
The guest window is set out under The beat.

## What stays unchanged

The other eight heroes' kits, numbers and clips. `PACE`, the combo layer and the day work.
Shared seams added for him, each a no-op for every other hero: the `drawFloor` kit hook, the `dr` pose key (0 everywhere else), the `drum` and `headband` skin flags, the `mallets` weapon, `sfx.tone`'s optional start delay, and `advanceBeats`, which does nothing without a Jory.
Saves: coins, shop levels, unlocked heroes and options load as before; the new tracked stat starts at 0 in an old save (`parseTracked` reads a missing counter as 0).

## Bot check

Mash bot from wave 1, deterministic runs, after all of tonight's changes:

| Hero | Baseline wave, kills, game s | Tonight wave, kills, game s |
| --- | --- | --- |
| Kael | 5, 14, 82.6 | 5, 14, 82.6 |
| Ysra | 5, 17, 77.1 | 5, 17, 77.1 |
| Sable | 5, 17, 73.7 | 5, 17, 73.7 |
| Hulda | 5, 14, 104.4 | 5, 14, 104.4 |
| Orrin | 5, 18, 75.1 | 5, 18, 75.1 |
| Mirel | 5, 18, 81.4 | 5, 18, 81.4 |
| Wenna | 5, 15, 87.1 | 5, 15, 87.1 |
| Tallis | 3, 9, 67.1 | 3, 9, 67.1 |
| Jory | | 5, 15, 114.8 |

The other eight heroes play exactly as before.
Jory falls on wave 5, level with every hero but Tallis and past the plan's floor of wave 3, so his stats stay as planned. Before QA he fell on wave 4 with 11 kills; judging every J, including a J during the flinch, lets the mash bot recover faster after a hit.

The mash bot only mashes J, so Jory never builds Groove and plays at tier 1 throughout: the floor of his kit.
No fallback step was needed.

## Note for the owner

The playtest bots have no Jory entry, and the skilled bot plays him like any hero, pressing off the beat.
A skilled policy for him would read his beat phase (`jory.phase` and `jory.beatLen` in his seat memory) and press J, K and L within 0.05 s of each beat, press K when a foe shot is within 60 px, and press L on the beat when a foe winds up in front of him.
