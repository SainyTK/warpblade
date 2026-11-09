# Mirel, the hour keeper

Mirel is the sixth hero and the third one the studio built in the hero sprint (patch 0.6.0).
She is a time mage with a staff topped by a clock ring.
Every blow she lands repeats itself half a second later as an echo, she holds open a Stillfield where foes and their shots crawl, and she rewinds along her own path to undo a mistake.
She spends Sand, an hourglass that refills while she waits.

Id `mirel`, kit `mirel`, name Mirel, title "The hour keeper".
Blurb: "A keeper of the rift's broken clocks. She holds moments still, strikes once and again half a second later, and walks back out of a mistake before it lands. Fragile, patient, and never where the blow expected her."

## How she differs from every hero in the game

- Kael (warp swordsman): runs, double jumps, dashes untouchable forward through foes and teleports to a thrown pick.
  Mirel has no run, no double jump, no dash and no teleport.
  Her escape goes backwards in time along the path she already walked, and it heals.
- Ysra (planted glaive, brace and parry, vault, Heat): blocks and parries from the front and builds Heat from blows.
  Mirel cannot block.
  She avoids blows by slowing them in a field or undoing them with Rewind, and her resource refills by waiting.
- Sable (ranged hunter, ammo and reload): fires bolts to 250 px.
  Mirel fights at staff length (38 px) and places her control 56 px ahead.
  Her one projectile ability is short and slow.
- Hulda (unarmed grappler, armour, grabs): walks into blows behind armour plates.
  Mirel has the lowest HP of the roster and no armour; she changes how fast foes act.
- Orrin (chain dancer, pendulum swing, Momentum): keeps speed through the air and wants constant motion.
  Mirel hangs nearly still in the air and is strongest standing beside a still crowd.

Axes that differ:
- Movement: a slow walk, one jump, a hover at the apex, and Rewind.
- Defence: Stillfield slows foes and their shots; Rewind undoes HP loss.
- Resource: Sand, a timer budget spent on bending time, refilled by waiting.
- Range: short staff plus a field placed at mid range.
- Attack shape: every blow lands twice, now and 0.5 s later at the same place (the echo), so she lays traps in time.

## Stats and unlock

`base: { ad: 9, ap: 12, hp: 88, mp: 110, stamina: 100, crit: 0.05, move: 0.95, aspd: 1, haste: 1 }`, `growth: { ad: 0, ap: 0, hp: 1.0, mp: 0.3 }`, `comboHits: 3`, `special: "hourOfStillness"`.
Accent `#6fe0c8` (clock teal).
Price 750 coins in `src/constants/heroUnlocks.ts` (the fourth price by the rule written there).
Her kit is `src/game/hero/mirel/`, her character `src/constants/characters/mirel/` (index, look, skills), her numbers `src/constants/mirel/` and her clips `src/constants/clips/mirel/`.

## Controls

| Key | Mirel |
| --- | --- |
| A / D | Walk, about 65 px/s. No run; a double tap does nothing |
| W | One jump of 50 px. No double jump. Held past the top of the jump: hover |
| S | With W, drop through a ledge |
| J | Staff string: Tick, Tock, Toll. In the air: Pendant Strike, one per airtime |
| K | Stillfield. Hold to keep it open, release to close it. W held places it above her, S held places it on her |
| L | Rewind |
| I | Selected ability: Stopped Clock, Second Hand, or a spell skill (MP) |
| O | Switch ability |
| U | Special (shared charge and MP rules) |

Touch buttons read Staff, Jump, Still, Rewind, Ability, Switch and Special, icons in `src/ui/touch/icons/mirelArt.ts`.
Still works on hold (lift to close), Jump works on hold for the hover.
The stick pushed up or down while pressing Still aims the field like W and S.
The Controls screen lists every key above.

## The staff string (J)

Clips at 30 fps like every hero.
Each blow carries on within 0.35 s of the last.

