# Orrin, the chain dancer

Orrin is the fifth hero and the second one the studio built in the hero sprint (patch 0.5.0).
He is a lean, quick fighter with a brass hook on a steel chain.
He fights at the chain's length, swings through the air on it, and grows stronger the longer he keeps moving.
He is the first hero whose travel follows real physics: a pendulum he pumps, reels in and lets go of.

Id `orrin`, kit `orrin`, name Orrin, title "The chain dancer".
Blurb: "A rift drifter with a brass hook on a long chain. He swings from crystals, ledges and the air itself, flings himself across the stage and lashes foes at the chain's tip. Never stands still for long."

## How he differs from every hero in the game

Every hero plays on the same layout (`docs/moveset-design.md`): J tapped for the string, J held for the warp, K guard and parry, L the front dodge, I abilities, O switch, U the special.
Orrin keeps his own shape inside it:
- His string is three curved sweeps with a sweet spot at the chain's tip, and the third goes all the way round him.
- His warp throws the hook on its chain and lands him on the foe with a flying kick that leaves the foe bound in chain.
- J held with Up held is his swing instead: the hook bites a crystal, a platform or the air, and he swings, pumps, reels in and flings himself across the stage.
- His guard spins the chain into a disc, a weak block, and his parry, Chain Bind, hauls the attacker out to the chain's tip and holds it there for a free string.
- Momentum fills from speed in the air and multiplies every hit he deals.

The axes that differ:
- Movement: pendulum swing, fling and reel, on top of the shared warp and dodge.
- Defence: a weak block for a strong parry, a Slip on a well-timed release, and a projectile-breaking whirl.
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
| W | One jump of 52 px, after a 2-frame bend of the knees. No double jump. While swinging, lets go with a small hop |
| S | With W, drop through a ledge. While swinging, Plumb Drop (skill) |
| J tapped | Chain string of three, always Lash, Rising Arc, Full Circle, wherever the foes stand. In the air or while swinging, one Hanging Arc per airtime, given back by each new latch |
| J held | The warp: the hook thrown at the nearest foe ahead, a flying kick on arrival that binds it. With W held, the swing hook. While swinging, reels the chain in |
| K | Guard: the chain spun into a disc in front of him. Pressed just as a blow lands, Chain Bind |
| L | The shared front dodge |
| I | The selected ability: Whirlwall, Anchor Pin or a spell skill (MP). Held, its wide form |
| O | Switch to the next ability on I |
| U | Grand Pendulum (shared charge and MP rules) |

Touch buttons read Lash, Jump, Dodge, Guard, Ability, Switch and Special.
Icons go in `src/ui/touch/icons/orrinArt.ts`; the dodge icon is shared.
Holding Lash is the warp, and with the stick pushed up it is the swing hook.
The Controls screen lists every key above.

## The chain string (J)

Clips run at 30 frames a second, the same as the other heroes, and the whole fight plays at `PACE` (0.8), so a frame takes 1/24 s on screen.
J on the floor always plays the same three blows in the same order, near or far, with foes on one side or both.
Nothing picks a blow from the foes around him, and J never turns him round: he faces where the player last pointed.
Each blow has a tip band, the last 18 px of its reach, which deals the tip damage and makes a brass tip flash.
The inner part of the chain, from his shoulder out, deals the inner damage.

| Blow | Frames | Hit on | Link | Reach | Tip | Inner | Knockback | Extra |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lash | 16 | 7 | 11 | 0 to 64 px, a flat arc from 20 degrees up to 10 degrees down | 1.1x | 0.55x | 30 out; a tip hit's hook drags the foe 110 toward him | stagger 0.6 s |
| Rising Arc | 18 | 7 to 8 | 11 | radius 62, swept from 30 degrees below the front to 120 degrees (over his head) | 1.2x | 0.6x | 20, 80 up | stagger 0.65 s; a tip hit lifts a minion (vy -140). Catches fliers up to 62 px above |
| Full Circle | 28 | 8 to 14, each foe once | 16 | ring of radius 60 all round him, tip band 42 to 60 | 1.5x | 0.6x | 70 outward | knocks the foe down for 0.8 s; a tip breaks the guard |
| Hanging Arc (air) | 15 | 7 to 8 | | radius 54, a downward arc ahead | 1.0x | 0.5x | 90 down | one per airtime, given back by each latch |

