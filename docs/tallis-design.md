# Tallis, the gloam knife

The eighth hero and the fifth built in the hero sprint (patch 0.8.0).
Id `tallis`, kit `tallis`, name Tallis (he/him), title "The gloam knife".
Blurb: "He learned his trade in the hour between day and night, when nobody looks twice. Two short knives, no armour, no patience for a fair fight. Every foe has a back."
Price: 1350 coins in `src/constants/heroUnlocks.ts`, the sixth price by the rule written there.
Accent `#f08ad0` (dusk rose), which no other hero uses: Hulda's `#ff5f6d` is coral red and Wenna's `#b48cff` is violet.

Code layout follows Wenna and Mirel: kit `src/game/hero/tallis/`, character `src/constants/characters/tallis/` (index, look, skills), numbers `src/constants/tallis/`, clips `src/constants/clips/tallis/`, types and kit events `src/types/tallis.ts`, skill behaviours `src/game/skills/tallis/`, icons `src/ui/skills/icons/tallis/`, touch icons `src/ui/touch/icons/tallisArt.ts`, the GL bar `src/ui/gloamBar.ts`, his ability tabs `src/ui/tallisTabs.ts`, his knives `src/game/hero/draw/knives.ts`, and his skill tables `docs/skills/tallis.md`.

## How he differs from every hero in the game

- Kael (warp swordsman) dashes untouchable through foes in 0.24 s, double jumps and teleports to a thrown sword. His back attacks are one skill option (Phase Cut). Tallis has no dash, no double jump and no teleport in his base kit. He travels slowly and steerably under foes as a shadow pool, and his whole kit is built on where foes are facing.
- Ysra (planted glaive, brace and parry, vault, Heat) meets blows from the front with a long weapon and vaults over foes. Tallis has the shortest reach in the roster (about 22 px), cannot block or parry, and gets behind foes by going under them.
- Sable (ranged hunter, ammo and reload, hop and slide) fights from 250 px and slides under blows for a moment. Tallis fights at knife range, and his only escape is the pool, which also hides him.
- Hulda (unarmed grappler, armour, grabs) walks into blows behind armour. Tallis has 90 HP against her 120 and no armour; his defence is staying out of sight.
- Orrin (chain dancer, pendulum swing, Momentum) wants constant speed through the air. Tallis wants to be still and unseen, then strike once from behind.
- Mirel (time mage, Stillfield, echoes, Sand refilled by waiting) controls how fast foes act. Tallis controls what foes notice.
- Wenna (summoner, Wicks, Wax from kills) fights through bodies spread across the stage. Tallis fights alone, up close, and his resource comes from his position.

The axes:

- Movement: walk and run with one jump, plus Sink, a held shadow-pool glide along the floor that passes under ground foes.
- Defence: the Veil and the pool make foes lose him. No block, parry, armour or dodge frames outside the pool.
- Resource: Gloam (GL), refilled while no foe is facing him and by blows from behind, spent to hold the Veil.
- Range: 22 px knives.
- Attack shape: positional. His string changes when he stands behind a foe, and blows from behind deal 2.25 times as much.

## The shared foe awareness rule

Foes already face a side, turn toward the hero only after `TURN_DELAY` (0.45 s for minions), and start a wind-up only while `facesHero(e)` is true (`src/game/enemies/facing.ts`).
The patch adds one seam on top of that, `src/game/enemies/awareness.ts`, for anything that hides a hero or blinds foes.