| Blow | Frames | Hit on | Reach | Power | Knockback | Extra |
| --- | --- | --- | --- | --- | --- | --- |
| Tick | 9 | 4 | a straight jab 8 to 38 px, 10 px tall | 0.9x AD | 50 | stagger 0.3 s |
| Tock | 11 | 5 | an arc of radius 34 from level front to 100 degrees (over her head) | 1.0x AD | 70 up | lifts a minion (vy -120), catches fliers up to 34 px above |
| Toll | 16 | 7 | she plants the staff and the clock ring rings: a ring of radius 30 centred 18 px ahead | 1.3x AD | 120 outward | stun 0.3 s, hit-stop 0.05 s |
| Pendant Strike (air) | 10 | 4 | a downward arc ahead, radius 30 | 0.8x AD | 80 down | one per airtime |

The echo: every blow above (and only these) repeats 0.5 s after its hit frame, in the same world position and facing, with the same hit shape, at 0.5x the blow's power and half its knockback.
An echo hits each foe once.
An echo on a foe inside her Stillfield or under Stopped Clock hits at 1.0x.
Echoes count as her attacks (source `attacks`), build Flow and can crit.
The echo does not move with her, so a foe that walks into the spot gets hit; a foe knocked away misses it.
Base rate: about 2.4 AD/s on one foe with echoes, about the same as Orrin's 2.0 at his higher AD.

Echo look: at the hit frame a pale ghost of her pose in the new `PAL.hour` ramp stays at 50 percent alpha, with a 1 px clock tick ring at the strike point that closes over the 0.5 s like a clock hand sweeping.
On the echo hit the ghost flashes to the brightest step, swings once (2 frames) and breaks into sand motes.

Animation beats (to `docs/motion-standard.md`):
- Tick: 2 calm frames drawing the staff back at the hip, snap to full extension on frame 4, 3 frames of follow-through as the ring trails a teal smear, settle to guard.
- Tock: crouch with the staff low ahead, sweep up and over in one curve with a 3-frame arc smear, the staff rests on her shoulder for 2 frames.
- Toll: 4 calm frames lifting the staff two-handed, plant on frame 7 with a ring flash, sand dust at the staff foot, a 2 px shake, 4 frames of settle as the ring stops swinging.

## Hover (W held)

While airborne and once she is falling (vy at or above 0), holding W hangs her: gravity scale 0.12, fall speed capped at 18 px/s, air drift 60 px/s with A or D, for up to 1.5 s per airtime, at 18 stamina a second.
Releasing W, running out of stamina or the time ending drops her into a normal fall.
Pendant Strike during a hover does not end it.
Landing out of a hover calls `travelEnded()`.
Look: robe tails rise and drift, a slow hourglass of sand motes trickles down from her feet, the staff ring glows.
The kit drives this through `gravityScale`, `drivesMotion` and the kit's `walkSpeed` hook, which sets her drift.

## Stillfield (K)

- Press K: a circle of radius 44 opens centred 56 px ahead of her at chest height (y - 16), clamped inside the stage.
  W held: 48 px straight above her.
  S held: centred on her.
- Cost: 25 Sand on the press and 18 Sand a second while K is held.
  Sand does not refill while it stands.
- It stays while K is held, at least 0.6 s (a tap), at most 4 s, or until Sand runs out.
  One field per Mirel.
  1.2 s cooldown after it closes.
  With under 25 Sand the press is denied with the shared deny cue.
- Inside, foes move and act at a pace of 0.2 (minions and elites), 0.4 (mini bosses), 0.6 (the Rift Warden), multiplied into the time scale `updateStatus` returns.
  Foe shots inside move at 0.1.
- Her echoes on foes inside hit at 1.0x.
- When it closes, the snap: every foe inside takes 0.5x AP (source `abilities`) and is pushed 30 px out from the centre; minions stagger 0.3 s.
- The field stays where it was placed; she moves freely in and out.
  Her own time is never slowed.

