# Mirel, the hour keeper

Mirel is the sixth hero and the third one the studio built in the hero sprint (patch 0.6.0).
She is a time mage with a staff topped by a clock ring.
Every blow she lands repeats itself half a second later as an echo, she opens a Stillfield where foes and their shots crawl, and her parry stops the attacker in time and rewinds the HP she lost.
She plays on the moveset every hero shares (`docs/moveset-design.md`): her string on J, her warp on J held, her guard on K, the shared dodge on L, her abilities on I and her one ultimate on U.
She spends Sand, an hourglass that refills while she waits.

Id `mirel`, kit `mirel`, name Mirel, title "The hour keeper".
Blurb: "A keeper of the rift's broken clocks. She holds moments still, strikes once and again half a second later, and walks back out of a mistake before it lands. Fragile, patient, and never where the blow expected her."

## How she differs from every hero in the game

- Kael (warp swordsman): runs, double jumps and hangs from crystals.
  Mirel has no run and no double jump; she hovers at the top of her one jump.
  Her warp flings her staff like a pendulum, and its arrival echoes like her blows.
- Ysra (planted glaive, brace and parry, vault, Heat): parries to counter and builds Heat from blows.
  Mirel's guard is a time bubble that slows blows as they reach her, and her parry stops the attacker in time and gives back HP she lost.
  Her resource refills by waiting.
- Sable (ranged hunter, ammo and reload): fires bolts to 250 px.
  Mirel fights at staff length (38 px) and places her control 56 px ahead.
  Her one projectile ability is short and slow.
- Hulda (unarmed grappler, armour, grabs): walks into blows behind armour plates.
  Mirel has the lowest HP of the roster and no armour; she changes how fast foes act.
- Orrin (chain dancer, pendulum swing, Momentum): keeps speed through the air and wants constant motion.
  Mirel hangs nearly still in the air and is strongest standing beside a still crowd.

Axes that differ:
- Movement: a slow walk, one jump, a hover at the apex, the shared dodge and the warp.
- Defence: the Stillfield slows foes and their shots; the Stopped Moment undoes HP loss.
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
| J tapped | Staff string: Tick, Tock, Toll. In the air: Pendant Strike, one per airtime |
| J held | Warp: fling the staff, skip to the foe and strike; the blow echoes (10 MP) |
| K | Guard in a time bubble; pressed just as a blow lands, the Stopped Moment |
| L | The shared front dodge |
| I tapped | Selected ability: the Stillfield (Sand), Stopped Clock, Second Hand or a spell skill (MP) |
| I held | The Stillfield stays open while I is held; Stopped Clock stops every foe round her |
| O | Switch ability |
| U | Hour of Stillness (shared charge and MP rules) |

Touch buttons read Staff, Jump, Guard, Dodge, Ability, Switch and Special, icons in `src/ui/touch/icons/mirelArt.ts`.
Staff held warps, Ability held keeps the Stillfield open until the thumb lifts, Jump works on hold for the hover.
The stick pushed up or down while opening the Stillfield aims it like W and S.
The Controls screen lists every key above.

## The staff string (J)

Clips at 30 fps like every hero, at the fight's 0.8 pace, so a frame lasts 1/24 of a real second.
Each blow carries on within 0.35 s of the last, and a J pressed during Toll starts the next string as Toll ends.
Pressing J on the floor always plays Tick, Tock, Toll in that order, whatever foes stand around her, and she never turns by herself: she faces where the player last pointed.

| Blow | Frames | Hit on | Reach | Power | Knockback | Stagger | Hit-stop, shake, pitch |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tick | 12 | 5 | a straight jab 8 to 38 px, 10 px tall | 1.0x AD | 8 | 0.55 s | 0.05 s, 1 px, 1.2 |
| Tock | 10 | 5 | an arc of radius 34 from level front to 100 degrees (over her head) | 1.1x AD | 6, 30 up on fliers | 0.6 s | 0.07 s, 1.5 px, 1.0 |
| Toll | 18 | 7 | she plants the staff and the clock ring rings: a ring of radius 30 centred 18 px ahead | 1.45x AD | 15 and a knockdown (vy -110) | 0.7 s | 0.11 s, 2.6 px, 0.75 |
| Pendant Strike (air) | 12 | 5 | a downward arc ahead, radius 30 | 0.95x AD | 80 down | 0.45 s | 0.06 s, 1.3 px, 1.1 |