A J pressed during a blow carries the string on at the blow's link frame, out of its follow-through.
After Full Circle a press already made starts the next string at its link frame.
Without a press the blow plays on to its last frame and settles back to his stance, and J within 0.35 s of that carries the string on.

Hit feel grows through the string (`feel` on each blow in `src/constants/orrin/string.ts`); a tip hit adds 0.5 px of shake and a higher ring:

| Blow | Hit-stop | Shake | Hit pitch |
| --- | --- | --- | --- |
| Lash | 0.06 s | 0.1 s, 1.2 px | 1.15 |
| Rising Arc | 0.08 s | 0.13 s, 1.6 px | 0.98 |
| Full Circle | 0.13 s | 0.22 s, 2.8 px | 0.72 |
| Hanging Arc | 0.07 s | 0.1 s, 1.4 px | 1.02 |

With J pressed in time, on screen: the Lash lands 0.3 s after the press, the Rising Arc 0.53 s after the Lash, Full Circle 0.59 s after the Rising Arc, and the next string's Lash 0.77 s after Full Circle.
The staggers outlast the gap to the next blow, so a minion never starts a wind-up inside the string, and a guard cannot form between blows.
Full Circle's knockdown lasts until the next Lash has landed.
The Lash's tip drags the foe in and the other blows push it only 2 to 6 px, so a foe struck from anywhere inside the Lash's reach settles at the chain's tip and stays in reach string after string.
Base rate: a string takes 1.9 s on screen with J pressed ten times a second, the same as before the pace change (1.92 s), so its damage per second did not change: tip-and-inner mix at about 70 percent landed is about 2.0 AD/s on one foe and 4 AD/s on a crowd of six, before Momentum.
For comparison, Hulda does 1.8 and 3.6.
Inner hits are blocked by guarding foes as for every hero.
A tip hit curls round the guard and lands, and Full Circle's tip also breaks the guard.

Animation beats, each blow loading against its direction, holding the wind-up for four frames, snapping on its hit frame, holding with a small overshoot and following through, with his feet planted (the front foot steps in only while lifted):
- Lash: he sits back and draws the chain hand far behind his hip, the free hand reaching at the foe and the front heel up. On frame 7 the arm snaps straight out at chest height with his weight thrown onto the front foot and the back heel up. The chain whips past the foe, drops to the floor and is drawn back into the coil.
- Rising Arc: from the Lash's follow-through he sinks low with the chain dragged along the floor ahead, then rises onto his toes with the back arched and the chain hand thrown overhead. The chain flies up and over and hangs behind his shoulder, which is where Full Circle starts.
- Full Circle: crouched and leaning back, he swings the chain round over his head for the wind-up. On frame 8 the chain goes level ahead and his body turns once on planted feet, the chain flat at radius 60 with a brass ring smear. He ends in a deep bow over the front foot as the chain whips past and goes slack, then rises back to his stance.
- Hanging Arc: he curls up with the chain hand thrown up and back, holds it, snaps open with the chain brought down across in front of him and his legs kicked back, and curls up again as the chain falls.

The chain is drawn from the hand to the hook as links:
- 3 by 2 px ovals alternate with 1 by 2 px links seen side-on, every 3 px.
- Each link has a dark outline and a steel ramp highlight.
- During a blow the chain is a quadratic from the hand through a control point to the tip (`blowChain.ts`). The control point trails the motion in the wind-up and the sweep. After the strike the tip whips past the end of the sweep and past full reach, swings back and settles, and the bend flips over and dies away; then the chain sags and coils back to the rest hang. A new blow crosses from the chain's last shape, so the string's chain never jumps. On the floor the chain lies along it.
- At rest a short loop hangs from the left forearm and sways, using the existing verlet `Chain` (`src/game/hero/chain.ts`).

The hook head is a 7 px brass sickle with a dark outline and a one-pixel glint.

## The warp: the hook and the flying kick (J held)

