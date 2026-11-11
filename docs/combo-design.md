# Combo design: fixed strings

Kael's sword combo takes its structure from the classic side-scrolling action RPG Grand Chase (KOG, 2003).
The moves, their names and their timing are Kael's own; nothing below copies a Grand Chase character's moveset.

## What the reference does

Sources: the Grand Chase Fandom wiki pages for the Knight, Assassin, Thief, Spell Knight and Abyss Knight job classes, and two old player guides.

- Each press of the attack key in the basic five-hit string is its own animation: the Knight swings three times, stabs twice, then ends with a slash that knocks the foe down.
- The last hit of the basic string always ends in a knockdown or a launch, so a string has a clear end.
- Inputs inside the string branch it: Up held during the first hits turns the next J into a launcher (a tapped Up still jumps out of the follow-through), and the following press leaps after the foe to finish it in the air.
- Timing matters as much as direction: the same dash input pressed in the middle of the string gives a "Critical" downward cut, and pressed after the last hit gives a "Double" attack.
- Dash attacks are short strings of their own (a slash, then up, then down), and some chain back into Critical or Double.
- Air attacks are separate from ground attacks, and Down in the air drops fast to the floor.
- Experienced players cancel the string before the knockdown hit and start it again, which the game allows and the PvP crowd calls a loop.

## The combo layer every hero shares

In the reference a blow that lands makes the monster flinch, so a string locks its target and plays out to the end.
Every hero's blows go through the same three rules, in `src/game/enemies/stagger.ts`, `src/game/damage.ts` and `src/game/hitCount.ts`, with the numbers in `STAGGER`, `GUARD` and `HIT_COUNT` (`src/constants/combat.ts`).

- Stagger: a hero's blow that carries `stagger` cuts whatever a minion was doing, a wind-up or an attack already under way, and the minion cannot act until the stagger ends. It slides to a stop, and a walker caught in the air drops to the floor.
- The blow stops a charge or lunge where it was hit, so a staggered foe never slides through the hero. When the stagger ends the foe waits 0.35 seconds before it may attack, walk on or hurt by touch.
- Mini bosses and bosses never stagger, so their attacks still have to be dodged.
- A minion staggered 7 blows in a row (an elite 4) braces: sparks fly off it and it cannot be staggered for 1.6 seconds, so no string holds one foe forever. The count starts again after a second without a stagger, and at once when the foe is thrown up or knocked down, so a string that ends in its finisher never braces its target.
- Guard: a guarding foe blocks the first frontal light blow, which still staggers it, and the next blow lands. A heavy blow still knocks the guard down at once. A staggered foe cannot guard.
- A struck foe is drawn knocked 2 pixels away from the hero and eases back while its hit flash lasts. A staggered foe is drawn tipped back from the blow and rights itself as the stagger runs out, and a walker knocked off its feet is drawn tipped far over until it gets up.
- Pace: the whole fight runs at `PACE` (0.8, `src/constants/stage.ts`) of real time, heroes, foes and effects alike, so every number in the constants is in game seconds and takes 1.25 times as long on screen. Hit-stop is counted in real time.
- Hit counter: the hero's own hits in a row show at the right of the stage from 3 hits, pop on each hit and change colour at 10, 25 and 50. Two seconds without a hit, or a blow taken, ends the row. It counts the same hits Flow counts.
- Burning ground and brands that used to slow walkers through `stagger` now use `halt`, which only holds a walker's feet.

### One string, the same every time

Pressing J on the ground plays the hero's string in the same order wherever foes stand.
The game never picks a blow from the foes around the hero, and the normal attack never turns the hero around; the hero faces where the player last pointed.
A blow changes only when a learned skill says so, and then it changes every time.

### The string contract

Each hero's ground string must hold to these, measured on a lone walker (a thornback or husk) with J pressed about ten times a second:

1. Every blow of the string lands from any starting distance inside the first blow's reach. Blows before the last push the foe a few pixels at most.
2. Each blow before the last staggers long enough to reach the next blow, so the foe never starts a wind-up inside the string.
3. The last blow has a payoff of the hero's own (a knockdown, a launch, a pin) that keeps the foe out of the fight until the next string's first blow can land.
4. The pause from the last blow to the first blow of the next string is as short as the hero's weight allows: light heroes about half a second, heavy ones under a second.

## What Warpblade takes from it