Shared code: `src/game/timeFields.ts` has the same shape as `src/game/shotWards.ts`: `raiseField`, `lowerField`, `clearFields` on a new run, and `fieldPace(x, y, rank?)`, the slowest pace of any field covering the point and 1 elsewhere.
`updateEnemies` multiplies each foe's time scale by `fieldPace` at the foe's centre.
Each of the six foe shots that call `shotWarded` (prismShard, pollen, acorn, voidOrb, mudGlob, shadowOrb) multiplies its own `dt` by `fieldPace` at its position.
Future time effects reuse this module.

Look: a thin teal ring (PAL.hour step 3) with twelve 1 px tick marks and a faint inner fill at 15 percent, one second hand sweeping round the rim once per 2 s, sand motes hanging still inside.
Foes inside get a teal rim tint.
On open: a 2-frame flash and the ring grows from 0 over 4 frames.
On close: the ring snaps inward with a 1-frame white flash and sand bursts outward.

## Rewind (L)

- Her kit records her position, facing and HP every fixed step, keeping the last 2 s (host-only kit seat memory).
- L plays that path backwards over 0.25 s; she is untouchable and moved along it, gravity off.
- At the end she gets back 40 percent of the HP she lost in those 1.2 s (never above max).
- Cost 40 Sand, 0.8 s before the next.
  With under 40 Sand the press is denied.
- A blow or shot that would have reached her in the first 0.12 s counts as a perfect dodge (`rewardPerfectDodge()`, once per Rewind).
- It ends standing or falling where the path began; it calls `travelEnded()` and emits `dash` with `dir` the direction moved.
- Look: her sprite is drawn three times along the path in falling alpha with a teal tint, the staff ring spins backwards, sand motes stream back toward her.
  A short reversed whoosh plays (reuse an existing sfx at a lower pitch).

## Sand (SD bar)

Second bar under stamina, label SD, same HUD slot as MO, GR and QV, filled in a warm sand ramp with a teal edge (`src/ui/sandBar.ts`, called from `hud.ts`).
0 to 100, a run starts full.
Refills 12 a second, except while her Stillfield stands and for 0.6 s after any spend.
Each Toll that hits gives 3 Sand.
No skill or charm turns Sand into damage; skills may change its costs and refill.

## Abilities on I (MP), rotation on O

Stopped Clock: 22 MP, 7 s recharge.
- The nearest foe ahead within 110 px (any height within 60 px) stops dead: 2.0 s for a minion or elite, 0.8 s for a mini boss, 0.5 s for the Warden.
  On cast it takes 1.0x AP.
- A stopped foe has pace 0 (new foe field `stopped`, read in `updateStatus` beside `frozen`) and does not fall.
- Damage it takes while stopped is counted; when it restarts, 40 percent of that total lands again as one hit (source `abilities`) with a toll flash.
- Look: a clock face 20 px wide drawn over the foe, its hand ticking each 0.25 s, the foe in a grey-teal tint.
- With no foe in reach it fizzles with a puff of sand and costs half.

Second Hand: 14 MP, 2.5 s recharge.
- A thin clock hand flies straight ahead at 300 px/s for 150 px, pierces up to 3 foes for 1.1x AP each and chills each (shared `chill`) for 1.0 s.

Both emit `cast` with ability `stoppedClock` and `secondHand`.
The HUD ability tab and touch Ability button show the selected one and its recharge, as for Orrin.

## Special: Hour of Stillness (U)

Shared charge levels.
- 0.2 s anticipation: she raises the staff overhead, ring glowing.
- A clock face of the level's reach centred on her opens with a flash.
  Every foe inside stops for 1.2 s (same `stopped` status) and every foe shot inside freezes.
- Two hands sweep a full turn over the 1.2 s.
- The toll: each foe inside takes the level's full power plus 30 percent of the damage it took while stopped (the stored part capped at 2x the level's power).
  4 px shake, 0.08 s hit-stop, sand burst and dust.