- `heroHidden()` reads an optional kit hook, `hidden()` in `src/types/kit.ts`; a kit that leaves it out is always seen.
- A foe has a new field `blind` (seconds), 0 when made, counted down in the shared status step. Smoke Knot sets it.
- `foeSees(e)` is false while `e.blind > 0`, and for a minion (elites included) while the hero is hidden.
- `turnToHero(e, dt)`: a foe that cannot see the hero keeps its facing and its turn timer stays at 0. A mini boss facing away from a hidden hero turns with twice its `TURN_DELAY`.
- `facesHero(e)` is false while the foe cannot see the hero, so no new wind-up starts at him. A wind-up already started goes on, and shots already in flight still hit.
- The fliers that start their attack without `facesHero` (Glimmer Moths, Prism Sprites, Abyss Eyes) check `foeSees(e)` before they start one.
- A foe that cannot see the hero walks on past him: husks, thornbacks, golems and stalkers no longer stop within a few pixels of a hero they cannot see, and Mire Toads do not hop toward him.
- `unseenTouch(fromX)`: a foe walking on unaware does no harm by touch, so a hidden hero can stand in a husk's path and let it walk by.
- A foe that cannot see the hero raises no guard against him (`guards` in `src/game/damage.ts`), so his blows from the Veil land from the front too.
- A walker that cannot see the hero turns back when it meets another walker coming the other way or reaches the edge of the stage, so two foes that lost him never march on the spot against each other.
- The Rift Warden is a boss, so it always sees him and keeps attacking a veiled Tallis.
- The lost cue: when he becomes hidden, every minion within 160 px that was facing him shows a grey question mark (5 px, with a 1 px dark outline) over its head for 0.6 s, drawn through the kit's `drawOver`.
- Co-op: `nearest` in `src/game/coop/hostRun.ts` skips a seat whose hero is hidden while any standing seat is visible, so foes go for the visible hero. When every standing hero is hidden it picks as before.
- With no hidden hero and no blind foe every function returns what it did before, so the other seven heroes play the same; the mash bot runs below match the baseline waves and kills.

## Stats

`base: { ad: 11, ap: 8, hp: 90, mp: 80, stamina: 100, crit: 0.10, move: 1.08, aspd: 1.1, haste: 1 }`, growth `{ hp: 0.9, mp: 0.35 }` like Sable's, `comboHits: 3`, `special: "gloaming"`.
The plan set HP 80, the lowest in the roster; after QA it went to 90 by the plan's own first fallback step (see the bot check), which leaves Sable (85) and Mirel (88) below him and every front-line hero well above (Kael 100, Hulda 120, Ysra 130). Crit 0.10 is the highest.

## Controls

| Key | Tallis |
| --- | --- |
| A / D | Walk; a double tap runs. Steer the pool during Sink |
| W | One jump of 58 px. No double jump |
| S | With W, drop through a ledge |
| J | Knife string; it changes behind a foe's back. Under a hovering flier, a springing Rising Cut. In the air, Drop Stab, once per airtime. Out of the pool, Rising Cut |
| K | Veil on and off (Gloam) |
| L | Hold: Sink into a shadow pool and glide; let go to rise. In the air: drop straight down and sink on landing while L is held |
| I | Selected ability: Smoke Knot, Hamstring, or a spell skill (MP) |
| O | Switch ability |
| U | Special: Gloaming (shared charge and MP rules) |

Touch buttons read Knife, Jump, Veil, Sink, Ability, Switch and Special, with icons in `tallisArt.ts`.
Sink acts while the button is held, like Ysra's brace.
The Controls screen lists every key above, and on touch screens the stick and the buttons.

## Gloam (GL bar)

A second bar under stamina, label GL, in the same HUD slot as WX, SD, MO and GR, filled in ink.
Its rose edge glows while he is Unseen, so the player can read when it refills, and the whole fill turns rose while the Veil drains it.

- 0 to 100, and a run starts at 50.
- Unseen: while he is out of the Veil and no minion or mini boss within 140 px faces him (real facing, `Math.sign(hero.x - e.x) === e.face`), Gloam refills 5 a second. With no foe on the stage it also refills. Standing in his own Smoke Knot counts as Unseen.
- Each knife blow from behind gives 6. A foe felled by a blow from behind gives 12 more.
- No passive trickle while a foe faces him, so standing in front of a crowd starves the bar.

## K: Veil

- K costs 20 Gloam to raise and drains 8 a second. With under 20 the press is refused: the GL bar blinks and the shared deny tick plays.
- It ends on K again, at 0 Gloam, when a blow lands on him, or 0.2 s after his first blow from the Veil. After it ends, K waits 1.0 s; a press in that wait gets the same deny cue.
- It works on the floor and in the air, with no cast time: the knees and shoulders dip over 3 frames as the hood comes down, with a puff of ink.
- While veiled: `hidden()` is true, his sprite draws at 0.35 alpha inside a 1 px rose outline that shimmers (the new kit hook `heroRing`), thin ink wisps rise from his shoulders, and his walk is 15% faster.
- Ambush: his first knife blow out of the Veil, or the first within 0.5 s after rising from Sink behind a foe, is a sure crit, shown in the crit style. It emits kit event `ambush`.
- The Veil emits kit event `veil` with `on` and `cause` (`press`, `empty`, `hurt`, `strike`, `free` or `leap`).

## L: Sink

