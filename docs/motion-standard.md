# Motion standard

The owner called Ysra's reworked movement "so smooth" and made it the standard for every hero.
These are the rules behind it, measured on Ysra at 0ec91c0 and applied to Kael afterwards.
Every hero shares one rig and one 30 fps animation clock, so the rules are stated in rig joints and animation frames.

## How smoothness is measured

Film the real game one animation frame at a time and compare the rig between neighbouring frames.
A pop is a hip, neck, hand or foot that jumps more than 4 px between two frames when nothing in the fiction makes it jump.
A blow's hit frame is the one planned exception: it snaps on purpose.
Planted-foot drift is how far a foot on the floor moves along the floor in one frame; it should be near zero.
The harness, filmstrips and numbers for the Kael rework are in the task log of T-mac-180.

## Clip time follows the physics

A clip that goes with travel is timed from the same numbers as the travel.
Ysra's vault times (`VAULT_TIMES` in `src/constants/ysra/stance.ts`) come from the vault's rise and gravity, so the landing key lands on the real landing.
When the physics can run long or short, the state code steers the clip clock: it holds the airborne key until contact and jumps to the landing key on contact.
A jump clip ends on the top of the arc, so its last key is reached when the rise stops, whatever cut the rise short.
A held state (a brace, a charge) loops a middle segment of its clip and plays its reactions as segments that return to the loop.

## Weight before and after travel

Travel starts with a load: a plant, a dip or a wind-up of at least two frames that moves the body against the travel.
A blow shows its wind-up for at least one calm frame between the hand-over and the hit frame; Ysra holds four to six.
Travel ends with a recovery: the knees take the landing, the hips sink and rise back into the stand the next clip starts from.
A landing is never a cut from the fall pose to the standing pose.
The harder the fall, the deeper the landing, and a landing in a stride is a dip of the hips without stopping the feet.

## Hand-overs

The pose shown last is where the next clip starts from.
Clips of one hero start and end on that hero's guard or stand, so a string of blows chains without a jump.
When a hand-over cannot be authored (a blow cancelled into a jump, a dash out of a cast), the pose crosses from the last pose into the new clip over a few even frames.
Blows cross in no more frames than they have before their hit frame, so the wind-up still reads.
Hits taken and warp arrivals cut at once, because the cut is what the player has to read.
A turn swings the limbs through to the new facing over two frames.

## Blows

A blow winds up the opposite way first, snaps to a new silhouette on the hit frame, holds it while the hit-stop runs, then follows through and settles.
The hit frame is the one frame allowed to jump; every other frame moves in even steps.
A string's next blow starts from roughly where the last one's follow-through left the body.

## Keys and loops

Keys sit every two frames, eased between, with `snap` only on hit frames.
A loop's last key flows into its first, so the wrap is no bigger a step than any other.
An idle breathes in under a pixel per frame.

## Strides

Walk and run clips are sampled by the ground covered, never by time.
The planted foot sweeps back under the hips by as much floor as the hero covers while it is planted, so it holds the floor.
The stride length is a constant next to the clip (`STRIDE` for Kael); a faster hero takes longer or quicker strides, never sliding ones.

## Where Kael meets it

Kael's pose layer is `src/game/hero/kael/`: his kit's `pose` wraps the shared clips with the rules above, so Ysra's path is untouched.
`jumpClock.ts` runs the jump clip on the rise, so the top key lands on the real apex of every jump, hop and double jump.
`landing.ts` plays the landing clip (`SETTLE_CLIPS.land`) or a hip dip in a stride, scaled by the fall speed.
`handover.ts` crosses every change of clip or facing, with lengths in `HANDOVER_FRAMES` and `TURN_FRAMES` (`src/constants/kael/motion.ts`).
`hangSwing.ts` swings the body in under a crystal he warps to, dying away into the hang's sway.
His walk and run clips were rebuilt from a gait model, and the kit's `stride` hook samples them by ground covered.
His blows cross from the last pose over the frames before their first hit (2 to 4, `WINDUP`).
`windup.ts` runs the clock of a blow whose first hit comes before 0.1 s at 0.65 until that hit, so the wind-up holds a beat before the snap (the string's 0.065 s of clip to the strike now take 0.1 s).
