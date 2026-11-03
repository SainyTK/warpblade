# Pick pacing

A run is 30 waves.
Every level up gives Kael one skill point, and the points wait until the wave is cleared.
When the wave's last foe falls with points waiting, the game pauses on a pick of three cards for each point, before the pause to the next wave.
The fight itself is never paused by a level up; only the Level banner shows.
Points left when wave 30 falls are not spent, since the stage and the run end there.

## How many picks a run gives

The numbers below come from adding up the experience of every foe in the wave plan (`src/utils/waves.ts`) against the curve in `src/constants/progression.ts`, assuming every foe dies.

- Experience drops as orbs that Kael picks up; the numbers assume he collects all of it, which he does because left orbs fly to him.
- The curve is twice the first one (base 48, step 26). Kael reaches about level 4 at wave 5, level 11 at wave 19 and level 18 at wave 30.
  The first curve reached 5, 16 and 26.
- Level ups give about 17 skill points in a full run, two more with the shop's Head Start.
- The skill tree holds 54 ranks that one run can learn, counting one skill from each group that locks out its rivals, so a full run learns about a third of it.
  Five of them are the abilities Kael no longer starts with: Warp Strike, Fire Flask, Ice Spikes, Lightning and Crystal Nova.
- Every level gate is still reached: ultimates (levels 11 to 13) between waves 17 and 20, and the six-hit combo (level 17) near wave 28.

## When cards run short

If fewer skills than cards are left, Second Wind (`src/constants/boons.ts`) fills the rest and restores all HP and MP.
With about 17 points against 54 ranks this does not happen in a normal run.