The ultimate skill `m_noon` replaces it.

## The 20 skills

Ids prefixed `m_`.
Data in `src/constants/characters/mirel/skills/`, behaviours in `src/game/skills/mirel/`, icons (each skill and `_evo`) in `src/ui/skills/icons/mirel/`, level tables in `docs/skills/mirel.md`.
Budgets follow `docs/skill-design.md` exactly as Orrin's did.
Kinds: attack 5, movement 4, spell 3, dot 3, summon 3, passive 1, ultimate 1.

| Id | Name | Kind, risk, button | Level 1 | Properties added along the levels | Evolution (partner) |
| --- | --- | --- | --- | --- | --- |
| m_echo | Long Echo | attack, easy, J | echoes +30% | echo shape +6 px; a second echo at 1.0 s (0.3x); echo delay 0.35 s; Toll's echo stuns 0.3 s; echoes pull foes 8 px toward the strike point | Choir of Hours (m_patience): every blow echoes three times, the last at full power |
| m_toll | Great Toll | attack, timed, J third blow | Toll +25%, ring +6 px | Toll launches minions; 5 Sand per foe hit; Toll breaks guards; Toll also rings at her Stillfield's centre | Midnight (m_handsweep): Toll rings twelve times over 1.2 s at 0.4x, the twelfth at 3x |
| m_stillpoint | Still Point | attack, precise, J on a slowed or stopped foe | +40% on foes in a field or stopped | such hits crit; refund 3 Sand; mark +15% for 2 s; the hit's echo is instant; +80% | Frozen Instant (m_foretell): a hit on a stopped foe is stored twice for the restart |
| m_fallinghour | Falling Hour | attack, timed, J in the air | Pendant Strike becomes a dive, 1.1x AD in a 24 px ring | +40% from a hover; ring 34 px; the dive gives back the hover; launches minions; the dive echoes | Sky Clock (m_suspend): the dive opens a free Stillfield for 1.5 s where it lands |
| m_backswing | Backswing | attack, precise, J after a Rewind | a blow within 0.4 s after a Rewind ends +60%, its echo at once | crit; window 0.6 s; the blow heals 3% HP; +100%; stagger 1 s | Undone (m_longrewind): the first blow after a Rewind replays every blow she landed in the rewound 1.2 s on that foe at full power |
| m_suspend | Suspended | movement, easy, W hold | hover 2.0 s, 25% less stamina | drift 80 px/s; a second hover per airtime; foes under her are slowed; hover 3 s; no stamina cost while over a foe | Hanging Hour (m_sandstorm): at 50+ Sand the hover has no limit and drops grinding sand on foes below (0.4x AD a second) |
| m_longrewind | Long Rewind | movement, timed, L | looks back 1.6 s, heals 50% | costs 30 Sand; foes on the path take 0.6x AD; perfect-dodge window 0.2 s; leaves a free 24 px field for 1 s where it began; heals 65% | Second Chance (m_pastself): once per wave a fatal blow rewinds her 2 s and restores all HP lost in them |
| m_quicken | Quickened | movement, timed, after Rewind | her own move and attack speed +15% for 2 s | 3 s; +25%; Sand refills double while it lasts; echoes 0.2 s sooner; +35% | Overclock (m_echo): while Quickened every echo lands at once at full power |
| m_pace | Steady Pace | movement, easy, walk | inside her own Stillfield she walks 30% faster | foes inside deal 25% less contact damage; Sand refills at half rate while the field stands; +45%; the field follows her at 20 px/s; the field radius +10 | Calm Eye (m_patience): the field centres on her and moves with her |
| m_sundial | Sundial | spell, easy, I | 20 MP: a dial 70 px wide on the floor for 5 s, foes on it slowed 30% and hit for 0.4x AP every 0.5 s | 90 px; the gnomon shadow sweeps for 1.2x once a second; slow 45%; 8 s; two dials | Solar Court (m_patience): the dial follows her and covers 140 px |
| m_foretell | Foretell | spell, timed, I | 18 MP: marks the 3 nearest foes; 1.2 s later a teal blade falls on each where it stands, 2.0x AP | 5 foes; blades stun 0.5 s; 0.8 s delay; a 20 px ring hits others for 1.0x; 3.0x | Prophecy (m_stillpoint): marks every foe on screen, blades land twice on still foes |
| m_handsweep | Hour Hand | spell, timed, I | 26 MP: a giant clock hand sweeps a half circle of radius 70 ahead, 2.4x AP, knocking foes along the sweep | radius 84; sweeps back for 1.2x; stun 0.4 s; full circle; 3.5x | Clockwork (m_toll): two hands sweep full circles for 1.2 s |
| m_wither | Wither | dot, easy, J | hits add 1 Age stack (0.12x AD a second, 6 max, 3 s) | echoes add stacks; 10 max; aged foes slowed 10%; 0.25x; 5 s | Dust to Dust (m_echo): a foe at max stacks crumbles, consuming them for 1.5x AD each |
| m_sandstorm | Grinding Sand | dot, timed, K | foes inside her Stillfield gain 1 grind stack a second (0.2x AP a second) | stacks last 1 s after the field; ground foes take +10% from every source (mark); 0.4x; spreads on kill; 0.6x | Sandstorm (m_sundial): the closing field bursts in 80 px for 1.0x AP per stack |
| m_entropy | Entropy | dot, timed, restart | a foe restarting from a stop or a field snap decays: 0.25x AP a second for 3 s | 5 s; decaying foes take +15%; spreads on kill; 0.5x; the snap itself adds decay | Heat Death (m_foretell): a decaying foe that dies stops every foe in 50 px for 1 s |
| m_pastself | Past Self | summon, timed, on Rewind | 30%: a ghost stays where the Rewind began and replays her blows of the last 1.2 s at 0.8x | 45%; the ghost draws foes for 1 s; replays twice; 1.2x; 60% | Many Selves (m_quicken): every Rewind leaves a ghost and its blows echo |
| m_wren | Clockwork Wren | summon, easy, on a Toll hit | 15%, cooldown 2 s: a clockwork bird pecks the nearest foe 3 times for 0.4x AD | 25%; two wrens; pecks chill; wrens stay 6 s; 0.8x | Cuckoo Chorus (m_wither): every Toll sends four wrens whose pecks add Age |
| m_orrery | Orrery | summon, easy, on a cast | 25%: three gear planets orbit her at radius 28 for 5 s, 0.3x AP each 0.3 s | 40%; radius 36; four gears; 8 s; gears slow | Celestial Clock (m_handsweep): gears orbit always and spin out at foes on each cast |
| m_patience | Patience | passive, easy | Sand refills 25% faster | Sand max +30; Stillfield costs 20% less; Rewind 5 less; echoes on still foes +15%; refill +60% | Timeless (m_pastself): Sand keeps refilling while a Stillfield stands |
| m_noon | Eternal Noon | ultimate, timed, U | replaces Hour of Stillness: every foe on screen stops 1.6 s; stored damage returns at 40% plus 0.8x the level's power | 2.0 s; returns 60%; her echoes on stopped foes hit twice as hard; 2.6 s; the toll stuns 1 s | Endless Noon (m_patience): 3.5 s, stored damage returns in full, about 15 times the special |