- Every hit of the ground string has its own pose, footwork, slash shape and reaction, so the string reads as a routine: step cut, rising backhand, twin thrust and a falling smash that knocks down.
- The string is fixed at four hits (`CharacterDef.comboHits`), since a game full of knock-ups gives a player one or two hits before a dodge.
- Skills change which blow fills a place in the string, never its length: Reaping Sweep opens with the low sweep, Phase Cut and the crescent turn take the third hit, Skybreaker and a Keen hop cleave take the last (`docs/skills/kael.md`).
- The reference changes the whole body on every hit, so each of Kael's hits has its own silhouette at a glance: hip height from a deep crouch to airborne, the torso leaning far ahead or back, wide leg spreads, the back turned in spins, and the arms overhead.
- Each blow is keyed as an anticipation the opposite way, reached by frame 2 and held to the hit frame (frame 5, the smash frame 7), a snap to the strike pose, an overshoot held through the hit-stop, a follow-through onto the front foot and a keyed recovery to guard (`src/constants/clips/string.ts`).
- The blows skills put in the string are keyed the same way: the sweep, the crescent turn's front cut and the phase cut strike on frame 5, the crescent turn's cut behind on frame 10, Skybreaker on frame 7 and the hop cleave on frame 8, the frame it lands (`src/constants/clips/skills.ts`, `ground.ts` and `finishers.ts`).
- The tempo, in real seconds from one blow landing to the next with J pressed in time, is about 0.45 through the string, 0.5 into the smash and 0.6 from the smash to the next string's step cut (`STRING_CANCEL` in `src/constants/kael/string.ts`).
- The skill blows keep that tempo: about 0.47 from the sweep or the phase cut to the next blow and 0.5 from the crescent turn's cut behind into the smash (`SKILL_CANCEL` in `src/constants/kael/skillBlows.ts`); Skybreaker lands 0.5 after the 3rd hit and the hop cleave 0.55, and the next string's first blow lands about 0.6 after either.
- Hit-stop, shake and sound grow through the string, and the smash is by far the heaviest (`STRING_FEEL`); a skill blow takes the hit feel of the place it fills, and Skybreaker and the hop cleave are as heavy as the smash (`SKILL_FEEL`).
- The smash closes the combo once its follow-through starts, so J then starts the next string over its recovery; this stands in for the combo cooldown, and the same holds for every last blow that sets its own `cancel` (Skybreaker, the hop cleave).
- Kael's feet stay planted for every hit of the string, and the blows push the foe back only a few pixels, so it stays in reach for the next one.
- Only moves that end or open with travel move him: the smash that ends every combo, Phase Cut's pass, Skybreaker's slide in and launch, and the hop cleave's hop.
- Reaping Sweep's drag stops a foe at Kael's feet, so the sweep never pulls it past him and out of the next blow's reach.
- The last hit a combo allows is always the knockdown smash, at every combo length, so short combos at level 1 still end with a payoff.
- J on the ground plays the same string in the same order wherever the foes stand: in front, behind, on both sides, in the air or lying down.
- No blow turns Kael around; he faces where the player last pointed.
- A heavy blow that drives a foe into the edge of the stage bounces it back off the wall and into the air.
- No skill asks for a direction, a dash or a double tap during or after a combo; the old extended inputs (launcher, low sweep, Phase Finish, Skybreaker, dash strike, running thrust, meteor drop) were folded into the string's own hits, the dash and the warp.
- The Critical and Double timing idea becomes Keen timing: a J pressed in the short moment after a blow lands makes the next blow a sure critical hit.
- Mashing spoils Keen timing, because any J pressed before the current blow has landed cancels it, so rhythm pays and mashing does not.
- Air attacks share no shape with the ground string, and each holds a three-frame wind-up before its strike: a wheel slash that circles his whole body while he rolls in a ball, a scissor cut that lays him back with one leg kicked high and sweeps the blade under his feet, and a stomp that drops him feet first with his arms thrown up.
- Kael starts with two air attacks per jump (wheel and scissor cut). Sky Dance adds the stomp, so three is the most, and a double jump adds none.
- The stomp spikes what is under him on the way down and knocks foes on both sides off their feet when he lands.
- Sky Dance's whirlwind and meteor drop hold the same three-frame wind-up: the whirlwind twists away with the blade over the far shoulder, then cuts in front, behind and in front on frames 5, 8 and 11; the meteor drop tucks with the blade raised and dives on frame 5 with the stomp's own fall.
- The launch still pays: Skybreaker lifts Kael 40 px with the foe and throws the foe just high enough that a J pressed once its follow-through starts begins the air string within reach of it, with the same limit (`SKYBREAKER` in `src/constants/kael/skillBlows.ts`).
- Nothing done in the air carries Kael above his jump: attacks, casts and the special charge keep full gravity while he rises and only hang once he starts to fall.
- Moves that lift Kael on their own, like Skybreaker and the whirlwind, rise by their own height but never past the top of his last jump, and a lift never adds to a rise he already has.
- Hit feel is set per hit: hitstop, screen shake, sound pitch, slash shape and color, afterimages on the fast footwork, and how early the next press may cancel the follow-through.

## What Warpblade leaves out

- No grabs or throws, since Kael's identity is the warp and the thrown sword.
- No loop cancel before the finisher: the combo has a fixed length, which keeps the guard and evade difficulty meaningful.
- No job classes; the skill choices between waves play that role.
