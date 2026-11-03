# Pick pacing

A run is 30 waves, and Kael gets a pick of three cards from two sources.

- Every level up gives one pick.
- Every cleared wave gives one pick, opened as the wave's last foe falls and before the pause to the next wave.
- When the last kill also levels Kael up, the level-up pick comes first and the wave pick follows, as queued picks already did.
- Wave 30 gives no pick: clearing it ends the stage and the run starts over, so a skill learned there would never be used.

## How many picks a run gives

The numbers below come from adding up the experience of every foe in the wave plan (`src/utils/waves.ts`) against the curve in `src/constants/progression.ts`, assuming every foe dies.

- Kael reaches about level 5 at wave 5, level 16 at wave 19 and level 26 at wave 30.
- Level ups give about 25 picks in a full run, and wave clears give 29 more, so about 54 in all.
- The skill tree holds 49 ranks that one run can learn, counting one skill from each group that locks out its rivals.

With level ups alone a full run learned about half the tree.
With wave picks it learns all of it near the end.
In a simulated run that takes a random card each time, cards start running short of skills around wave 26.

## Boons

From that point boons fill the cards that skills cannot, so every pick still shows three cards and offers a real choice.
They live in `src/constants/boons.ts`.

- Second Wind restores all HP and MP.
- Vigor adds 10 max HP for the run.
- Honing adds 1 attack and 1 spell damage for the run.

Vigor and Honing stack and are added after the skills' percentage bonuses, so the card text is exactly what Kael gets.
Each is worth about half a rank of a passive skill: Keen Edge gives 2 attack per rank and Vigor is two levels of HP growth.

## Difficulty check

A bot that only mashes J and takes the first card was run in a headless browser with six bots for seven to eight minutes each.

- Before wave picks: 36 deaths, all at wave 5 (the first Rift Brute), at level 4.
- With wave picks: 41 deaths, 40 at wave 5 and one at wave 8, mean wave 5.07.

The extra picks in the first waves do not carry a mash-only player past the brute, so the early difficulty is unchanged.
The bot cannot reach the late waves, so how much stronger a full tree makes Kael against the waves 20 to 30 warden fights is untested.
