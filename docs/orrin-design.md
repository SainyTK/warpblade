# Orrin, the chain dancer

Orrin is the fifth hero and the second one the studio built in the hero sprint (patch 0.5.0).
He is a lean, quick fighter with a brass hook on a steel chain.
He fights at the chain's length, swings through the air on it, and grows stronger the longer he keeps moving.
He is the first hero whose travel follows real physics: a pendulum he pumps, reels in and lets go of.

Id `orrin`, kit `orrin`, name Orrin, title "The chain dancer".
Blurb: "A rift drifter with a brass hook on a long chain. He swings from crystals, ledges and the air itself, flings himself across the stage and lashes foes at the chain's tip. Never stands still for long."

## How he differs from every hero in the game

- Kael, the warp swordsman, runs, double jumps, dashes untouchable and teleports to a thrown pick. His sword works at 30 px and his spells cost MP.
  Orrin has no run, no double jump, no dash and no teleport.
  He travels along a visible chain: a swing that keeps its speed, a fling, a reel in and a zip to a hooked foe.
  Kael hangs still from a crystal. Orrin swings from it, and from platforms and the air as well.
- Ysra, the planted glaive fighter, pokes 40 px in a straight line, blocks and parries from the front, vaults over foes and spends Heat on fire rites.
  Orrin has no block and no parry.
  His blows are curved sweeps with a sweet spot at the tip, and the third one goes all the way round him.
  Momentum fills from moving, not from blows, and no button spends it.
- Sable, the ranged hunter, fires bolts out to 250 px, counts ammo, reloads and hops away.
  Orrin never fires a projectile.
  His reach stops at 64 px, and he wins by moving into and out of that ring.
- Hulda, the iron grappler, has the shortest reach, armour plates, grabs and throws, and walks slowly into blows.
  Orrin has no armour, cannot grab, and he moves foes only by knocking them back.
  He stays above and around them.

The axes that differ:
- Movement: pendulum swing, fling, reel and zip.
- Defence: positioning, plus a Slip on a well-timed release and a projectile-breaking whirl.
- Resource: Momentum, a damage multiplier filled by speed in the air.
- Range: mid, with a 46 to 64 px sweet spot and weak blows up close.
- Attack shape: arcs and full circles, plus body kicks during a swing.

## Stats

`base: { ad: 11, ap: 8, hp: 95, mp: 85, stamina: 130, crit: 0.06, move: 1.05, aspd: 1, haste: 1 }`, `growth: { ad: 0, ap: 0, hp: 1.1, mp: 0.2 }`, `comboHits: 3`, `special: "grandPendulum"`.
Accent `#e8b04a` (brass).
Price 550 coins in `src/constants/heroUnlocks.ts`, which is the next price by the rule written there.

## Controls

| Key | Orrin |
| --- | --- |
| A / D | Walk (about 71 px/s). No run; a double tap does nothing. While swinging, pumps the swing |
| W | One jump of 52 px. No double jump. While swinging, lets go with a small hop |
| S | With W, drop through a ledge. While swinging, Plumb Drop when held (skill) |
| J | Chain string of three: Lash (Chain Knee up close), Rising Arc, Full Circle. In the air, one Hanging Arc per airtime, given back by each new latch |
| K | Hook. Hold to keep swinging and release to let go. W held aims steeper, S held in the air aims low |
| L | Reel: while swinging, reels the chain in. On the floor, Backline, a yank backwards |
| I | The selected ability: Whirlwall, Anchor Pin, or a spell skill (MP) |
| O | Switch to the next ability on I |
| U | Ultimate (shared charge and MP rules) |

Touch buttons read Lash, Jump, Hook, Reel, Ability, Switch and Special.
Icons go in `src/ui/touch/icons/orrinArt.ts`.
The Hook button works on hold: holding it keeps the swing and lifting the finger lets go.
The stick pushed up while pressing Hook aims steeper, and pushed down in the air aims low.
The Controls screen lists every key above.

## The chain string (J)

Clips run at 30 frames a second, the same as the other heroes.
Each blow has a tip band, the last 18 px of its reach, which deals the tip damage and makes a brass tip flash.
The inner part of the chain deals the inner damage.

