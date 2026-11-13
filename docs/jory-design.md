# Jory, the war drummer

The ninth hero and the sixth built in the hero sprint (patch 0.9.0).
Id `jory`, kit `jory`, name Jory (he/him), title "The war drummer".
Blurb: "He beat the march for an army that never came home. He still keeps time, and the rift has started to move to it. Miss a beat and he is a big man with two sticks."
Price: 1800 coins in `src/constants/heroUnlocks.ts`, the seventh price by the rule written there.
Accent `#5a82ff` (cobalt), which no other hero uses: Kael's is cyan, Ysra's orange, Sable's mint, Hulda's coral, Orrin's amber, Mirel's teal, Wenna's violet and Tallis's rose.

Code layout follows Tallis and Wenna: kit `src/game/hero/jory/` (his warp in `warpStyle.ts`, his guard in `guardStyle.ts`, his abilities on I in `abilities.ts`), character `src/constants/characters/jory/` (index, look, skills), numbers `src/constants/jory/`, clips `src/constants/clips/jory/`, types and kit events `src/types/jory.ts`, skill behaviours `src/game/skills/jory/`, effects `src/game/effects/jory/`, icons `src/ui/skills/icons/jory/`, touch icons `src/ui/touch/icons/joryArt.ts`, the GV bar `src/ui/grooveBar.ts`, his mallets and drum `src/game/hero/draw/drum.ts`, and his skill tables `docs/skills/jory.md`.
The shared beat clock is `src/game/beat.ts`.

## How he differs from every hero in the game

- Kael (warp swordsman) double jumps and hangs from crystals. His Keen timing is a short window after his own blow lands and only makes the next J a crit. Jory's beat is one clock for the whole run, shown on screen and heard, and it judges his J and I presses and rewards his warp, parry and dodge on the beat. Missing it costs Groove, and keeping it speeds up his whole kit.
- Ysra (planted glaive, brace, pole vault, Heat) meets one blow from the front at the right moment. Jory's parry answers with a Boom off his drum, and his Boom on I pushes everything around him away and drowns foe shots, on his timing, whatever the foes are doing.
- Sable (ranged hunter, aimed bolts, ammo and reload) fights from 250 px. Jory fights at mallet reach (26 px) and his reach grows only with Groove, through the sound wave of his Crash.
- Hulda (unarmed grappler, armour, grabs) walks into blows. Jory has no armour and no grab; he clears space.
- Orrin (chain dancer, pendulum swing, Momentum from speed) earns his resource by moving fast. Jory earns his by moving in time, and his travel is a short measured step.
- Mirel (time mage, Stillfield, Sand refilled by waiting) changes how fast foes act. Jory changes how fast he acts; foes keep their pace.
- Wenna (summoner, Wicks, Wax from kills) fights through bodies. Jory fights alone; his summons are skill procs.
- Tallis (shadow assassin, Veil, Sink, blows from behind) wins by where he stands. Jory wins by when he presses.

The axes:

- Movement: walk and run with one jump of the shared height, the shared dodge, and the shared warp, a mallet thrown at a foe.
- Defence: the drum guard with Counterbeat on a parry, and Boom on I, a radial push that drowns foe shots; on the beat it is a moment of untouchability. No armour.
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
- Every judged button is stamped with the beat-clock time its key went down, also during hit-stop, so a press made in a freeze is judged where it was made, not where it is used. J and I queue their tap only when the key comes up, and the stamp keeps the moment it went down.
- Judging: a press is on the beat when it falls within 0.10 s of real time (0.08 game s, `BEAT.window`) of the nearest beat, before or after.
- Judged presses: J tapped (the press that starts a blow) and I (tapped or held). On the beat +1 Groove, off it -3. W, walking, O and U are never judged. A press refused for stamina, MP or a recharge is not judged.
- Rewarded presses: the shared moves are judged by when their key went down and only ever reward. J held (the warp) on the beat arrives as an Accent, L (the dodge) on the beat builds Groove, and K (a parry) on the beat raises a Groove tier. Off the beat these cost nothing (`judgeShared` in `src/game/hero/jory/beat.ts`).
- Every judged press, and every rewarded press on the beat, emits the kit event `beat` with `onBeat`, `button`, `groove` and `downbeat`.

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
| J tapped | Mallet string: Tap, Roll, Crash, the same every time. In the air, Downstroke, once per airtime |
| J held | The warp: a mallet spun end over end at the foe, and he arrives with a crash |
| K | Guard with the drum; a parry is Counterbeat |
| L | The shared front dodge |
| I | Selected ability: Boom (stamina), Steady Hand, Thunder Skin, or a spell skill (MP). Held on Thunder Skin, a wave each way |
| O | Switch ability |
| U | Special: Drumroll (shared charge and MP rules) |