The string holds a lone walker from Tick to Toll.
Tick and Tock push it about a pixel and stagger it past the next blow's hit frame, so it never starts a wind-up inside the string and cannot raise a guard.
Toll knocks it down a few pixels away; it lies on the floor until after the next Tick lands.
On screen the hit frames land 0.55 s (Tick to Tock) and 0.6 s (Tock to Toll) apart, and Toll's hit is 0.8 s before the next string's Tick, each with its hit-stop.
A foe stopped in time cannot stagger, so a blow on it holds its stagger and the foe takes it the moment it restarts.

The echo: every blow above (and only these) repeats 0.5 s after its hit frame, in the same world position and facing, with the same hit shape, at 0.5x the blow's power and half its knockback.
An echo hits each foe once.
It never staggers or throws a foe up, so a string with its echoes counts three staggers toward a foe's brace.
Its hit-stop is 0.02 s, its shake 1.2 px and its pitch 1.35, lighter than any blow.
An echo on a foe inside her Stillfield or under Stopped Clock hits at 1.0x.
Echoes count as her attacks (source `attacks`), build Flow and can crit.
The echo does not move with her, so a foe that walks into the spot gets hit; a foe knocked away misses it.
Base rate: 3.55x AD a string of 40 frames, the same damage a game second as the old 36-frame string of 3.2x AD.

Echo look: at the hit frame a pale ghost of her pose in the new `PAL.hour` ramp stays at 50 percent alpha, with a 1 px clock tick ring at the strike point that closes over the 0.5 s like a clock hand sweeping.
On the echo hit the ghost flashes to the brightest step, swings once (2 frames) and breaks into sand motes.

Animation beats (to `docs/motion-standard.md`), keyed every two frames with a snap only on the hit frame:
- Her feet set for the string as Tick's wind-up steps the front foot out, and stay planted until Toll's recovery steps it home.
- Tick: the hips sink and lean back as the staff draws back level at the hip, held three frames; the snap throws her body flat along a level jab with the back heel lifting off the push; she holds it two frames with a pixel of overshoot, then draws the staff up to a forward guard.
- Tock: the knees drop and the staff swings low ahead with its ring near the floor, held three frames; the snap stands her up on her toes with her back arched and the staff thrown up over her head; it carries on over and comes to rest on her shoulder, where Toll starts.
- Toll: she rises onto her back foot with the staff high in both hands and the front knee drawn up, held four frames; the snap stamps the foot a step on and drives the staff's foot into the floor ahead, her body dropped low over it and the back leg stretched; she holds the plant through the ring, draws the staff up out of the floor and steps back into the stance.
- Pendant Strike: knees tucked and the staff raised behind her head, held three frames; the snap curls her forward over a downward arc with her legs kicked back; she uncurls with the staff carried level.

## Hover (W held)

While airborne and once she is falling (vy at or above 0), holding W hangs her: gravity scale 0.12, fall speed capped at 18 px/s, air drift 60 px/s with A or D, for up to 1.5 s per airtime, at 18 stamina a second.
Releasing W, running out of stamina or the time ending drops her into a normal fall.
Pendant Strike during a hover does not end it.
Landing out of a hover calls `travelEnded()`.
Look: robe tails rise and drift, a slow hourglass of sand motes trickles down from her feet, the staff ring glows.
The kit drives this through `gravityScale`, `drivesMotion` and the kit's `walkSpeed` hook, which sets her drift.

## Stillfield (I)

The Stillfield is the first of her abilities on I, paid in Sand.

- Press I: a circle of radius 44 opens centred 56 px ahead of her at chest height (y - 16), clamped inside the stage.
  W held: 48 px straight above her.
  S held: centred on her.
- Tapped, it stands 1.5 s for 25 Sand.
  Held (the long press of I), it costs 25 Sand and 18 Sand a second while I stays held, and stands at least 0.6 s and at most 4 s, or until Sand runs out.
  Sand does not refill while it stands.