| Blow | Frames | Hit on | Reach | Tip | Inner | Knockback | Extra |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lash | 10 | 5 | 12 to 64 px, a flat arc from 20 degrees up to 10 degrees down | 1.1x | 0.55x | 60 | stagger 0.35 s |
| Chain Knee (replaces Lash when the nearest foe ahead is within 18 px) | 9 | 4 | 0 to 18 px | 0.7x | | 160 | pushes the foe out into tip range |
| Rising Arc | 12 | 6 | radius 56, swept from 30 degrees below the front to 120 degrees (over his head) | 1.2x | 0.6x | 80 up | a tip hit lifts a minion (vy -140). Catches fliers up to 56 px above |
| Full Circle | 18 | 6 to 12, each foe once | ring of radius 58 all round him, tip band 40 to 58 | 1.5x | 0.6x | 200 outward | stun 0.4 s, hit-stop 0.06 s on a tip |
| Hanging Arc (air) | 11 | 5 | radius 54, a downward arc ahead | 1.0x | 0.5x | 90 down | one per airtime, given back by each latch |

Each blow carries on within 0.35 s of the last.
Base rate: tip-and-inner mix at about 70 percent landed is about 2.0 AD/s on one foe and 4 AD/s on a crowd of six, before Momentum.
For comparison, Hulda does 1.8 and 3.6.
Inner hits are blocked by guarding foes as for every hero.
A tip hit curls round the guard and lands, and Full Circle's tip also breaks the guard.

Animation beats:
- Lash: the arm draws back for 3 frames with the chain trailing behind him. On frame 5 the chain snaps straight and a 3-frame brass smear follows the tip. For 4 frames the chain falls back into a loop at the forearm.
- Rising Arc: he crouches with the chain low ahead, sweeps it up and over in one curve, and the chain hangs behind his shoulder for 3 frames.
- Full Circle: 4 calm frames of wind-up with the chain swung once overhead. A full turn of the body follows, the chain level at radius 58 with a brass ring smear. He settles over 4 frames as the chain coils back.

The chain is drawn from the hand to the hook as links:
- 3 by 2 px ovals alternate with 1 by 2 px links seen side-on, every 3 px.
- Each link has a dark outline and a steel ramp highlight.
- During a blow the chain follows a curve that lags behind the hand, as a quadratic from the hand through a lagged control point to the tip.
- At rest a short loop hangs from the left forearm and sways, using the existing verlet `Chain` (`src/game/hero/chain.ts`).

The hook head is a 7 px brass sickle with a dark outline and a one-pixel glint.

## The hook and the swing (K)

K costs 18 stamina.
The hook flies at 420 px/s along the aim: 40 degrees up toward the facing side, 75 degrees with W held, 30 degrees below level with S held in the air.
It flies up to 84 px and latches on the first thing it meets:

1. A foe: Reel to the foe (below).
2. An anchor crystal (`ANCHORS`, within 10 px of the path), or the underside or edge of a platform (`PLATFORMS`): a swing that holds as long as K is held.
3. Nothing within 84 px: the hook bites the air at full length and opens a small rift tear. The swing holds for 1.2 s, then the tear snaps shut and he lets go.

Hooks per airtime: 2, reset on landing.
Latches on anchors and platforms do not count against the limit.

The swing is a pendulum around the latch point with a fixed chain length:
- Chain length on latch is the smallest of: the distance to the latch point, 84 px, and the latch point's height above the floor under him minus 6 px. The bottom of the arc therefore always clears the floor by 6 px. The length is never under 24 px.
- Each step:
  - add gravity (the shared value) to his velocity;
  - with A or D held, add 260 px/s squared along the tangent toward that side;
  - move him, then put him back on the circle and remove the velocity along the chain.
- Speed is capped at 300 px/s.
- A latch from the floor gives a 0.12 s yank that lifts him onto the arc with 170 px/s along the tangent toward the facing side. A grounded K therefore always launches him into a swing.
- Letting go keeps his velocity. Letting go while moving up in the forward half of the arc adds 15 percent: the fling.
- W while swinging lets go with an extra 80 px/s upward.
- Touching the floor while moving down ends the swing as a landing.
- Swinging into the side of a platform stops the swing there.
- After letting go he is in the air with normal air control. One Hanging Arc is given back, and a hook is left if he has one this airtime.
- Every release and every landing out of a fling calls `travelEnded()`, which is what Aftershock answers.