Touch buttons read Mallets (hold for the warp), Jump, Dodge, Guard, Ability (hold for the wide form), Switch and Special, with icons in `joryArt.ts`; nothing has to be held that a key does not hold.
The Controls screen lists every key above from `ACTION_TEXT.jory` and, on touch screens, the stick (`STICK_DIRECTIONS.jory`) and the buttons (`TOUCH_TEXT.jory`).

## J: the mallet string

J on the floor plays Tap, Roll and Crash in that order every time, wherever foes stand, and never turns him (`docs/combo-design.md`).
Each blow's clip lasts one beat at the current tempo: 15 clip frames at 96 bpm, played faster by `attackRate()` at higher tiers. A queued J starts the next blow from 0.8 of the clip. Crash lasts 1.25 beats and the next string's Tap may start from 1.0 beat.

Which press is judged: every J. A J pressed before the current blow's hit frame still queues the next blow but counts as off the beat, so mashing never builds Groove. A later J on the beat, after the hit frame, turns the queued blow into an Accent. A J from a stand is judged at once, and a J during the flinch after a blow is judged at once, with its thump or click, and kept: if it was pressed at most 0.2 game s before the flinch ends (`BEAT.keepJ`), its blow starts as the flinch ends, with the judgement it already had. The knockback leaves him in the air, so the kept press waits for the landing and opens the string with Tap there, never a Downstroke. Every press gets an answer.

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

## J held: the warp

The shared warp (`docs/moveset-design.md`): the same throw, flight, reach, cost, recharge and arrival power as every hero.

- He spins a mallet end over end at the nearest foe ahead (`drawThrownMallet` in `src/game/effects/jory/thrownMallet.ts`), a dark wood shaft and a cobalt felt head with ghosts of the head along its turn.
- He arrives with a crash: Crash's smear and its arcs, dust, and the shared arrival blow's power in front of him (`src/game/hero/jory/warpStyle.ts`).
- The long press is judged by when J went down. On the beat it builds Groove as any on-beat press, and the arrival is an Accent: the Accent ring on the foe and the `accent` event with `blow` Crash, which his Accent skills answer. Its power stays the shared warp's.
- Landing on the floor, Crash Wave sends its wave from the arrival as from a Crash.

## K: the drum guard and Counterbeat

- Held, he raises the war drum in front of him (`JORY_GUARD_CLIP` in `src/constants/clips/jory/shared.ts`), and a thin upright half ring of sound stands in front of it, pulsing with the beat and white while a press can still parry.
- A block lets 30% of the blow through and costs 16 stamina (`DRUM_GUARD`), a middling block.
- A parry is Counterbeat: after the shared parry, a full Boom bursts from the drum (the on-beat ring of 40 px), pushing minions out and drowning foe shots, and emits `boom`.
- With K pressed on the beat, Counterbeat also raises his Groove to the first pip of the next tier (from tier 1 to 4 Groove, tier 2 to 8, tier 3 to Crescendo).
- A blow blocked on the drum emits the kit event `drumBlock` with the foe that struck it, which Ringing Ears answers.

## L: the dodge

The shared front dodge, with the same numbers as every hero.
Pressed on the beat it builds Groove and leaves a small cobalt ring where it starts; off the beat it costs nothing.
The shared `dash` event at its end carries the foes it passed, which Step Touch strikes.

## Abilities on I, rotation on O

Each has its own recharge, and none waits on another (`JORY_SLOTS` in `src/game/hero/jory/abilities.ts`).
I on a recharging ability casts the next ready one. Every cast is a judged press: on the beat +1 Groove, off the beat -3.