- Hold L on the floor or a platform: 20 stamina to start and 40 a second while held, for at most 1.0 s. A tap still sinks for 0.15 s.
- He pours into a flat ink pool 18 px wide on the surface he stands on and glides at 115 px/s scaled by move speed, steered with A and D, and can stop. The pool stops at the edge of its platform.
- He is untouchable and hidden while sunk. Ground foes and their blows pass over the pool.
- Release, empty stamina or the time limit makes him rise over 0.15 s, during which he can be hit. Then 0.7 s before the next Sink.
- Rising Cut: J pressed while sunk or within 0.12 s of the rise becomes an upward slash, 1.0x AD, knockback 40, launch 150, heavy (breaks a guard).
- Rising within 24 px on the side a foe does not face opens an Ambush for 0.5 s, and he comes up facing that foe's back.
- A blow in the first 0.12 s of the Sink is a perfect dodge (`rewardPerfectDodge()`, once per Sink).
- The rise calls `travelEnded()` (Aftershock) and emits `dash` with the direction travelled, plus kit event `sink` with `from` and `to`.
- In the air, L drops him straight down at 360 px/s, and he sinks on landing if L is still held.
- Look: his body pours down into the pool over 3 frames as the knees bend and the coat folds in, fading out as it goes. The pool is a dithered ink oval in the gloam ramp with a rose rim and two rose eye pixels. The rise reverses the pour.

## J: the knife string

Clips run at 30 fps like every hero, and each blow carries on within 0.3 s of the last.
Each blow of the string is chosen when it starts: the behind string when the nearest ground foe within 26 px ahead of him has its back to him, the front string otherwise.

Blows from behind deal the shared 1.5x, and his kit's damage hook (`registerDamageHooks`, `hitBonus` on `back && melee`) adds half again, so 2.25x in all.
Each of his blows from behind sets the foe's turn timer back to 0, so a foe struck from behind cannot turn until 0.45 s after the last such blow.

| Blow | Frames | Hit on | Reach | Power | Knockback | Extra |
| --- | --- | --- | --- | --- | --- | --- |
| Flick (front) | 8 | 3 | 8 to 20 px, 10 px tall | 0.805x AD | 20 | |
| Cross (front) | 9 | 4 | 6 to 22 px | 0.92x AD | 30 | stagger 0.3 s |
| Heel Kick (front) | 13 | 6 | 4 to 24 px | 1.0x AD | 90 | heavy (breaks a guard); he hops back 10 px |
| Backstab (behind) | 10 | 5 | 4 to 20 px | 1.2x AD | 0 | stagger 0.5 s |
| Twist (behind) | 9 | 4 | 4 to 18 px | 1.0x AD | 0 | |
| Gut Slash (behind) | 12 | 5 | 4 to 24 px | 1.3x AD | 70 away from him | launch 90 |
| Drop Stab (air) | 10 | 4 | a plunge straight down, 14 px wide | 1.1x AD | 0 | dives at 300 px/s; always counts as from behind; once per airtime |
| Rising Cut | 11 | 3 | 2 to 20 px, 24 px tall | 1.0x AD | 40 | launch 150, heavy; live for 3 frames |

Every knife blow staggers the foe it lands on for the shared 0.35 s unless its row sets its own, and a knife that lands on a winding minion cuts its wind-up short.

Back-open cue: while a ground foe within reach ahead of him has its back to him, a rose chevron 5 px wide with a dark outline points down at that foe's back from above it, clear of his own cloak.
It is the one cue that tells the player the behind string is ready.

Animation beats, to `docs/motion-standard.md`, with the knives held in reverse grip:

- Flick: 1 calm frame with the near knife drawn to the hip, a snap out on frame 3 with a rose smear, 2 frames of follow-through as the wrist rolls back.
- Cross: the shoulders turn back, the far knife crosses on frame 4 under the near arm with an X of two smears, then a settle.
- Heel Kick: 3 frames winding on the back leg with the near knee drawn up, a spinning heel on frame 6, a hop back into a crouch.
- Backstab: 3 frames rising onto the toes with the knife high, a drive down on frame 5 with 0.04 s hit-stop and 1 px shake, the blade held in for 2 frames.
- Twist: the wrist turns with a short burst, no travel.
- Gut Slash: a low crouch, a wide sweep on frame 5, 2 px shake, then the arm carries across his body as he squares up again.
- Drop Stab: a tuck with both knives raised, then straight down with both knives under him, held to the landing.
- Rising Cut: from the pool's crouch, a rise onto the toes on frame 3 with the knife swept up overhead.
- A rose glint slides along the near knife for the two frames after each blow lands.