- One field per Mirel, and 1.2 s before the next once it closes; meanwhile I casts her next ready ability.
  With under 25 Sand its tab is struck through, and a press that finds nothing ready flashes the SD bar.
- It opens from almost anything she is doing, mid-string and mid-air included; only standing does she stop for a 0.2 s cast pose.
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

## Guard and the Stopped Moment (K)

Her guard is the shared one (`src/game/hero/heroGuard.ts`) with her own numbers and reward (`src/game/hero/mirel/guardStyle.ts`, `src/constants/mirel/guard.ts`).

- Held, she stands the staff upright before her in both hands inside a time bubble of radius 22 round her chest.
  Foes inside the bubble act at 0.75 (minions and elites), 0.85 (mini bosses) and 0.9 (the Warden), and foe shots inside fly at 0.35, so blows slow as they reach her.
  The bubble's ring is white while a parry would still land.
- A block lets 35 percent of the blow through and costs 18 stamina; sand spills off the bubble where it struck.
- The parry is the Stopped Moment.
  The attacker stops in time: 1.6 s for a minion or elite, 0.8 s for a mini boss, 0.5 s for the Warden, under a clock face, and 40 percent of what it takes while stopped lands again when it restarts.
  The HP she lost in the last 2 s rewinds: she gets half of it back.
  A clock face snaps open on her and its hand winds back a full turn while sand flies back into her.
- A Stopped Moment is a rewind: it opens Backswing's window, starts Quickened, may leave Past Self's ghost and emits the `rewind` event.

Her path (position, facing and HP every fixed step, the last 3 s, host-only kit seat memory) gives the HP the parry looks back over.
Second Chance (Long Rewind evolved) plays the last 2 s of that path backwards over 0.25 s when a blow would fell her, once a wave: she is untouchable and moved along it, gravity off, leaving afterimages, and gets back all she lost in it.

## Sand (SD bar)

Second bar under stamina, label SD, same HUD slot as MO, GR and QV, filled in a warm sand ramp with a teal edge (`src/ui/sandBar.ts`, called from `hud.ts`).
0 to 100, a run starts full.
Refills 12 a second, except while her Stillfield stands and for 0.6 s after any spend.
Each Toll that hits gives 3 Sand.
No skill or charm turns Sand into damage; skills may change its costs and refill.

## Abilities on I, rotation on O

Her abilities are `AbilitySlot`s on the shared bar (`src/game/hero/mirel/abilities.ts`), in this order: the Stillfield (Sand), Stopped Clock, Second Hand, then Sundial, Foretell and Hour Hand once held.
Each has its own recharge, and a cast adds no wait to any other.
They cast from a free state, a hover, a blow's recovery once it struck, or a cast that has gone off.


Stopped Clock: 22 MP, 7 s recharge.
- The nearest foe ahead within 110 px (any height within 60 px) stops dead: 2.0 s for a minion or elite, 0.8 s for a mini boss, 0.5 s for the Warden.
  On cast it takes 1.0x AP.
- A stopped foe has pace 0 (new foe field `stopped`, read in `updateStatus` beside `frozen`) and does not fall.
- Damage it takes while stopped is counted; when it restarts, 40 percent of that total lands again as one hit (source `abilities`) with a toll flash.
- Look: a clock face 20 px wide drawn over the foe, its hand ticking each 0.25 s, the foe in a grey-teal tint.
- With no foe in reach it fizzles with a puff of sand and costs half.
- Held (the wide form): every foe within 70 px round her stops for 60 percent as long, for 1.5 times the MP.

Second Hand: 14 MP, 2.5 s recharge.
- A thin clock hand flies straight ahead at 300 px/s for 150 px, pierces up to 3 foes for 1.1x AP each and chills each (shared `chill`) for 1.0 s.

The three emit `cast` with ability `stillfield`, `stoppedClock` and `secondHand`.
The shared HUD ability tabs and the touch Ability button show the selected one and its recharge; the Stillfield's tab shows its Sand cost.

## Warp (J held)

The shared warp (`src/game/hero/warp.ts`) with her style (`src/game/hero/mirel/warpStyle.ts`).