The throw, the flight, the cost (10 MP), the recharge (2 s) and the arrival blow's power are the shared warp's (`src/game/hero/warp.ts`).
His `WarpStyle` is in `src/game/hero/orrin/warpStyle.ts`:
- The thrown weapon is his brass hook, a short run of chain whipping behind it, and the chain paid out from his hand to the hook while it flies.
- The arrival blow is a flying kick: he lands heel first beside the foe at the shared power, with a short knockback (40 px/s) so the foe stays in his reach.
- His extra: the chain stays wound round the foe, a minion stunned for 0.6 s and a mini boss or boss held in place for 0.25 s, ready for his string.
  In the air the kick also gives back a hook and a Hanging Arc, so a warp to a flying foe can go straight into a swing.
- Gaff, his warp skill, changes the shared numbers through `tune` and adds its own crits, ring and drag (below).

## The swing (J held with W held)

`readActions` takes the long press of J with W held before the shared warp sees it.
The swing hook costs 18 stamina.
It flies at 420 px/s along the aim: 75 degrees up toward the facing side, or 40 degrees with A or D held too.
It flies up to 84 px past every foe and latches on the first thing it meets:

1. An anchor crystal (`ANCHORS`, within 10 px of the path), or the underside or edge of a platform (`PLATFORMS`): a swing that holds until he lets go.
2. Nothing within 84 px: the hook bites the air at full length and opens a small rift tear. The swing holds for 1.2 s, then the tear snaps shut and he lets go.

Hooks per airtime: 2, reset on landing.
Latches on anchors and platforms give one back.

The swing is a pendulum around the latch point with a fixed chain length:
- Chain length on latch is the smallest of: the distance to the latch point, 84 px, and the latch point's height above the floor under him minus 6 px. The bottom of the arc therefore always clears the floor by 6 px. The length is never under 24 px.
- Each step:
  - add gravity (the shared value) to his velocity;
  - with A or D held, add 260 px/s squared along the tangent toward that side;
  - move him, then put him back on the circle and remove the velocity along the chain.
- Speed is capped at 300 px/s.
- A latch from the floor gives a 0.12 s yank that lifts him onto the arc with 170 px/s along the tangent toward the facing side.
- W lets go and keeps his velocity, with an extra 80 px/s upward. Letting go while moving up in the forward half of the arc adds 15 percent: the fling.
- J held down again reels the chain in at 160 px/s, down to 24 px, for 10 stamina a second. His speed rises as the chain shortens, capped at 1.6 times the speed when the reel started.
- J tapped is the Hanging Arc, swept along his direction of travel.
- Touching the floor while moving down ends the swing as a landing.
- The shared actions (warp, guard, dodge, abilities, special) wait until he lets go.
- Every release and every landing out of a fling calls `travelEnded()`, which is what Aftershock answers.

His body is a weapon while he swings.
Above 140 px/s, each foe he passes through takes the swing kick: 0.7x AD times speed divided by 200, capped at 1.2x, once per foe per swing, knocked along his velocity.

Slip: a blow or projectile that would hit him within 0.12 s after he lets go at more than 120 px/s misses, with the shared perfect dodge reward and 20 Momentum.

Hook beats:
- 2 frames of anticipation with the arm cocked behind the head.
- The throw frame: the chain pays out link by link behind the flying hook.
- On a latch, a brass spark burst at the hook, and the chain goes taut and straight.
- An air bite opens a 6 px tall slit in the volt ramp. At 0.9 s it flickers as a warning. At 1.2 s it closes with a one-frame flash.

His body pose follows the swing: legs trail behind the direction of travel and the free arm reaches forward.
At the bottom of the arc his knees tuck.
On release he spins once in the air over 6 frames, then takes the fall pose.

## Guard and Chain Bind (K)

The shared guard (`src/game/hero/heroGuard.ts`) with his `GuardStyle` in `src/game/hero/orrin/guardStyle.ts`.
Held, the chain spins into a disc of links in front of his hand.
The block is weak: 35 percent of a blocked blow gets through, and each block costs 18 stamina.
The parry is strong.
Chain Bind: the chain whips out, wraps the foe that struck and hauls it out to the tip of his Lash, 52 px in front of him, in 0.16 s.
A minion is stunned there for 1.2 s, and the yank strikes it for 0.5x AD.
A mini boss or boss is held in place for 0.5 s and keeps fighting.
The parry gives 20 Momentum on top of the shared reward.
The bound foe is wound in brass chain until it is free (`src/game/hero/orrin/bind.ts`).
Undertow, his parry skill, holds longer, hits harder and drags more foes in.

## The dodge (L)

