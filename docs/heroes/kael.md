# Kael

Kael is the spell swordsman, the warp knight.
He throws his crystal longsword, appears where it lands, and casts elemental spells into his sword string.
His kit, numbers and skills are in `docs/skills/kael.md`; this note covers his look and his second job.

## Identity in the roster

Kael is the only hero who casts elemental spells into his sword string.
His colour family is crystal cyan: the menu accent `#7fe3ff`, his sword's light, his slashes, rings, warp line and sparks (`PAL.crystal`, `SPARKS.crystal`).

## Look

He is drawn on the shared rig from `src/heroes/kael/look/`, in the JRPG look language of the sword roster.

- Hair: silver, in four large swept-back spikes from the crown and the back of the head, a fringe lock over the brow, and a long tied tail with a crystal cyan band.
  Each spike has a deep blue shadow strand, a silver middle and a white glint on the top one.
- Face: one large crystal blue eye.
- Outfit: a midnight blue long coat over a steel breastplate and a single pauldron on the sword arm with a crystal set in it.
  Below the belt the coat splits into a long tail at the back, lined in crystal cyan, and a short front panel, both with a brass hem.
  A leather strap runs across the chest from the sword shoulder to the far hip, held by a brass clasp with a crystal.
  Dark trousers, plate knee guards, tall brown boots with brass bands and dark gloves stay from his first look.
- Scarf: his signature red scarf, now wider, splitting into two ends.
- Sword: the crystal longsword, longer and broader than before (reach 19 pixels).
  A crystal pommel, a wrapped grip, a brass guard whose wings sweep toward the blade around the warp crystal, then a broad cyan blade with a lit edge, a dark fuller and a clipped white point.
  The thrown sword in the warp (`game/effects/thrownSword.ts`) is drawn to the same shape.
- Colours: midnight blue and silver as the two main colours, crystal cyan as the accent, brass as the metal trim, and the red scarf.

## How the parts move

Every new part is drawn from the rig frame only, so the stage, the portrait and the afterimages match.

- The spikes and the fringe follow the head.
- The hair tail runs on the ponytail rope and the scarf ends on the scarf rope, so both trail behind travel and settle when he stops.
- The coat's long tail flares with speed and swings with the scarf rope's lag behind the neck, so it trails and settles with the scarf.
- No pose, clip, timing or hitbox changed for the new look.
  The sword's reach is only drawn: it sets the blade's light and nothing in play.

## Hero screen

Title: "The warp knight".
Blurb: "A spell swordsman. He throws his crystal sword, appears where it lands, and casts spells into his sword combo."
He stands in the shared rest pose, and the longer sword still fits the portrait (its point ends inside the 6 pixels below the feet).

## Second job: the Prism Knight

Kael is the first hero with a second job (`docs/hero-module.md`, Jobs).
His own job is the Warp Knight, and it plays exactly as above.
The Prism Knight is the warp knight who set his crystal into his own guard: the same buttons, warp, dodge, abilities, stats and ultimate, with a string that lodges prism shards in foes and finishers that break them.
Nothing in the job turns him around, carries him far or attacks on its own.

It opens when Kael defeats Oakheart in a solo run (`{ kind: "heroWave", hero: "kael", need: 5 }`, unlock id `job-kael-prism`).
A save that has already cleared wave 5 with Kael has it open on first load.
The data is `KAEL_JOBS` in `constants/jobs.ts`; the job id is `PRISM_JOB` in `constants/prism.ts`.

### Look

`look/prism/`: Kael's figure, hair and sword in new colours, with his own arm part replaced by one that adds a crystal pauldron.

- Coat: `#e8e4f6`, `#b9b0d8`, `#7f74a8`, `#4a3f72`, light to deep.
- Scarf: `#b673e8` and `#7a3cb0`, with the dark step from `PAL.shadow`.
- Trim: the steel steps in place of brass.
- Eye: `#a9c8ff`.
- Blade: the same crystal longsword with its fill in the prism ramp.
- Pauldron: three faceted crystal plates on the sword shoulder, overlapping down the arm like scales, the top one widest, each lit from the top left with a white glint and outlined where it overlaps.
  It is drawn with the sword arm (`look/prism/pauldron.ts`) so the arm never covers it, and the plates follow the upper arm halfway, so a raised arm still reads as a shoulder.
- Effects: `PAL.prism` (`#2a1660` to `#ffffff`) and `SPARKS.prism`, so trails, the warp line and hit sparks turn prism.