- She draws the staff back over her shoulder and flings it level.
  It flies ring first, its shaft swinging behind like a pendulum, the ring's hand spinning.
- Time skips and she is there with the staff already falling, and sweeps it down through the foe: the shared arrival blow, at ability power (`stat: "ap"`).
- Her extra: the blow echoes.
  Her ghost stays where she struck and sweeps the same arc again half a second later, at a fifth of the blow's power, or two fifths on a foe in a field or stopped.
  Long Echo, Quickened and Patience shape that echo as they shape her string's.
- Quickened at its seventh level halves the warp's recharge while it lasts.

## Special: Hour of Stillness (U)

Shared charge levels.
- 0.2 s anticipation: she raises the staff overhead, ring glowing.
- A clock face of the level's reach centred on her opens with a flash.
  Every foe inside stops for 1.2 s (same `stopped` status) and every foe shot inside freezes.
- Two hands sweep a full turn over the 1.2 s.
- The toll: each foe inside takes the level's full power plus 30 percent of the damage it took while stopped (the stored part capped at 2x the level's power).
  4 px shake, 0.08 s hit-stop, sand burst and dust.

She keeps it for the whole run.
Her one ultimate skill, Hour of Stillness (`m_hour`), upgrades it level by level, read through `ultimateValues()` (`docs/skills/mirel.md`): longer stops, a harder toll, the whole screen at every charge level, echoes twice as hard on stopped foes, a stun, more of the stored damage and a Stillfield left behind.
Evolved, Eternal Noon stops foes 3.5 s and returns all they stored with no cap.

## The 20 skills

Ids prefixed `m_`.
Data in `src/constants/characters/mirel/skills/`, behaviours in `src/game/skills/mirel/`, icons (each skill and `_evo`) in `src/ui/skills/icons/mirel/`, level tables in `docs/skills/mirel.md`.
Budgets follow `docs/skill-design.md` exactly as Orrin's did.
Kinds: attack 5, movement 3, spell 3, dot 3, summon 3, passive 2, ultimate 1.