Ultimate budget: level 8 about 6 times Hour of Stillness, evolved about 15 times.
Events her kit emits: `cast`, `jump`, `dash` (each Rewind), `perfectDodge`, and kit events declared in `src/types/mirel.ts`:
- `echo: { foe; blow }` when an echo strikes a foe;
- `field: { open; foes; x; y; radius }` when her Stillfield opens or closes;
- `rewind: { healed; from; to }` when a Rewind ends;
- `toll: { foes }` when a Toll lands (Clockwork Wren);
- `restart: { foe }` when a foe she stopped restarts, emitted by the shared stop status (Entropy).

## Look

Shared rig with her own skin in `src/constants/characters/mirel/look.ts`:
- deep brown skin; silver-white hair in a low bun held by two clock-hand pins;
- a long high-collared robe coat in slate plum with sand-gold trim, split at the sides, its tails drawn with the existing coat tails code;
- a small hourglass hanging at the belt that visibly empties as Sand falls (2 px of sand);
- dark leggings, soft wrapped boots;
- the staff: dark wood, 34 px, topped by a teal clock ring 7 px across with one hand inside (a new drawer under `src/game/hero/draw/`).
Every colour runs deep shadow to glint like the other skins.
New `PAL.hour`: `#0c1e24`, `#163e44`, `#24706c`, `#3fb0a0`, `#8ae6cf`, `#e6fff6`, and `SPARKS.hour`, for echoes, the field, Rewind and the SD bar edge; sand motes use a warm sand colour `#e8d6a0` with `#a8885a` shade.
Own clips in `src/constants/clips/mirel/`: idle (staff upright, ring swaying, robe breathing), every blow, the K cast pose (staff held forward, ring bright), hover, Rewind, both ability poses, the charge pose and both ultimates.
Walk, jump, fall, hurt and death use the shared clips through the motion layer with a 22 px stride.
Hover enters with 2 frames of crossfade from the fall pose.