## Abilities on I (MP), rotation on O

Smoke Knot: 18 MP, 8 s recharge.

- He drops a knot at his feet and a cloud 72 px wide and 40 px tall stands for 3 s.
- Minions and elites inside are blind (`e.blind` refreshed to 0.3 s each frame they are inside), so they do not turn or start a wind-up.
- He counts as hidden while he stands inside it, and as Unseen for Gloam.
- Look: puffs of smoke dithered on the art pixel grid in the gloam ramp, dense at the heart and broken up at the edges, the cloud's upper edge lit rose, rolling outward over 0.2 s, curling, and thinning over the last 0.5 s.

Hamstring: 14 MP, 4 s recharge.

- A low crouching sweep 6 to 30 px ahead, 0.8x AP + 0.4x AD, that trips the first foe it hits: 0.9 s for a minion, 0.6 s for an elite, 0.3 s for a mini boss, none for the Warden.
- A tripped foe does not turn (the shared stun step skips its update), so Hamstring then Sink puts him behind a foe that cannot face him.

Both emit `cast` with ability `smokeKnot` and `hamstring`.
The HUD ability tabs (SMOKE, HAMSTRING, NEEDLES, MARK, CALTROPS) and the touch Ability button show the selected one and its recharge, as for Wenna.

## U: Gloaming

Shared charge levels and MP costs.

