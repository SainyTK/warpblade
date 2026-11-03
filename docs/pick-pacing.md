# Pick pacing

A run is 30 waves.
Every level up gives Kael one skill point, and the points wait until the wave is cleared.
When the wave's last foe falls with points waiting, the game pauses on a pick of three cards for each point, before the pause to the next wave.
The fight itself is never paused by a level up; only the Level banner shows.
Points left when wave 30 falls are not spent, since the stage and the run end there.

## How many picks a run gives

The numbers below come from adding up the experience of every foe in the wave plan (`src/utils/waves.ts`) against the curve in `src/constants/progression.ts`, assuming every foe dies.

- Kael reaches about level 5 at wave 5, level 16 at wave 19 and level 26 at wave 30.
- Level ups give about 25 skill points in a full run, two more with the shop's Head Start.
- The skill tree holds 49 ranks that one run can learn, counting one skill from each group that locks out its rivals, so a full run learns about half of it.

## When cards run short

If fewer skills than cards are left, Second Wind (`src/constants/boons.ts`) fills the rest and restores all HP and MP.
With about 25 points against 49 ranks this does not happen in a normal run.
