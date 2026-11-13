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
A move that touches down and settles into the stand a step later still gets its landing.

## Jump take-off

Every hero follows one take-off rule.
A jump from the floor out of a stand, a walk or a run loads for two animation frames (`JUMP_LOAD` in `src/constants/takeoff.ts`) with a visible knee bend, then leaves the floor.
A jump out of a blow's follow-through, out of a dash, a double jump, a jump off a crystal and a hop in the air leave at once.
The load keeps the hero's speed, so a running jump goes as far as before, and the stride keeps stepping under the bend.
Nothing else starts during the load: a press of J, L or a skill waits in the input buffer and acts as soon as the hero is in the air.
A hit or a fall off a ledge cancels the load.
`src/game/hero/takeoff.ts` owns the load (`takeOff` in each hero's jump press), and `loadPose` (`src/game/hero/kael/load.ts`) poses it for every hero.
From a stand a hero with a crouch of its own sinks into it (Hulda's `JUMP_CROUCH`, Orrin's `TAKEOFF_CROUCH`, Mirel's `MIREL_CROUCH`, the squat Ysra's jump clip starts from); every other load adds `LOAD_BEND` to the stand or the stride.
The jump's hand-over then crosses from the crouch into the rise.
The smoke check expects the hero off the floor 120 ms after W, so the load stays at two frames.

## Hand-overs

The pose shown last is where the next clip starts from.
Clips of one hero start and end on that hero's guard or stand, so a string of blows chains without a jump.
When a hand-over cannot be authored (a blow cancelled into a jump, a dash out of a cast), the pose crosses from the last pose into the new clip over a few even frames.
Blows cross in no more frames than they have before their hit frame, so the wind-up still reads.
Hits taken and warp arrivals cut at once, because the cut is what the player has to read.
A turn swings the limbs through to the new facing over two frames.
Between a stand and a stride on the floor the feet step to their new places: a planted foot that must move lifts and sets down, the farther foot first and the other behind it, so a stop never slides the feet through each other (`STEP`).
A stride that stops crosses into the stand over four frames.

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
Sable, Tallis, Wenna, Orrin, Mirel, Jory and Brannoc pose through the same layer, so they share the travel load, the stop settle and the stepping feet.
Jory's idle rides his beat instead of a clip clock: the near mallet rises through the second half of each beat and taps down on it, and his head nods on the beat in his idle, walk and run (`src/game/hero/jory/pose.ts`).
Brannoc carries his great axe on the near shoulder through the shared walk, run, jump and fall, so it never cuts through his body, and while Bloodied his own heaving idle with the axe dragging takes the place of the shared wounded idle (`src/game/hero/brannoc/pose.ts`).
`jumpClock.ts` runs the jump clip on the rise, so the top key lands on the real apex of every jump, hop and double jump.
`landing.ts` plays the landing clip (`SETTLE_CLIPS.land`) or a hip dip in a stride, scaled by the fall speed.
`handover.ts` crosses every change of clip or facing, with lengths in `HANDOVER_FRAMES` and `TURN_FRAMES` (`src/constants/kael/motion.ts`).
`hangSwing.ts` swings the body in under a crystal he warps to, dying away into the hang's sway.
His walk and run clips were rebuilt from a gait model, and the kit's `stride` hook samples them by ground covered.
`travel.ts` gives every walk, run and dash from a stand a load (the hips drop and the chest leans in over the first frames, `TRAVEL_LOAD`), and settles a walk, run or dash that stops on the spot, and Tallis's rise out of his pool, onto the knees through the landing clip (`STOP_DEPTH`).
The landing crosses from the fall over `LANDING.cross` frames, so the arms come down through the touchdown.
His blows cross from the last pose over two frames (`HANDOVER_FRAMES.move`).
The ground string and the air string are keyed with the wind-up reached by frame 2 and held to the strike on frame 5 (the smash on frame 7), and `onFrame` (`src/constants/combo.ts`) sets each blow's `at` so it is dealt on that key.
The blows his skills put in the string and in the air (the sweep, the crescent turn, the phase cut, the hop cleave, Skybreaker, the whirlwind and the meteor drop) are keyed the same way, so every blow runs on the plain move clock.