The shared front dodge.
Backline, his old yank back on L, is gone; the dodge and Chain Bind cover its job.

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

His abilities sit on the shared bar (`src/game/hero/abilityBar.ts`) through `ORRIN_SLOTS` in `src/game/hero/orrin/abilities.ts`, in this order: Whirlwall, Anchor Pin, Chain Fence, Tether, Anchor Fall.
Each has its own recharge.
I on a recharging ability casts the next ready one.
A long press of I casts the wide form for 1.5 times the MP, or the plain form when the MP bar cannot pay for it.

Whirlwall: 20 MP, 5 s recharge.
- He spins the chain over his head for 1.2 s and walks at half speed.
- The ring has radius 46. Every foe in it takes 0.35x AP every 0.2 s (six ticks) and is pushed outward 20 px.
- Every foe projectile that touches the ring is destroyed with a brass spark.
- Wide, Whirlpool: the ring is 1.5 times as wide, and it draws the foes in toward him, 36 px over the spin.

Anchor Pin: 24 MP, 6 s recharge.
- He hurls the hook down through the nearest foe ahead within 90 px for 2.0x AP and nails it to the floor: a minion is rooted for 1.8 s, a mini or boss for 0.6 s.
- The chain stays drawn from the floor spike to the foe while it is rooted.
- With no foe in reach, the hook strikes the floor 60 px ahead for a small dust burst and costs half.
- Wide, Stake Line: the chain splits and nails the three nearest foes within 90 px on either side, each for 0.7 times the power.

Chain Fence wide, Stockade: the same fences go up behind him too.
Anchor Fall wide, Anchor Ring: the same line of anchors falls behind him too; evolved, the rain already covers the screen.
Tether has no wide form.

## Special and ultimate

Grand Pendulum, with the shared charge levels (`src/game/hero/orrin/pendulum.ts`):
- A rift tear opens 70 px above him and he swings two wide passes under it, radius 90, across and back over 1.2 s.
  The tear opens far enough from the stage's sides that his widest swing stays on the stage.
- His body and chain hit every foe they pass for 0.5x the level's power, once per pass.
- At the end of the passes he lets go and crashes down. A brass and volt ring deals the level's full power within the level's reach.
- Beats:
  - 0.2 s of anticipation, him crouched with the chain swung overhead;
  - the tear opening with a flash;
  - the passes, with a brass arc smear and light from the tear;
  - the crash, with a 4 px screen shake, 0.08 s hit-stop and dust and rock chunks.

The ultimate skill `o_grandpendulum` upgrades it, read through `ultimateValues()`: more passes, foes dragged under the tear, a longer chain, chain shards, a stunning crash, and full turns round the tear.
Evolved, Maelstrom: four full turns in a circle as tall as the stage, and the foes drawn in under the tear burst together.
For the turns the tear drops to the middle of the stage, and he loops on round it the way the last pass went.
Maelstrom, once an ultimate skill that replaced the special, is now this evolution.

## The 20 skills

Ids are prefixed `o_`.
Data goes in `src/constants/characters/orrin/skills/`, behaviors in `src/game/skills/orrin/`, and icons (each skill and its `_evo`) in `src/ui/skills/icons/orrin/`.
Level tables go in `docs/skills/orrin.md`, written from the data in the same format as the other heroes' docs.
Budgets follow `docs/skill-design.md`:
- level 8 is about 6 to 12 times level 1, and up to 25 times for dot and summon skills;
- at least four of the seven level ups add a property;
- timed is about 1.6 times easy, and precise about 2.5 to 3 times easy;
- movement skills sit at about 0.8 of their band.

Kinds: attack 6, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 1.