While swinging:
- J is the Hanging Arc, swept along his direction of travel.
- His body is a weapon. Above 140 px/s, each foe he passes through takes the swing kick: 0.7x AD times speed divided by 200, capped at 1.2x, once per foe per swing, knocked along his velocity.

Slip, his perfect dodge: a blow or projectile that would hit him within 0.12 s after he lets go at more than 120 px/s misses. `absorbHurt` returns true and calls `rewardPerfectDodge()`.

Reel to a foe: the chain pulls him to the foe at 360 px/s and he can be hit on the way.
He arrives in a flying kick for 1.0x AD, knockback 140, then bounces off up and back at 120 px/s up and 90 px/s back.
He stays in the air with the Hanging Arc given back.
The same happens on minis and bosses.

Hook beats:
- 2 frames of anticipation with the arm cocked behind the head.
- The throw frame: the chain pays out link by link behind the flying hook.
- On a latch, a 2-frame brass spark burst at the hook, and the chain goes taut and straight. During the swing the chain stays a straight line.
- An air bite opens a 6 px tall slit in the volt ramp with two sparks. At 0.9 s it flickers as a warning. At 1.2 s it closes with a one-frame flash.

His body pose follows the swing: legs trail behind the direction of travel and the free arm reaches forward.
At the bottom of the arc his knees tuck.
On release he spins once in the air over 6 frames (body roll), then takes the fall pose.

## Reel and Backline (L)

While swinging, holding L reels the chain in at 160 px/s, down to 24 px.
His swing speed rises as the chain shortens: speed times old length divided by new length, capped at 1.6 times the speed when the reel started.
Reeling costs 10 stamina a second.

On the floor, L is Backline, costing 16 stamina:
- the hook bites the floor 50 px behind him and yanks him 48 px back over 0.2 s, his feet low;
- he has no untouchable frames;
- he faces forward through it;
- 0.35 s before the next;
- it calls `travelEnded()` when it ends.

The chain is drawn taut to the floor point for its 0.2 s.

## Momentum (MO bar)

Momentum is his second bar, 0 to 100, shown under stamina as MO in the same HUD slot as Hulda's GR and Sable's QV.
The bar is filled in the brass ramp, and at 100 the bar's top edge glints.

It fills:
- +40 a second while he is in the air moving faster than 140 px/s;
- +5 for each tip hit;
- +20 for each Slip.

It empties:
- 12 a second, once he has spent 1.5 s on the floor without a tip hit;
- 30 for each blow that hurts him.

What it does:
- Every hit he deals is multiplied by 1 + 0.4 x Momentum / 100, through `damageScale`.
- At 50 or more, every blow reaches 8 px further, and the tip band moves with it.
- At 100, the chain glows brass along its length and the tip leaves a short brass trail.

No button spends it.
Skills may read it or spend it.
A run starts at 0.

## Abilities on I (MP), rotation on O

Both abilities are in the base kit and both cast events.

Whirlwall: 20 MP, 5 s recharge.
- He spins the chain over his head for 1.2 s and walks at half speed.
- The ring has radius 46. Every foe in it takes 0.35x AP every 0.2 s (six ticks) and is pushed outward 20 px.
- Every foe projectile that touches the ring is destroyed with a brass spark. This is his answer to orbs and spit.
- The ring is drawn as a blurred chain loop with a faint brass ring and three link ghosts at 120 degree steps.

Anchor Pin: 24 MP, 6 s recharge.
- He hurls the hook down through the nearest foe ahead within 90 px for 2.0x AP and nails it to the floor: a minion is rooted for 1.8 s, a mini or boss for 0.6 s.
- The chain stays drawn from the floor spike to the foe while it is rooted.
- With no foe in reach, the hook strikes the floor 60 px ahead for a small dust burst and costs half.

The HUD K tab and the touch Ability button show the selected ability and its recharge, as for Hulda.

## Special and ultimate