- Boom: 25 stamina, 0.5 game s recharge, the first ability.
  - On the beat: a ring of radius 40 px. Minions inside are pushed out to 52 px from him over 0.12 s (elites to 46 px) and staggered. Mini bosses and the bosses take the damage only. Every foe shot within 48 px vanishes with a cobalt spark (a shot ward held for 0.12 s, `src/game/shotWards.ts`). He is untouchable for 0.12 s, and a blow that meets that moment is a perfect dodge, once per Boom.
  - Off the beat: a ring of 26 px, the same push and stagger inside it, no shot erasing and no untouchable moment.
  - Damage to each foe in the ring: 0.5x AP + 0.2x AD, from his abilities. It works on the floor and in the air, and emits the kit event `boom` with `onBeat` and `foes`.
- Steady Hand: 20 MP, 12 s recharge. For the next 8 beats his window is 0.18 s and Groove cannot fall. A small cobalt metronome arm swings over his head on each beat until it ends.
- Thunder Skin: 16 MP, 5 s recharge. He drops to one knee and beats the drum against the floor. A wave runs 160 px ahead at 260 px/s, 0.9x AP + 0.4x AD to each foe it passes, staggering minions. On the beat it runs 200 px and knocks minions down. Held (I held), for 24 MP, a second wave runs behind him.

Steady Hand and Thunder Skin emit `cast` with ability `steadyHand` or `thunderSkin`; his spell skills emit theirs with their own ids.
The shared HUD tabs (BOOM, STEADY, THUNDER and the spell skills) and the touch Ability button show the selected one and its recharge; the BOOM tab shows its stamina cost.

## U: Drumroll

Shared charge levels and MP costs.

- On release he plants the drum in front of him and plays a roll of 2, 3, 4 or 6 heavy beats by charge level at 150 real beats a minute, whatever his tempo.
- Each beat sends a ring of 70, 90, 110 or 140 px that deals the level's power x 0.3 x (AD + AP) and staggers minions. The last ring throws minions up (160 px/s) and knocks elites down.
- Screen shake 2 px a ring, 4 px on the last. He is untouchable from the release to the last ring.
- After it his Groove is at least 8 (tier 3), and silence costs no Groove for the next 8 beats (`DRUMROLL.grace`), so tier 3 lasts long enough to use: the first silent pip goes 12 beats after the roll.
- The ultimate skill Drumroll (`j_drumroll`) upgrades it over eight levels and an evolution: cymbal crashes on each foe a ring reaches, wider rings that pull minions in, Crescendo held after it, a stun, an extra beat and MP back, and evolved twice as many beats with a knockdown on every ring. The cast reads it through `ultimateValues()`.

## The 20 skills

Full level tables in `docs/skills/jory.md`, written from the data.
Each skill adds a new property on at least four of its seven level ups, as `docs/skill-design.md` requires.
The precise skills pay off on an on-beat press, his hard move.
Skills that act "on each beat" read his beat clock (the kit event `tick`), so they speed up with Groove; they are budgeted at tier 2, the tempo an ordinary player holds.

Counts: attack 6, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 1. Risk: precise 5, easy 7, timed 8.
Crash Wave changes the warp, Ringing Ears the guard, and Step Touch the dodge.

Kit events declared in `src/types/jory.ts`: `beat`, `accent`, `boom`, `drumBlock`, `tier` and `tick` (a beat of his clock went by, with `beats` and `downbeat`). The shared `cast`, `jump`, `dash` and `perfectDodge` are emitted as for Tallis.

## Look

Shared rig with his own skin in `src/constants/characters/jory/look.ts`.