Hero screen title: "The prism knight".
Blurb: "The warp knight who set his crystal into his own guard. His blade lodges prism shards in foes, and his finishers break them."
Chip colour: `#b9a2ff`.

### Prism shards

A per-foe stack, `k_prism`, at most 3 per foe.
Each new shard resets a 6 second timer, and when it runs out every shard on that foe falls away.
Shards sit across the foe's chest as small crystal diamonds, 3 by 5 art pixels and 2 apart, with a faint light, and blink at 6 Hz through their last second.

One shard is lodged by:

- Prism Thrust, in each foe it strikes;
- Warp Strike's arrival blow, in its target (the counter blink after a parry lodges none);
- the parry's riposte cut, in the attacker it strikes;
- each prism beam of Crystal Nova, in each foe it crosses.

Any finisher of the ground string shatters them: Shatterfall, and Keen Edge's hop cleave and Skybreaker when those skills take the finisher's place.
On the finisher's hit frame every foe within 56 pixels of the impact point (22 pixels ahead of Kael, at his feet) loses all its shards and takes 0.55 times attack damage per shard in one hit of his attacks, which can crit.
Each shard bursts with a white flash, 4 to 6 prism flecks and a light that falls away over 0.25 seconds, and each foe rings once with a high glassy tone.

### The string

The step cut and the rising backhand are unchanged.
Skills that replace blows keep their place and win over the job: Reaping Sweep (level 5) and Phase Cut as the 3rd blow, the hop cleave and Skybreaker as the finisher.
Phantom Passage closes on Shatterfall as it does on the smash.

| Blow | Clip | Frames | Hit | Box | Power | Knockback | Stride | Feel (stop, shake, pitch) | Cancel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Prism Thrust (3rd) | `prismThrust` | 13 | frame 5 | [0, -26, 44, -10] | 1.5 | 18, -10 | 120 px/s, frames 3 to 6 | 0.08, [0.14, 1.8], 1.1 | 0.1 |
| Shatterfall (finisher) | `shatterfall` | 16 | frame 7 | [-2, -42, 36, 2] | 2.1 | 50, -60, stun 0.8, knockdown, wall | 200 px/s, frames 3 to 7 | 0.15, [0.26, 3.2], 0.7 | `STRING_CANCEL.finisher` |

Prism Thrust draws the blade back level at the hip with the chest pushed back and the front foot lifting (frames 0 to 4), lunges long with the arm fully out and the blade level (frame 5), holds the extension (to frame 9) and recoils to guard (frames 10 to 12).
Its slash is a long narrow thrust crescent in the prism ramp.
Shatterfall rises onto the toes with the blade straight up overhead while four prism motes gather on its tip (frames 0 to 4), cuts straight down into the floor (frames 5 to 7), holds a deep crouch with the point in the floor for 0.2 seconds and rises.
Its hit adds a vertical crescent and a floor ring of radius 30 in the prism ramp, dust, rubble and the shatter.

Balance basis: the Warp Knight's 3rd blow and finisher total 1.6 + 2.35 = 3.95 attack.
The Prism Knight's total 1.5 + 2.1 = 3.6 with no shards, and 4.15 with the one shard his own thrust lodges.
Shards from the warp, the parry and the Nova bring more, so the job trades a little raw string damage for a payoff that rewards setting foes up.

### Crystal Nova

The same ultimate with the same charge, MP, recharge, ring and every value of `k_nova`, and the same name everywhere.
As the Prism Knight it adds six prism beams (`game/ultimate/nova/beams.ts`, numbers in `PRISM_BEAMS`):

- 0.12 seconds after the first ring bursts, from Kael's chest, at 0, 35 and -35 degrees to each side;
- each 1.5 times the ring's radius long and 3 art pixels wide, growing over 0.08 seconds, holding 0.1 and thinning away over 0.25;
- a white core, the prism ramp at the edges, a light along the length and a white star at each tip;
- each foe a beam crosses takes 0.2 times the ring's blow once from that beam, as his ultimate, and gets a shard.

The beams are added in `castKaelUltimate` (`game/ultimate/castUltimate.ts`), so the Warp Knight's Crystal Nova is unchanged.

### Controls

The Attack and Guard lines on the Controls screen and the touch controller say what the shards do (`constants/prismControls.ts`); every other line is Kael's own.

### Co-op

Rooms play the Warp Knight for every seat in this version, and the lobby has no job row.