Base special, Grand Pendulum, with the shared charge levels:
- A rift tear opens 70 px above him and he swings two wide passes under it, radius 90, across and back over 1.2 s.
- His body and chain hit every foe they pass for 0.5x the level's power, once per pass.
- At the end of the second pass he lets go and crashes down. A brass and volt ring deals the level's full power within the level's reach.
- Beats:
  - 0.2 s of anticipation, him crouched with the chain swung overhead;
  - the tear opening with a flash;
  - the two passes, with a brass arc smear and light from the tear;
  - the crash, with a 4 px screen shake, 0.08 s hit-stop and dust and rock chunks.

The ultimate skill `o_maelstrom` replaces it (below).

## The 20 skills

Ids are prefixed `o_`.
Data goes in `src/constants/characters/orrin/skills/`, behaviors in `src/game/skills/orrin/`, and icons (each skill and its `_evo`) in `src/ui/skills/icons/orrin/`.
Level tables go in `docs/skills/orrin.md`, written from the data in the same format as the other heroes' docs.
Budgets follow `docs/skill-design.md`:
- level 8 is about 6 to 12 times level 1, and up to 25 times for dot and summon skills;
- at least four of the seven level ups add a property;
- timed is about 1.6 times easy, and precise about 2.5 to 3 times easy;
- movement skills sit at about 0.8 of their band.

Kinds: attack 5, movement 4, spell 3, dot 3, summon 3, passive 1, ultimate 1.