| Id | Name | Kind, risk, button | Level 1 | Properties added along the levels | Evolution (partner) |
| --- | --- | --- | --- | --- | --- |
| m_echo | Long Echo | attack, easy, J | echoes +30% | echo shape +6 px; a second echo at 1.0 s (0.3x); echo delay 0.35 s; Toll's echo stuns 0.3 s; echoes pull foes 8 px toward the strike point | Choir of Hours (m_patience): every blow echoes three times, the last at full power |
| m_toll | Great Toll | attack, timed, J third blow | Toll +25%, ring +6 px | Toll throws minions high; 5 Sand per foe hit; Toll breaks guards; Toll also rings at her Stillfield's centre | Midnight (m_handsweep): Toll rings twelve times over 1.2 s at 0.4x, the twelfth at 3x |
| m_stillpoint | Still Point | attack, precise, J on a slowed or stopped foe | +40% on foes in a field or stopped | such hits crit; refund 3 Sand; mark +15% for 2 s; the hit's echo is instant; +80% | Frozen Instant (m_foretell): a hit on a stopped foe is stored twice for the restart |
| m_fallinghour | Falling Hour | attack, timed, J in the air | Pendant Strike becomes a dive, 1.1x AD in a 24 px ring | +40% from a hover; ring 34 px; the dive gives back the hover; launches minions; the dive echoes | Sky Clock (m_suspend): the dive opens a free Stillfield for 1.5 s where it lands |
| m_backswing | Backswing | attack, precise, J after a Stopped Moment | a blow within 0.6 s after a Stopped Moment +60% | crit; window 0.8 s; the blow heals 3% HP; +100%; stagger 1 s | Undone (m_longrewind): the first blow after a Stopped Moment replays every blow she landed in the time it looked back over on that foe at full power |
| m_suspend | Suspended | movement, easy, W hold | hover 2.0 s, 25% less stamina | drift 80 px/s; a second hover per airtime; foes under her are slowed; hover 3 s; no stamina cost while over a foe | Hanging Hour (m_sandstorm): at 50+ Sand the hover has no limit and drops grinding sand on foes below (0.4x AD a second) |
| m_longrewind | Long Rewind | passive, precise, K | the Stopped Moment looks back 2.5 s and gives back 65% | foes stopped 50% longer; foes within 30 px of the attacker stop too; 60% of stored damage returns; a free 30 px field opens on the attacker; looks back 3 s, gives back 80% | Second Chance (m_pastself): once per wave a fatal blow rewinds her 2 s along her path and restores all HP lost in them |
| m_quicken | Quickened | movement, precise, K | after a Stopped Moment her own move and attack speed +15% for 3 s | 4 s; +25%; Sand refills double while it lasts; echoes 0.2 s sooner; +35%; the warp recharges twice as fast | Overclock (m_echo): while Quickened every echo lands at once at full power |
| m_pace | Steady Pace | movement, easy, I | inside her own Stillfield she walks 30% faster | foes inside deal 25% less contact damage; Sand refills at half rate while the field stands; +45%; the field follows her at 20 px/s; the field radius +10 | Calm Eye (m_patience): the field centres on her and moves with her |
| m_sundial | Sundial | spell, easy, I | 20 MP: a dial 70 px wide on the floor for 5 s, foes on it slowed 30% and hit for 0.4x AP every 0.5 s | 90 px; the gnomon shadow sweeps for 1.2x once a second; slow 45%; 8 s; two dials | Solar Court (m_patience): the dial follows her and covers 140 px |
| m_foretell | Foretell | spell, timed, I | 18 MP: marks the 3 nearest foes; 1.2 s later a teal blade falls on each where it stands, 2.0x AP | 5 foes; blades stun 0.5 s; 0.8 s delay; a 20 px ring hits others for 1.0x; 3.0x | Prophecy (m_stillpoint): marks every foe on screen, blades land twice on still foes |
| m_handsweep | Hour Hand | spell, timed, I | 26 MP: a giant clock hand sweeps a half circle of radius 70 ahead, 2.4x AP, knocking foes along the sweep | radius 84; sweeps back for 1.2x; stun 0.4 s; full circle; 3.5x | Clockwork (m_toll): two hands sweep full circles for 1.2 s |
| m_wither | Wither | dot, easy, J | hits add 1 Age stack (0.12x AD a second, 6 max, 3 s) | echoes add stacks; 10 max; aged foes slowed 10%; 0.25x; 5 s | Dust to Dust (m_echo): a foe at max stacks crumbles, consuming them for 1.5x AD each |
| m_sandstorm | Grinding Sand | dot, timed, I | foes inside her Stillfield gain 1 grind stack a second (0.2x AP a second) | stacks last 1 s after the field; ground foes take +10% from every source (mark); 0.4x; spreads on kill; 0.6x | Sandstorm (m_sundial): the closing field bursts in 80 px for 1.0x AP per stack |
| m_entropy | Entropy | dot, timed, restart | a foe restarting from a stop or a field snap decays: 0.25x AP a second for 3 s | 5 s; decaying foes take +15%; spreads on kill; 0.5x; the snap itself adds decay | Heat Death (m_foretell): a decaying foe that dies stops every foe in 50 px for 1 s |
| m_pastself | Past Self | summon, precise, K | 50%: a ghost stays where she parried and strikes her string at 0.8x | 70%; the ghost draws foes for 1 s; 1.2x; strikes twice; every parry | Many Selves (m_quicken): every Stopped Moment leaves a ghost and its blows echo |
| m_wren | Clockwork Wren | summon, easy, on a Toll hit | 15%, cooldown 2 s: a clockwork bird pecks the nearest foe 3 times for 0.4x AD | 25%; two wrens; pecks chill; wrens stay 6 s; 0.8x | Cuckoo Chorus (m_wither): every Toll sends four wrens whose pecks add Age |
| m_orrery | Orrery | summon, easy, on a cast | 25%: three gear planets orbit her at radius 28 for 5 s, 0.3x AP each 0.3 s | 40%; radius 36; four gears; 8 s; gears slow | Celestial Clock (m_handsweep): gears orbit always and spin out at foes on each cast |
| m_patience | Patience | passive, easy | Sand refills 25% faster | Sand max +30; Stillfield costs 20% less; a Stopped Moment gives 15 Sand; echoes on still foes +15%; refill +60% | Timeless (m_pastself): Sand keeps refilling while a Stillfield stands |
| m_hour | Hour of Stillness | ultimate, timed, U | upgrades her special: foes stop 1.6 s, the toll 1.2x and 40% of stored damage | the whole screen at every level; echoes on stopped foes twice as hard; 2x; the toll stuns 1 s; 60% stored up to 4x; a Stillfield left behind; 2.4 s and 3.5x | Eternal Noon (m_patience): 3.5 s, 6x, stored damage returns in full with no cap, about 15 times the special |