| Id | Name | Kind, risk, button | Level 1 | Properties added along the levels | Evolution (partner) |
| --- | --- | --- | --- | --- | --- |
| o_sweetspot | Sweet Spot | attack, precise, J | tip hits +25% | tip band +4 px; a tip hit marks the foe (+10%, 2 s); Full Circle tips always crit; a tip hit refunds 4 stamina; mark +20% | Perfect Arc (o_perpetual): at 50+ Momentum every tip hit deals double and sends a 20 px shock through the foes behind it |
| o_ironweight | Iron Weight | attack, easy, J | string +15% | Full Circle radius +6; Rising Arc launches higher; Full Circle turns twice (second turn at half); foes knocked into others hit them for 0.5x | Wrecking Ball (o_reelsnap): the hook becomes a spiked iron ball, and Full Circle turns three times at radius 74 |
| o_skylash | Sky Lash | attack, timed, J in the air | two Hanging Arcs per airtime | a Hanging Arc above 160 px/s deals +50%; air arcs spike minions so they bounce; three per airtime; a spiked foe hits the foes it lands on for 0.5x; the arc throws a brass crescent 60 px on | Falling Star (o_pump): every air arc throws a crescent that pierces, and at 100 Momentum a second one follows |
| o_pendulumkick | Pendulum Kick | attack, timed, swing body | swing kick from 110 px/s, +25% | kicks launch minions; a pass that hits 2 or more foes gives back a hook; kicks stun 0.5 s; each foe can be kicked going and coming back; at top speed an afterimage kicks again 0.2 s later | Comet Heel (o_skylash): kicks leave a brass comet trail that burns foes under it, and the afterimage kicks every pass |
| o_gaff | Gaff | attack, precise, J held | the warp kick deals 2.4x, costs 6 MP and recharges in 1.5 s | a foe winding up reels 1.2 s and the kick crits; the thrown hook cuts every foe on its way; two warp charges; the kick hits a 26 px ring; recharge 1.1 s; a crit kick gives 20 Momentum; warp kick 6.5x | Harpoon (o_sweetspot): every foe within 80 px of the hooked one is dragged in to it before the kick, and the kick always crits |
| o_pump | Pendulum Pump | movement, easy, J held with W | pump +30%, air bite 1.6 s | hook range +12; fling +15% more; hook costs 4 less stamina; a third hook per airtime; air bite 2.2 s; hook range +24 | Skyline (o_friction): with 50+ Momentum hooks are not limited per airtime, and the chain cuts foes it sweeps through for 0.5x AD |
| o_reelsnap | Reel Snap | movement, timed, J held in a swing | a reel that reaches 1.3x speed snaps 0.8x AD at foes within 30 px | reel 220 px/s; the snap stuns 0.4 s; the snap gives back the Hanging Arc; the snap radius is 44; a snap at the bottom of the arc sends a shock along the floor | Whiplash (o_ironweight): every snap is a Full Circle at the swing point |
| o_undertow | Undertow | attack, precise, K parry | Chain Bind holds a minion 1.6 s and its yank deals 1.0x AD | the foe nearest the bound one is yanked in too; yank 1.8x; mini bosses and bosses are yanked in and held; the yank leaves a chain on the floor that trips; hold 2.2 s, yank 2.6x; the bound foe takes 30% more; yank 4.0x, two foes come in with it | Riptide (o_anchorfall): a parry yanks in every foe within 60 px of the one that struck, and binds them all |
| o_plumbdrop | Plumb Drop | movement, precise, S in a swing | lets go and drops straight down: 1.2x AD in a 28 px ring | ring 40 px; foes in it are launched; Momentum adds to the drop's damage; a drop on a foe's head crits; a drop gives back a hook | Meteor Anchor (o_gaff): the drop drives the hook into the floor for a 64 px quake and a 1 s root |
| o_chainfence | Chain Fence | spell, easy, I | 18 MP: two posts 60 px apart with a chain at knee height. A foe crossing it takes 1.2x AP and stumbles 0.4 s. Lasts 5 s | 80 px long; two fences at once; foes crossing are slowed; the chain sparks every 0.5 s for 0.3x AP to foes near it; lasts 8 s | Razor Fence (o_barbs): the chain is barbed, every crossing adds 3 bleed stacks, and the fence follows him |
| o_tether | Tether | spell, timed, I | 22 MP: chains the two nearest foes together for 4 s and shares 30% of the damage one takes with the other | three foes; 45% shared; foes pulled more than 70 px apart are yanked together and collide for 1.5x AP; lasts 6 s; when a tethered foe dies, the others take 2x AP | Chain Gang (o_bell): every foe on screen is tethered in one chain |
| o_anchorfall | Anchor Fall | spell, timed, I | 26 MP: an iron anchor drops from a rift 50 px ahead for 3.0x AP in a 26 px ring, stun 0.6 s | a second anchor 30 px further; the anchors leave a chain between them that roots for 0.8 s; the ring is 36 px; the drop pulls foes 20 px in first; three anchors | Iron Rain (o_tether): five anchors fall across the screen, each 6x AP |
| o_barbs | Barbed Links | dot, easy, J | chain hits add 1 bleed stack (0.12x AD a second, 6 max, 3 s) | 2 stacks on tip hits; 10 max; swing kicks add stacks; bleeding foes take +10% from the chain; 0.3x AD a tick | Flay (o_chainfence): a Full Circle tip consumes the stacks for 1.2x AD each |
| o_rust | Rust Bite | dot, timed, J held and K parry | a foe the warp kick or Chain Bind catches rusts: 0.2x AD a second for 4 s | rusted foes take +15% from every source; rust spreads to one foe it touches; Anchor Pin rusts; rust 0.45x a second; rusted foes slowed 20% | Corrode (o_gaff): rust on a foe that dies bursts for 3x AD and rusts every foe in 40 px |
| o_friction | Friction Burn | dot, timed, swing and Full Circle | foes the chain sweeps in a swing or a Full Circle are ignited (the shared `ignite`) | the burn lasts longer; the burn spreads on a kill; a burning foe takes +20% from the swing kick; stronger burns; a brass flame trail on the chain at 100 Momentum | Scorched Arc (o_pendulumkick): every swing leaves a burning arc in the air that hits foes passing through |
| o_kite | Brass Kite | summon, easy, on letting go | 20% chance: a brass kite on a string trails behind him for 6 s and dives at the nearest foe for 0.6x AD every 1 s | 35% chance; two kites; kites dive in pairs; a kite dive chills; kites last 10 s | Sky Armada (o_pump): four kites circle him all the time and dive with every swing kick |
| o_bell | Rift Bell | summon, timed, on a tip hit | 12% chance, cooldown 2 s: a bronze bell drops on a chain from a rift above the foe and swings through it twice for 0.8x AD | stun on the first swing; the swing also hits the foes beside it; a toll ring for 0.4x AP; two bells; swings 3 times | Great Bell (o_tether): the bell is twice the size, and its toll stuns everything on screen for 0.5 s |
| o_twin | Twin Chain | summon, precise, on a Slip or a perfect dodge | a shade of Orrin appears and does a Full Circle at 1.0x | the shade gives +10 Momentum; two shades; the shade hooks and swings once; the shade copies his next Hanging Arc; 2.0x | Mirror Dance (o_sweetspot): every Slip calls three shades whose tip hits all crit |
| o_perpetual | Perpetual Motion | passive, easy | Momentum empties half as fast | Momentum bonus up to +50%; +5 Momentum a second on the floor while walking; Momentum never falls below 30; hurts cost 15; +60% at full | (passive: an evolution partner only, no evolution of its own, as passives allow) |
| o_grandpendulum | Grand Pendulum | ultimate, timed, U | three passes, each 0.6x the level's power | each pass drags the foes it meets under the tear; radius 110, 0.8x; chain shards on the floor each pass, 0.5x; the crash deals 2x and stuns 1 s; a full turn round the tear after the passes; 1.2x; two turns, passes 1.4x, crash 3x | Maelstrom (o_pump): four full turns in a circle as tall as the stage, and the foes drawn in under the tear burst together for 8x |