| Id | Name | Kind, risk, button | Level 1 | Properties added along the levels | Evolution (partner) |
| --- | --- | --- | --- | --- | --- |
| o_sweetspot | Sweet Spot | attack, precise, J | tip hits +25% | tip band +4 px; a tip hit marks the foe (+10%, 2 s); Full Circle tips always crit; a tip hit refunds 4 stamina; mark +20% | Perfect Arc (o_perpetual): at 50+ Momentum every tip hit deals double and sends a 20 px shock through the foes behind it |
| o_ironweight | Iron Weight | attack, easy, J | string +15% | Full Circle radius +6; Rising Arc launches higher; Full Circle turns twice (second turn at half); foes knocked into others hit them for 0.5x | Wrecking Ball (o_reelsnap): the hook becomes a spiked iron ball, and Full Circle turns three times at radius 72 |
| o_skylash | Sky Lash | attack, timed, J in the air | two Hanging Arcs per airtime | a Hanging Arc above 160 px/s deals +50%; air arcs spike minions so they bounce; three per airtime; a spiked foe hits the foes it lands on for 0.5x; the arc throws a brass crescent 60 px on | Falling Star (o_pump): every air arc throws a crescent that pierces, and at 100 Momentum a second one follows |
| o_pendulumkick | Pendulum Kick | attack, timed, swing body | swing kick from 110 px/s, +25% | kicks launch minions; a pass that hits 2 or more foes gives back a hook; kicks stun 0.5 s; each foe can be kicked going and coming back; at top speed an afterimage kicks again 0.2 s later | Comet Heel (o_skylash): kicks leave a brass comet trail that burns foes under it, and the afterimage kicks every pass |
| o_gaff | Gaff | attack, precise, K on a foe | the arrival kick +40% | a foe winding up is staggered 1.2 s and the kick crits; the bounce gives back a hook; the hooked minion is yanked along on the bounce; the arrival hits a 26 px ring; a crit arrival gives +20 Momentum | Harpoon (o_sweetspot): a hook on a foe drags every foe on the chain's line to it before the kick, and the kick is a guaranteed crit for 3x |
| o_pump | Pendulum Pump | movement, easy, swing | pump +30%, air bite 1.6 s | hook range +12; fling +15% more; hook costs 4 less stamina; a third hook per airtime; air bite 2.2 s; hook range +24 | Skyline (o_friction): with 50+ Momentum hooks are not limited per airtime, and the chain cuts foes it sweeps through for 0.5x AD |
| o_reelsnap | Reel Snap | movement, timed, L in a swing | a reel that reaches 1.3x speed snaps 0.8x AD at foes within 30 px | reel 220 px/s; the snap stuns 0.4 s; the snap gives back the Hanging Arc; the snap radius is 44; a snap at the bottom of the arc sends a shock along the floor | Whiplash (o_ironweight): every snap is a Full Circle at the swing point |
| o_undertow | Undertow | movement, timed, L on the floor | Backline 64 px | Backline drags the nearest foe ahead 20 px after him; a blow in the first 0.1 s of a Backline is a Slip; K within 0.3 s of a Backline flings 30% harder; Backline leaves a chain line on the floor that trips foes (0.4 s) | Riptide (o_anchorpin): Backline pulls every foe within 60 px ahead after him and roots them 1 s |
| o_plumbdrop | Plumb Drop | movement, precise, S held in a swing | lets go and drops straight down: 1.2x AD in a 28 px ring | ring 40 px; foes in it are launched; Momentum adds to the drop's damage; a drop on a foe's head crits; a drop gives back a hook | Meteor Anchor (o_gaff): the drop drives the hook into the floor for a 64 px quake and a 1 s root |
| o_chainfence | Chain Fence | spell, easy, I | 18 MP: two posts 60 px apart with a chain at knee height. A foe crossing it takes 1.2x AP and stumbles 0.4 s. Lasts 5 s | 80 px long; two fences at once; foes crossing are slowed; the chain sparks every 0.5 s for 0.3x AP to foes near it; lasts 8 s | Razor Fence (o_barbs): the chain is barbed, every crossing adds 3 bleed stacks, and the fence follows him |
| o_tether | Tether | spell, timed, I | 22 MP: chains the two nearest foes together for 4 s and shares 30% of the damage one takes with the other | three foes; 45% shared; foes pulled more than 70 px apart are yanked together and collide for 1.5x AP; lasts 6 s; when a tethered foe dies, the others take 2x AP | Chain Gang (o_bell): every foe on screen is tethered in one chain |
| o_anchorfall | Anchor Fall | spell, timed, I | 26 MP: an iron anchor drops from a rift 50 px ahead for 3.0x AP in a 26 px ring, stun 0.6 s | a second anchor 30 px further; the anchors leave a chain between them that roots for 0.8 s; the ring is 36 px; the drop pulls foes 20 px in first; three anchors | Iron Rain (o_tether): five anchors fall across the screen, each 6x AP |
| o_barbs | Barbed Links | dot, easy, J | chain hits add 1 bleed stack (0.12x AD a second, 6 max, 3 s) | 2 stacks on tip hits; 10 max; swing kicks add stacks; bleeding foes take +10% from the chain; 0.3x AD a tick | Flay (o_chainfence): a Full Circle tip consumes the stacks for 1.2x AD each |
| o_rust | Rust Bite | dot, timed, K latch | a hooked foe rusts: 0.2x AD a second for 4 s | rusted foes take +15% from every source; rust spreads to one foe it touches; Anchor Pin rusts; rust 0.45x a second; rusted foes slowed 20% | Corrode (o_gaff): rust on a foe that dies bursts for 3x AD and rusts every foe in 40 px |
| o_friction | Friction Burn | dot, timed, swing and Full Circle | foes the chain sweeps in a swing or a Full Circle are ignited (the shared `ignite`) | the burn lasts longer; the burn spreads on a kill; a burning foe takes +20% from the swing kick; stronger burns; a brass flame trail on the chain at 100 Momentum | Scorched Arc (o_pendulumkick): every swing leaves a burning arc in the air that hits foes passing through |
| o_kite | Brass Kite | summon, easy, on letting go | 20% chance: a brass kite on a string trails behind him for 6 s and dives at the nearest foe for 0.6x AD every 1 s | 35% chance; two kites; kites dive in pairs; a kite dive chills; kites last 10 s | Sky Armada (o_pump): four kites circle him all the time and dive with every swing kick |
| o_bell | Rift Bell | summon, timed, on a tip hit | 12% chance, cooldown 2 s: a bronze bell drops on a chain from a rift above the foe and swings through it twice for 0.8x AD | stun on the first swing; the swing also hits the foes beside it; a toll ring for 0.4x AP; two bells; swings 3 times | Great Bell (o_tether): the bell is twice the size, and its toll stuns everything on screen for 0.5 s |
| o_twin | Twin Chain | summon, precise, on a Slip | a shade of Orrin appears where he let go and does a Full Circle at 1.0x | the shade gives +10 Momentum; two shades; the shade hooks and swings once; the shade copies his next Hanging Arc; 2.0x | Mirror Dance (o_sweetspot): every Slip calls three shades whose tip hits all crit |
| o_perpetual | Perpetual Motion | passive, easy | Momentum empties half as fast | Momentum bonus up to +50%; +5 Momentum a second on the floor while walking; Momentum never falls below 30; hurts cost 15; +60% at full | (passive: an evolution partner only, no evolution of its own, as passives allow) |
| o_maelstrom | Maelstrom | ultimate, timed, U | replaces Grand Pendulum: he swings full vertical circles round a rift tear, two turns, chain radius 96, 0.6x the level's power per foe per turn | three turns; foes in the circle are pulled toward its middle; radius 120; chain shards fly out on each turn; four turns, with a crash ring at the end | Eye of the Maelstrom (o_pump): five turns, a circle as tall as the screen, and foes pulled into its middle burst together at the end for about 15 times the special |