- A 0.3 s crouch with the knives crossed while the scene darkens to 55% behind the foes and heroes, the scene's light dimmed with it. Each foe he will strike gets a 1 px rose outline.
- Then he strikes up to 1, 2, 4 or 8 foes by charge level (nearest first, within the level's reach on both sides), 0.09 s each: he appears 12 px behind the foe on its back side with one rose crescent slash and 0.04 s hit-stop. A crowd never takes more than 1.4 s in all.
- Each stab deals the level's power x 0.25 x (AD + AP), counted as from behind, so 2.25 times that.
- He returns to where he crouched, the light comes back over 0.25 s, and the screen shakes 4 px.
- He is untouchable from the release to the return.
- With no foe in reach he slashes the air in place, and the MP is still spent.

The ultimate skill `t_eclipse` replaces it with Eclipse: every foe in the level's reach, struck from behind, and then the Veil comes on for free.

## The 20 skills

Ids are prefixed `t_`, and the full tables are in `docs/skills/tallis.md`.
Kinds: attack 6, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 1.
Each skill adds a new property on at least four of its seven level ups.

| Id | Name | Kind | Evolution (partner) |
| --- | --- | --- | --- |
| t_backbiter | Backbiter | attack, precise | Last Breath (t_shroud) |
| t_ambush | Ambush | attack, precise | Night Hunter (t_quietStep) |
| t_quickKnives | Quick Knives | attack, easy | Knife Storm (t_needles) |
| t_turnabout | Turnabout | attack, timed | Pirouette (t_sink) |
| t_plunge | Plunge | attack, timed | Falling Night (t_nightLeap) |
| t_cutTendon | Cut Tendon | attack, timed | Crippling Line (t_openVeins) |
| t_sink | Deep Shadow | movement, timed | Shadow Tide (t_ambush) |
| t_quietStep | Quiet Step | movement, easy | Phantom Walk (t_nightLeap) |
| t_nightLeap | Night Leap | movement, timed | Raven Drop (t_plunge) |
| t_needles | Needle Fan | spell, easy | Iron Rain (t_quickKnives) |
| t_markDusk | Mark of Dusk | spell, precise | Death Sentence (t_backbiter) |
| t_caltrops | Caltrops | spell, timed | Thorn Road (t_nightshade) |
| t_openVeins | Open Veins | dot, easy | Exsanguinate (t_nightshade) |
| t_nightshade | Nightshade | dot, timed | Black Lotus (t_cutTendon) |
| t_inkWound | Ink Wound | dot, precise | Spreading Night (t_ambush) |
| t_crows | Gloam Crows | summon, easy | Murder of Crows (t_needles) |
| t_double | Shadow Double | summon, timed | Two Moons (t_sink) |
| t_wraith | Hollow Wraith | summon, timed | Legion of Dusk (t_openVeins) |
| t_shroud | Shroud | passive, easy | Endless Night (t_quietStep) |
| t_eclipse | Eclipse | ultimate, timed | Night Without End (t_shroud) |

Kit events declared in `src/types/tallis.ts`: `veil: { on; cause }`, `sink: { from; to }`, `ambush: { foe }`, `backstab: { foe; kill }`.
The shared `cast`, `jump`, `dash` and `perfectDodge` are emitted as for Wenna.

## Look

Shared rig with his own skin in `src/constants/characters/tallis/look.ts`, slim build:

- warm tan skin, black hair under a deep charcoal hood, and a half mask of dark plum cloth over nose and mouth, so only the amber eye reads;
- a short charcoal coat on the existing coat tails code, and a plum scarf end on the shared scarf rope (the new skin flag `scarfEnd` lets a hooded hero keep it);
- fitted dark leathers with rose-stitched straps, wrapped forearms and shins, soft boots;
- two short curved knives in reverse grip, steel with a dusk rose edge glint, drawn by `src/game/hero/draw/knives.ts`: the near one at the clip's blade angle, the far one along its forearm.

Every colour runs deep shadow to glint like the other skins.
`PAL.gloam` is `#0c0a14`, `#1e1830`, `#3a2c4e`, `#6e4a78`, `#c06a9e`, `#ffb8dc`, and `SPARKS.gloam` comes from it (`#ffe4f2`, `#ffb8dc`, `#c06a9e`, `#6e4a78`), for the Veil outline and wisps, the pool, smears, the back-open chevron, the GL bar edge, Smoke Knot and Gloaming.
His own clips are in `src/constants/clips/tallis/`: the idle (a low ready stance, the near knife turning in his fingers, the shoulders breathing), every blow, the pour and the rise, both ability poses, the charge pose, and the Gloaming crouch and slash.
Walk, run, jump, fall, hurt and death use the shared clips through the motion layer, with both knives held close in reverse grip so they never cut through the body.

## Achievements

- `heroTrial("tallis", "Tallis")`: clear wave 10 with him, 40 coins.
- Knife in the Dark (group Skill, 60 coins): "As Tallis, defeat 30 foes with blows from behind in one run." It keeps the best of a run as the tracked stat `backKills` in `src/utils/trackedStats.ts`, and is listed in `docs/achievements.md`. Kills by his knife blows from behind, Drop Stab, Gloaming, Eclipse and Shadow Double count.
- Achievements go from 28 worth 1,770 coins to 30 worth 1,870.

## Shop items (docs/meta-progress.md)

Vitality: his HP. Honed Edge: every knife blow, Rising Cut, Drop Stab and Gloaming. Arcana: Hamstring, the spells, the AP dots and Gloaming. Wellspring: abilities and the ultimate spend MP. Precision: every hit, and he has the highest base crit. Light Boots: walk, run, veiled walk and the pool's glide. Endurance: Sink spends stamina. Aftershock: each Sink rise calls `travelEnded()`. Lodestone, Head Start and Last Light work in shared code.

## Co-op

Gloam, the Veil, Sink and its wait, the Ambush window and the selected ability live in kit seat memory (`rememberPerSeat(objectMemory(...))`).
His clouds, marks and the foes his special strikes are kept to the host.
A veiled Tallis in a room draws at 0.35 alpha with his rose outline on every screen, since guests watch the host's picture, and his player ring still shows.
Foes go for a visible hero first (the `nearest` change above).

## What stays unchanged

The other seven heroes' kits, numbers and clips.
Foe behaviour when no hero is hidden and no foe is blind.
Saves: coins, shop levels, unlocked heroes and options load as before, the new tracked stat starts at 0, and Tallis appears locked at 1350 coins.
The playtest folder is untouched.

## Bot balance check

Mash bot on this build from wave 1, one run each (`agent-studio`, `npm run playtest -- bot --hero all --policy mash`).

| Hero | Baseline wave | Baseline kills | This build wave | This build kills |
| --- | --- | --- | --- | --- |
| Kael | 4 | 11 | 4 | 11 |
| Ysra | 5 | 18 | 5 | 18 |
| Sable | 5 | 18 | 5 | 18 |
| Hulda | 4 | 11 | 4 | 11 |
| Orrin | 5 | 18 | 5 | 18 |
| Mirel | 5 | 16 | 5 | 16 |
| Wenna | 5 | 14 | 5 | 14 |
| Tallis, first build | | | 1 | 0 |
| Tallis, with the springing Rising Cut | | | 4 | 11 |
| Tallis, after QA (HP 90, Flick and Cross 15% stronger) | | | 4 | 12 |
| Tallis, after QA round 2 (every knife blow staggers) | | | 4 | 10 |

The first build fell on wave 1 with no kills.
Wave 1 is mostly Glimmer Moths hovering 40 to 50 px above the floor, and none of his ground blows reached them, so the mash bot stood under them pressing J at the air.
Raising his HP would not have changed that, so the fix answers fliers instead: J on the floor with a flier hovering over him and no ground foe in reach springs 34 px into Rising Cut, whose slash stays live for three frames.
After it he falls on wave 4 with 11 kills, level with Kael and Hulda and within two waves of every hero, so his HP and his front blows stay at the plan's numbers.

The skilled bot has no Tallis policy; it reaches wave 2 with 4 kills from wave 1, before and after QA, and at the wave 20 start (level 14) he falls to the Warden in 18.7 s like the others (18.4 to 27.5 s in the baseline).

QA's plain script walks up to the nearest foe and presses J, never using the Veil or Sink.
On it Tallis fell on wave 2 with 5 kills, against Kael on wave 3 with 9 and Hulda on wave 3 with 7.
HP 86 alone changed nothing, so both of the plan's fallback steps went in: HP 80 to 90, then Flick and Cross 15% stronger.
The plain script still ended on wave 2 with 5 kills.
The cause was a bug: four of his six string blows (Flick, Heel Kick, Twist, Gut Slash) carried no stagger, while every other hero's blows stagger by default, so a walking thornback kept hurting him by touch at knife range (the skilled bot lost 54 HP on wave 1, Kael none).
With every knife blow using the shared `COMBO.stagger` unless it sets its own, the plain script still ended on wave 2 with 5 kills.
Every hit he took there came from thornbacks: charges of 16 that wound up right beside him, and touches of 6.
A knife that lands on a winding minion now cuts its wind-up short; with that, a copy of the plain script that logs each hit reaches wave 3 with 6 kills, against Kael on wave 3 with 9 and Hulda on wave 3 with 7 on the same script (QA's runs; their kits are unchanged).
QA's other player script presses K and L for every hero, which are other moves for Kael and Hulda, so it measures only Tallis and is left out of this comparison.
The skilled bot still ends on wave 2 with 4 kills, losing 54 HP on wave 1: it taps L against a foe's blow, which for Tallis is a 0.15 s Sink that rises again inside a thornback's charge. A Tallis policy that holds L through the blow, as the owner note below describes, is the fix for that bot.

## As built

- The plan named Smoke Knot, a base ability, as the evolution partner of Ambush (Night Hunter) and Quiet Step (Phantom Walk). A partner must be one of his 20 skills, so Night Hunter evolves with Quiet Step and Phantom Walk with Night Leap.
- Several level tables in the plan added fewer than four new properties. Each such skill gained one small property where a number step was, recorded in `docs/skills/tallis.md`: Ambush refunds 15 Gloam, Turnabout holds a turned foe 0.5 s and staggers, Plunge's ring stuns, Cut Tendon chills, Quiet Step's veiled blows give 4 Gloam, Night Leap blinds the minions under the leap, Needle Fan chills, Caltrops trip a foe once, Open Veins slows and spreads, Nightshade bursts on death, Ink Wound slows, Gloam Crows bleed, Shadow Double's last stab stuns, Hollow Wraith blinds and bursts, and Eclipse leaves a Smoke Knot.
- J under a hovering flier springs into Rising Cut (see the bot check above).
- The Veil's outline is drawn through a new optional kit hook, `heroRing`, since the kit's `draw` has no access to the hero's sprite.
- A foe that cannot see the hero walks on past him and does no harm by touch; without it a husk stopped on top of a veiled Tallis and stood there.
- Gloaming's dark dims the scene's additive light as well as its colour, since in the daylight eras the sun's light washed out a dark drawn on the colour alone.
- He rises from the pool facing the back he came up behind, so the Ambush window can be used without turning round first.
- The behind string and the chevron read only a foe ahead of him, so a foe at his back never turns J into a Backstab at the air.
- After QA: an Ambush is spent only by a blow that lands, never by one a guard stops; foes that cannot see him do not guard; walkers that lose him turn back at each other and at the walls; the chevron moved above the open back with a dark outline; the smoke is dithered; the skill icons sit on a dusk disc with bolder knives; HP 80 to 90 and Flick and Cross 15% stronger.

## Note for the owner

The playtest bots have no Tallis entry.
A skilled policy would press K when no foe within 60 px faces him, walk or Sink behind the nearest foe, press J when the back-open chevron shows, and press L when a foe winds up in front of him.