## Achievements

- `heroTrial("mirel", "Mirel")`: clear wave 10 with her, 40 coins.
- Hold the Hour (group Skill, 60 coins): "As Mirel, defeat 5 foes inside one Stillfield." Counted from open to close, best-of-run stat `fieldKills` in `src/utils/trackedStats.ts`, listed in `docs/achievements.md`.

## Shop items (docs/meta-progress.md)

Vitality: HP. Honed Edge: string, echoes and attack skills scale with `progress.stats.ad`. Arcana: field snap, Stopped Clock, Second Hand, spells and the special scale with `progress.stats.ap`. Wellspring: abilities and the ultimate spend MP. Precision: every hit goes through `dealDamage`. Light Boots: walk, hover drift and Rewind playback speed scale with `progress.stats.move`. Endurance: the hover spends stamina.
Aftershock: each Rewind end and each landing out of a hover calls `travelEnded()`; add Mirel to the Aftershock line.
Lodestone, Head Start and Last Light work in shared code.

## Co-op

Sand, the field, the Rewind buffer, the hover timer and the selected ability live in kit seat memory (`rememberPerSeat(objectMemory(...))`).
Each Mirel holds her own field; fields slow foes for every hero.
A downed or departed Mirel's field closes at once without its snap.
Stopped Clock and Hour of Stillness stop foes for everyone.

## What stays unchanged

The other five heroes' kits, numbers and clips.
Shared foe behaviour outside fields and stops.
Saves: coins, shop levels, unlocked heroes and options load as before; the new hero simply appears locked.
The playtest folder is untouched.

## As built

The constants in `src/constants/mirel/` and the skill data in `src/constants/characters/mirel/skills/` are the source of truth; `docs/skills/mirel.md` lists every skill level from the data.
Changes made while building, each for the same goal as the design:

- Echoes, the Stillfield's look, Stopped Clock's clock face, the special's clock and the spells are game effects.
  The co-op host runs every effect with its owner swapped in, so each Mirel's echoes and field act as her own.
- Tick's jab is centred 12 px above her feet, not at shoulder height, so it reaches short ground foes.
- An echo keeps the blow's shape, half its power and half its knockback, but not its stun; Long Echo gives Toll's echo its stun.
  Only her own blows give MP on a hit, so echoes do not double her MP.
- Pressing K on the floor plays a 0.2 s cast pose with the staff held out; she is free after it while K stays held.
  Sand drains from the press while K is held, and the field stands its 0.6 s least even after a tap.
- The field's ring and fill, and the special's clock face, are hidden below the floor line, since the floor stands in front of them.
  `disc` in `src/engine/frame.ts` takes an optional floor for this.