If the skill contract does not allow a passive with no evolution, `o_perpetual` evolves into Endless Motion (o_kite): Momentum never empties while a kite is out.
Ultimate budget: level 8 about 6 times Grand Pendulum's cast, evolved about 15 times.

Events his kit emits:
- `cast` for each ability;
- `jump`;
- `dash` on each release, with `dir`;
- `perfectDodge` through `rewardPerfectDodge`;
- a kit event `latch: { kind: "anchor" | "platform" | "air" }`, declared in `src/types/orrin.ts`, the same way Hulda declares `grab`.
The shared warp and parry emit `warp` and `parry`.

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
- every blow, the hook throw, the swing, the reel, the release roll, the bend before a jump, the ledge pull, the warp kick, both ability clips, the charge pose and the special.

Walk, jump, fall, hurt, death, the warp's throw, the guard and the dodge use the shared clips through the motion layer, to `docs/motion-standard.md`, with a light 24 px stride.
The idle chain loop and the swing pose must hand over without a pop: 2 frames of crossfade into the swing pose on latch, and out of the release roll.

## Achievements

- `heroTrial("orrin", "Orrin")`: clear wave 10 with him, 40 coins.
- New: Full Swing (group Skill, 60 coins): "As Orrin, defeat 3 foes with swing kicks in one swing." One swing runs from latch to letting go. It is tracked as a best-of-run stat in `src/utils/trackedStats.ts` and listed in `docs/achievements.md`.