If the skill contract does not allow a passive with no evolution, `o_perpetual` evolves into Endless Motion (o_kite): Momentum never empties while a kite is out.
Ultimate budget: level 8 about 6 times Grand Pendulum's cast, evolved about 15 times.

Events his kit emits:
- `cast` for each ability;
- `jump`;
- `dash` on each Backline and each release, with `dir`;
- `perfectDodge` through `rewardPerfectDodge`;
- a kit event `latch: { kind: "foe" | "anchor" | "platform" | "air"; foe: Enemy | null }`, declared in `src/types/orrin.ts`, the same way Hulda declares `grab`.

## Look

The shared rig with his own skin in `src/constants/characters/orrin/look.ts`:
- copper-red hair tied in a short tail with a dark band, shaved at the sides;
- warm tan skin;
- an indigo sleeveless vest with brass buckles over a charcoal shirt, bare forearms with wrist wraps;
- a long dark sash tail at the belt, drawn as a verlet rope like Kael's scarf;
- loose slate trousers wrapped at the shins, and light boots.

The chain coils three times round the left forearm.
Every colour runs from deep shadow to glint like the other skins.
Effect ramps:
- a new `PAL.brass`: `#3a2410`, `#7a4e1a`, `#c08a2e`, `#e8b04a`, `#ffe08a`, `#fff6d0`, plus brass sparks, for tip flashes, chain glow and the MO bar;
- the existing volt ramp for rift tears;
- the steel ramp for links.

His own clips go in `src/constants/clips/orrin/`:
- idle, with the hand loose and the chain loop swaying;
- every blow, the hook throw, the swing, the reel, the release roll, Backline, the reel-to-foe zip and its kick, both ability clips, the charge pose and both ultimates.

Walk, jump, fall, hurt and death use the shared clips through the motion layer, to `docs/motion-standard.md`, with a light 24 px stride.
The idle chain loop and the swing pose must hand over without a pop: 2 frames of crossfade into the swing pose on latch, and out of the release roll.

## Achievements

- `heroTrial("orrin", "Orrin")`: clear wave 10 with him, 40 coins.
- New: Full Swing (group Skill, 60 coins): "As Orrin, defeat 3 foes with swing kicks in one swing." One swing runs from latch to letting go. It is tracked as a best-of-run stat in `src/utils/trackedStats.ts` and listed in `docs/achievements.md`.

## Shop items (docs/meta-progress.md)

- Vitality: his HP.
- Honed Edge: the string, the swing kick, the arrival kick and every attack skill scale with `progress.stats.ad`.
- Arcana: Whirlwall, Anchor Pin and the spell skills scale with `progress.stats.ap`.
- Wellspring: abilities and the ultimate spend MP.
- Precision: every hit goes through `dealDamage`.
- Light Boots: his walk, the swing pump, the reel speed and Backline scale with `progress.stats.move`.
- Endurance: hooks, reels and Backline spend stamina.
- Aftershock: every release, fling landing and Backline calls `travelEnded()`. Add Orrin to the Aftershock line in the shop doc.
- Lodestone, Head Start and Last Light work in shared code.

## Co-op

His memory registers per seat.
The guest draws the chain, so the latch point, chain length, swing state, Momentum and the selected ability live in kit seat memory (`rememberPerSeat(objectMemory(...))`).
Skill memory stays host-only in the skill runtime.
Two Orrins can hook the same foe or anchor.
A downed or departed Orrin lets go at once.
The host draws every hero and streams the picture, so a guest's chain is drawn by the host from that guest's seat memory.