- Every slow a skill names by a share (Wither, Sundial, Suspended, Orrery) uses the shared `chill` status, which halves a foe's pace, since foes have no slow of their own size.
- Steady Pace's softer contact applies to blows from a foe standing within the field's width.
- Stopped Clock's own hit lands before the stop, so only what comes after is stored for the restart.
  The restart deals its share of the stored damage through `dealDamage`, so Might and Flow apply to it as to any hit.
- Hour of Stillness reaches the level's ultimate reach round her chest, and the whole stage at level 4; its toll deals the level's power as a multiple of ability power, as Arcana scales her special.
  The foes it stops stay stopped a hair past the toll, so the toll always takes what they stored.
- Eternal Noon's fifth level makes her echoes on stopped foes hit twice as hard, since every echo on a stopped foe already hits at full.
- Patience evolves into Timeless with Past Self: Sand keeps refilling while a Stillfield stands.
  The skill contract gives every skill an evolution, the way Orrin's Perpetual Motion has one.
- Past Self's ghost strikes her whole string (Tick, Tock, Toll) where the Rewind began, once or twice with its level.
  Copying the exact blows of the rewound window would need a record of every blow's shape for no visible gain.
- Undone replays the damage of every blow she landed in the rewound window as one hit on the foe the Backswing lands on.
- Rewind can also be pressed out of the flinch after a hit, which is when it matters most.
  Her path starts fresh after each Rewind.
- Holding W while she falls off a ledge also hovers, the same as at the top of a jump.
- The kit interface has a new optional hook, `walkSpeed`, which sets her hover drift and her faster walk under Steady Pace and Quickened without fighting the shared mover.
- The skin has a new flag, `bun`: the hair is gathered in a low bun with two pins in the trim colours, with no ponytail and no scarf streamer, which fits her high collar.
- Buttons from the skill data: Quickened is on L because it follows a Rewind, Steady Pace on K because it acts in the field, and Entropy is `auto`.
  Spell cooldowns are Sundial 6 s, Foretell 6 s and Hour Hand 8 s; summon cooldowns are Past Self 1.5 s, Clockwork Wren 2 s and Orrery 2 s.
- Light Boots play Rewind's path back faster, as `progress.stats.move` scales it.
- In the shared walk, run, jump, fall and flinch clips she carries the staff upright, and a fall lays it flat.
  Those clips swing Kael's short sword low, and at that angle her 34 px staff would sink its ring into the floor.
- Up is also her jump, so a field aimed up from the floor lifts her first.
  Within a jump of the floor the field is measured from the floor she left, 48 px above it, so it lands where she aimed it.
- A foe stopped in time cannot raise its guard, so every blow on it lands and is stored.

## Balance check

Playtest bot runs on this build, one run each (runs are deterministic), from wave 1 with no shop upgrades.
The other five heroes fall on the same waves with the same kills as in the baseline runs on the base commit.

| Hero | Mash: death wave | Mash: kills | Skilled: death wave | Skilled: kills |
| --- | --- | --- | --- | --- |
| Kael | 4 | 11 | 5 | 15 |
| Ysra | 5 | 18 | 5 | 16 |
| Sable | 5 | 18 | 5 | 18 |
| Hulda | 4 | 11 | 8 | 34 |
| Orrin | 5 | 18 | 3 | 6 |
| Mirel | 5 | 16 | 5 | 14 |

Mirel falls on wave 5 with both bots, the same wave as most of the others.
Neither bot presses K, since her Stillfield has no HUD tab, so these runs leave out her field, its echoes at full power and its snap.
The skilled bot does press L toward a foe about to strike, which is her Rewind.

## Note for the owner

The playtest bots in `agent-studio/playtest/` have no Mirel entry, and the studio does not edit that folder.
A skilled policy for her would hold K over a crowd, string J inside the field, let go for the snap, and press L just after a hit.