## Shop items (docs/meta-progress.md)

- Vitality: his HP.
- Honed Edge: the string, the swing kick, the warp kick, Chain Bind's yank and every attack skill scale with `progress.stats.ad`.
- Arcana: Whirlwall, Anchor Pin and the spell skills scale with `progress.stats.ap`.
- Wellspring: abilities and the ultimate spend MP.
- Precision: every hit goes through `dealDamage`.
- Light Boots: his walk, the swing pump and the reel speed scale with `progress.stats.move`.
- Endurance: swing hooks, reels, blocks and the dodge spend stamina.
- Aftershock: every release, fling landing, ledge pull and warp calls `travelEnded()`.
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
  W is also the jump, so the swing hook from the floor starts with a jump: W and J held together.
- The hook bites the air at the edge of the stage, and a swing into either side of the stage stops there, so he never hangs against a wall with his speed kept.
- A chain blow strikes any foe whose body crosses the swept arc.
  Measuring only to a foe's centre left the flat Lash unable to reach short ground foes.
- Grand Pendulum measures its chain from the floor under him when it is cast and passes through the low platforms, so its passes keep their 90 px reach in the middle of the stage.
- The moveset rework (13 November 2026, `docs/moveset-design.md`): the hook on a foe became the shared warp with a flying kick that binds, the swing moved to J held with W, the reel to J held while swinging, the guard and Chain Bind came in on K, Backline went away for the shared dodge, Undertow became the parry skill, Gaff the warp skill, and Maelstrom the evolution of the new Grand Pendulum skill.
- Perpetual Motion level 4 holds Momentum at 30 or more, since the skill is always taken mid-run and a run start would never see it.
- Full Swing counts foes his swing kicks defeat between one latch and letting go, as the best-of-run stat `swingKills`.
- Every skill's own hits carry its id as the damage source, so the end-of-run screen lists them by name.
- Tip hits curl round a guard (`curls` in the shared hit options).
  Walking thornbacks and husks hold their guard toward him, so without this his Lash tips at 46 to 64 px landed as blocks in ordinary fights.
  Inner hits are still blocked, so spacing keeps its point.
- A hook thrown in the air hangs him while it flies (gravity 0.3, falling at most 60 px/s), so a second air bite can catch before he lands.
- A hook that reaches the stage's edge less than 24 px from his hand falls short: no swing, and its stamina and air hook come back.
- Anchor Pin targets only foes standing on a floor, and never a kind that flies even when one hovers level with a ledge (fixed in 0.6.0), since it nails them there, and its stake goes in 4 px in front of the foe's body with the chain drawn in front of the foes, so the pin reads at game scale.
- Anchor Pin holds every foe where it is pinned: the shared foe step keeps a pinned foe's place whatever its own step asks for, and a pinned thornback cannot start or keep a charge.
- The sash is drawn as a short strip of cloth from the belt that tapers, folds and splits at the end, and it takes half the scarf's breeze.

## Balance check

Playtest bot runs, one run each (runs are deterministic), from wave 1 with no shop upgrades.
Before is the shared moveset core (`SainyTK/unified-moveset`) with his old kit on provisional warp and guard; after is this rework.

| Build | Mash: death wave | Mash: kills | Skilled: death wave | Skilled: kills |
| --- | --- | --- | --- | --- |
| Before the rework | 5 | 18 | 5 | 18 |
| After the rework | 5 | 18 | 10 | 50 |

The mash bot only taps J, and his string is the same as before, so it plays the same run.
The skilled bot holds J for the warp kick, dodges and casts, and goes five waves deeper.

## Note for the owner

The skilled playtest bot reads the HUD tabs and holds J for the warp when the WARP tab is ready, so it plays his warp kick, guard, dodge and abilities.
It never holds W with J, so it never swings; a policy that swings would hook a crystal or the air, pump toward the swing, let go on the forward upswing and lash with J at foes 46 to 64 px away.