Ultimate budget: level 8 about 6 times Hour of Stillness, evolved about 15 times.
Events her kit emits: `cast`, `jump`, and kit events declared in `src/types/mirel.ts`; the shared code emits `warp` and `parry` for her:
- `echo: { foe; blow }` when an echo of a blow or of the warp's arrival strikes a foe;
- `field: { open; foes; x; y; radius }` when her Stillfield opens or closes;
- `rewind: { healed; from; to }` on a Stopped Moment, and when Second Chance's rewind ends;
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
New `PAL.hour`: `#0c1e24`, `#163e44`, `#24706c`, `#3fb0a0`, `#8ae6cf`, `#e6fff6`, and `SPARKS.hour`, for echoes, the field, the Stopped Moment and the SD bar edge; sand motes use a warm sand colour `#e8d6a0` with `#a8885a` shade.
Own clips in `src/constants/clips/mirel/`: idle (staff upright, ring swaying, robe breathing), every blow, the Stillfield cast pose (staff held forward, ring bright), hover, Second Chance's rewind, both ability poses, the charge pose and the special.
For the shared moves (`moveset.ts`): the throw (staff drawn back over the shoulder, then flung level), the arrival (staff high, then swept down through the foe in both hands) and the guard in the shared segments (staff upright before her in both hands; driven back onto the rear foot for a block; staff thrust out with the ring held up to the attacker for the parry).
The dodge uses the shared clip with the staff carried upright.
Walk, jump, fall, hurt and death use the shared clips through the motion layer with a 22 px stride.
Her own settle clips (`src/constants/clips/mirel/settle.ts`) give the jump a two-frame push-off on the floor before she leaves it, and the landing her own bent-knee recovery with the staff upright.
A jump out of a blow's recovery or a cast leaves at once.
Hover enters with 2 frames of crossfade from the fall pose.

## Achievements

- `heroTrial("mirel", "Mirel")`: clear wave 10 with her, 40 coins.
- Hold the Hour (group Skill, 60 coins): "As Mirel, defeat 5 foes inside one Stillfield." Counted from open to close, best-of-run stat `fieldKills` in `src/utils/trackedStats.ts`, listed in `docs/achievements.md`.

## Shop items (docs/meta-progress.md)

Vitality: HP. Honed Edge: string, echoes and attack skills scale with `progress.stats.ad`. Arcana: field snap, Stopped Clock, Second Hand, spells and the special scale with `progress.stats.ap`. Wellspring: abilities and the ultimate spend MP. Precision: every hit goes through `dealDamage`. Light Boots: walk, hover drift and Second Chance's playback speed scale with `progress.stats.move`. Endurance: the hover spends stamina.
Aftershock: the end of Second Chance's rewind and each landing out of a hover call `travelEnded()`.
Lodestone, Head Start and Last Light work in shared code.

## Co-op

Sand, the field, her path, the hover timer and the guard bubble live in kit seat memory (`rememberPerSeat(objectMemory(...))`); the selected ability is the shared bar's.
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
- An echo keeps the blow's shape, half its power and half its knockback, but not its stagger or its knockdown; Long Echo gives Toll's echo a stun.
  Only her own blows give MP on a hit, so echoes do not double her MP.
- Opening the Stillfield on the floor plays a 0.2 s cast pose with the staff held out; she is free after it while I stays held.
  Sand drains from the press while I is held.
- The field's ring and fill, and the special's clock face, are hidden below the floor line, since the floor stands in front of them.
  `disc` in `src/engine/frame.ts` takes an optional floor for this.