- Deep brown skin, shaved sides with a short black topknot, a cobalt headband whose two short ends ride the ponytail's rope (the new `headband` skin flag), and a short black beard.
- A sleeveless slate jerkin with pewter studs, bare forearms with cobalt wrist wraps, wide dark trousers tucked into wrapped boots, and a cobalt sash along the scarf's rope.
- The war drum on a leather strap from his far shoulder, at his hip: an oxblood shell (the new `DRUM` ramp), pewter hoops, a pale hide head and cobalt lacing in a zigzag (`src/game/hero/draw/drum.ts`). A new pose key, `dr`, swings it from the hip (axis level) to the front of his belly (axis upright, head up) for Crash, Boom, Counterbeat, Thunder Skin, the charge and Drumroll. `dr` is 0 in the shared standing pose, so no other hero changes.
- Two mallets with dark wood shafts and cobalt felt heads, the near one at the clip's blade angle and the far one along its forearm.

New ramps in `src/constants/palette.ts`: `PAL.beat` (`#0a0f2a`, `#182a66`, `#2c4fb0`, `#5a82ff`, `#a6c0ff`, `#eef3ff`), `SPARKS.beat`, and `DRUM` (`#3a1210`, `#7a2a24`, `#a8443a`, `#d07060`).
His own clips in `src/constants/clips/jory/`: the stance, the ride poses and the rest idle, every blow, Boom, Steady Hand, Thunder Skin, the spell cast, the charge, the Drumroll, the warp's throw and arrival, and the guard. Walk, run, jump, fall, the dodge, the warp's wait, hurt and death use the shared clips through the motion layer with the drum at the hip and the mallets close, so they never cut through the body.

## Achievements

- `heroTrial("jory", "Jory")`: clear wave 10 with him, 40 coins.
- In Time (Skill, 60 coins): "As Jory, hold Crescendo for 20 seconds in a row." Tracked stat `crescendoSeconds`, the best of a run in whole real seconds, through the feat `crescendo` (`src/utils/trackedStats.ts`).
- The plan expected 30 achievements worth 1,870 coins before him. The day work had already added Lights Out, so the game had 31 worth 2,370; with his two it has 33 worth 2,470 (`docs/achievements.md` now says so).

## Shop items (docs/meta-progress.md)

Vitality: his HP. Honed Edge: every mallet blow, the warp, the Crash wave, Downstroke and Step Touch. Arcana: Boom, Thunder Skin, the spells, the ability power dots and Drumroll. Wellspring: abilities and the special spend MP. Precision: every hit. Light Boots: walk, run and the dodge. Endurance: Boom, the guard and the dodge spend stamina. Aftershock: the dodge and the warp call `travelEnded()` in shared code. Lodestone, Head Start and Last Light work in shared code.

## Co-op

The beat clock, Groove, the press stamps, the ability recharges and Steady Hand's beats live in his seat memory (`rememberPerSeat(objectMemory(jory))`), and the selected ability in the shared bar's, so each Jory keeps his own tempo and a guest's HUD and touch buttons read his own Groove.
His rings and waves are host-side effects.
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
| Jory | | 4, 10, 98.9 |

The other eight heroes play exactly as before.
Jory falls on wave 4, within two waves of every hero and past the plan's floor of wave 3, so his stats stay as planned. Over the QA rounds his mash result moved between wave 4 and wave 5 as the handling of a J pressed during the flinch changed; it now waits for the landing and opens with Tap.

The mash bot only mashes J, so Jory never builds Groove and plays at tier 1 throughout: the floor of his kit.
No fallback step was needed.

### After the shared moveset (13 November 2026)

Deterministic runs from wave 1, before on the core branch with his old K and L, after with the warp, the drum guard, the dodge and Boom on I:

| Policy | Before: wave, kills, game s | After: wave, kills, game s |
| --- | --- | --- |
| Mash | 4, 10, 98.9 | 4, 10, 98.9 |
| Skilled | 5, 14, 94.5 | 5, 18, 109.1 |

Kael on the same code: mash 5, 14, 94.0; skilled 5, 15, 98.3.
The mash bot presses only J, so its run is the same as before.
The skilled bot warps, dodges and casts Boom, and now lasts longer and fells more foes than Kael, all off the beat.

## Note for the owner

The playtest bots have no Jory entry, and the skilled bot plays him like any hero, pressing off the beat and never guarding.
A skilled policy for him would read his beat phase (`jory.phase` and `jory.beatLen` in his seat memory) and press J, I, the dodge and the guard within 0.05 s of each beat, and press K just as a foe's blow lands for Counterbeat.