## As built

The constants in `src/constants/orrin/` and the skill data in `src/constants/characters/orrin/skills/` are the source of truth; `docs/skills/orrin.md` lists every skill level from the data.
Changes made while building, each for the same goal as the design:

- A ledge pull for low platforms.
  The two low platforms stand 42 px above the floor, so a hook under them leaves room for a chain of 8 px at most, short of the 24 px the swing needs.
  A hook that bites a platform with less room than that hauls him up and over its lip onto the platform instead (`src/game/hero/orrin/climb.ts`).
  The high middle platform keeps the full swing.
- The room for a swing is measured from the floor under him, as the design says, so an air bite over a low platform still gives a full swing while he stands on the floor below it.
- The hook flies a fixed line in the world from where it left his hand, so a hook thrown on the rise of a jump reaches a crystal.
  W is also the jump, so the steep aim works in the air: jump, then press K with W still held.
- The hook bites the air at the edge of the stage, and a swing into either side of the stage stops there, so he never hangs against a wall with his speed kept.
- A chain blow strikes any foe whose body crosses the swept arc.
  Measuring only to a foe's centre left the flat Lash unable to reach short ground foes.
- Grand Pendulum measures its chain from the floor under him when it is cast and passes through the low platforms, so its passes keep their 90 px reach in the middle of the stage.
- Perpetual Motion level 4 holds Momentum at 30 or more, since the skill is always taken mid-run and a run start would never see it.
- Undertow's harder fling lasts until he lets go of the swing that follows the Backline.
- Full Swing counts foes his swing kicks defeat between one latch and letting go, as the best-of-run stat `swingKills`.
- Every skill's own hits carry its id as the damage source, so the end-of-run screen lists them by name.
- Tip hits curl round a guard (`curls` in the shared hit options).
  Walking thornbacks and husks hold their guard toward him, so without this his Lash tips at 46 to 64 px landed as blocks in ordinary fights.
  Inner hits are still blocked, so spacing keeps its point.
- A hook thrown in the air hangs him while it flies (gravity 0.3, falling at most 60 px/s), so a second air bite can catch before he lands.
- A hook that reaches the stage's edge less than 24 px from his hand falls short: no swing, and its stamina and air hook come back.
- Anchor Pin targets only foes standing on a floor, since it nails them there, and its stake goes in 4 px in front of the foe's body with the chain drawn in front of the foes, so the pin reads at game scale.
- Anchor Pin holds every foe where it is pinned: the shared foe step keeps a pinned foe's place whatever its own step asks for, and a pinned thornback cannot start or keep a charge.
- The sash is drawn as a short strip of cloth from the belt that tapers, folds and splits at the end, and it takes half the scarf's breeze.

## Balance check

Playtest bot runs on this build, one run each (runs are deterministic), from wave 1 with no shop upgrades.
The other four heroes fall on the same waves as in the baseline runs on the base commit.

| Hero | Mash: death wave | Mash: kills | Skilled: death wave | Skilled: kills |
| --- | --- | --- | --- | --- |
| Kael | 4 | 11 | 5 | 15 |
| Ysra | 5 | 18 | 5 | 16 |
| Sable | 5 | 18 | 5 | 14 |
| Hulda | 3 | 7 | 5 | 18 |
| Orrin | 5 | 18 | 5 | 18 |

Orrin falls on the same wave as most of the others with both bots.
Before his tips curled round guards he fell on wave 4 with both (13 and 11 kills).
The skilled bot never hooks or swings: it reads the HUD tabs, and Orrin's tabs are his two abilities, so K is never pressed for travel.
It plays him as a walker who lashes and spins Whirlwall, which leaves out his Momentum and his swing kicks.
At wave 8 and level 30, the skilled bot defeated 12 foes in 60 s with Orrin and 13 with Hulda.

## Note for the owner

The playtest bots in `agent-studio/playtest/` have no Orrin entry, and the studio does not edit that folder.
A skilled policy for him would throw K toward a crystal or into the air, hold it while pumping toward the swing, let go on the forward upswing, and lash with J at foes 46 to 64 px away.