- Every slow a skill names by a share (Wither, Sundial, Suspended, Orrery) uses the shared `chill` status, which halves a foe's pace, since foes have no slow of their own size.
- Steady Pace's softer contact applies to blows from a foe standing within the field's width.
- Stopped Clock aims at the nearest foe ahead level with her (centre within 20 px of her chest) first, and only with none takes the nearest ahead at any height within 60 px.
  A flier above her no longer takes the stop meant for the ground foe she faces.
- Stopped Clock's own hit lands before the stop, so only what comes after is stored for the restart.
  The restart deals its share of the stored damage through `dealDamage`, so Might and Flow apply to it as to any hit.
- Hour of Stillness reaches the level's ultimate reach round her chest, and the whole stage at level 4; its toll deals the level's power as a multiple of ability power, as Arcana scales her special.
  The foes it stops stay stopped a hair past the toll, so the toll always takes what they stored.
- Hour of Stillness's third level makes her echoes on stopped foes hit twice as hard, since every echo on a stopped foe already hits at full.
- Patience evolves into Timeless with Past Self: Sand keeps refilling while a Stillfield stands.
  The skill contract gives every skill an evolution, the way Orrin's Perpetual Motion has one.
- Past Self's ghost strikes her whole string (Tick, Tock, Toll) where she parried, once or twice with its level.
  Copying the exact blows of the rewound window would need a record of every blow's shape for no visible gain.
- Undone replays the damage of every blow she landed in the rewound window as one hit on the foe the Backswing lands on.
- Holding W while she falls off a ledge also hovers, the same as at the top of a jump.
- The kit interface has a new optional hook, `walkSpeed`, which sets her hover drift and her faster walk under Steady Pace and Quickened without fighting the shared mover.
- The skin has a new flag, `bun`: the hair is gathered in a low bun with two pins in the trim colours, with no ponytail and no scarf streamer, which fits her high collar.
- Buttons from the skill data: Long Rewind, Quickened and Past Self are on K because they follow a Stopped Moment, Steady Pace and Grinding Sand on I because they act in the Stillfield, and Entropy is `auto`.
  Spell cooldowns are Sundial 6 s, Foretell 6 s and Hour Hand 8 s; summon cooldowns are Past Self 1.5 s, Clockwork Wren 2 s and Orrery 2 s.
- Light Boots play Second Chance's path back faster, as `progress.stats.move` scales it.
- In the shared walk, run, jump, fall and flinch clips she carries the staff upright, and a fall lays it flat.
  Those clips swing Kael's short sword low, and at that angle her 34 px staff would sink its ring into the floor.
- Up is also her jump, so a field aimed up from the floor lifts her first.
  Within a jump of the floor the field is measured from the floor she left, 48 px above it, so it lands where she aimed it.
- A foe stopped in time cannot raise its guard, so every blow on it lands and is stored.
- The menus show the chosen hero before any frame of play poses them, so choosing a hero now stands them in the first frame of their own idle (`restPose` in `src/utils/restPose.ts`, shared with the hero screen portrait).
  The shared standing pose held her staff head-down with its ring in the floor behind the title screen.

## Balance check

Playtest bot runs, one run each (runs are deterministic), with no shop upgrades.
"Before" is the shared moveset core (`SainyTK/unified-moveset`), where her kit still had the provisional warp and guard and no abilities on the shared bar; "after" is this build.

| Start | Bot | Before: death wave, kills | After: death wave, kills |
| --- | --- | --- | --- |
| Wave 1 | mash | 5, 18 | 5, 18 |
| Wave 1 | skilled | 5, 18 | 4, 11 |
| Wave 3, level 6 | skilled | 5, 12 | 5, 8 |
| Wave 6, level 12 | skilled | 9, 22 | 10, 31 |

The runs end on single waves where she loses most of her HP at once, so one run moves a wave either way on small changes.
Neither bot guards, so these runs leave out the Stopped Moment and everything that follows it (Backswing, Quickened, Past Self, Long Rewind).
The skilled bot now casts her abilities, the Stillfield first, which the core build gave it none of.

## Note for the owner

A skilled policy for her would parry with K just before a blow lands, swing J at once for Backswing, open the Stillfield over a crowd and string J inside it.
