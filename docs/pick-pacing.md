# Pick pacing

A run is 30 waves, and Kael gets a pick of three cards from two sources.

- Every level up gives one pick.
- Every cleared wave gives one pick, opened as the wave's last foe falls and before the pause to the next wave.
- When the last kill also levels Kael up, the level-up pick comes first and the wave pick follows, as queued picks already did.
- Wave 30 gives no pick: clearing it ends the stage and the run, so a skill learned there would never be used.

## How many picks a run gives

The numbers below come from adding up the experience of every foe in the wave plan (`src/utils/waves.ts`) against the curve in `src/constants/progression.ts`, assuming every foe dies.

- Experience drops as orbs that Kael picks up; the numbers assume he collects all of it, which he does because left orbs fly to him.
- The curve is twice the first one (base 48, step 26). Kael reaches about level 4 at wave 5, 9 at wave 15, 13 at wave 20 and 18 at wave 30.
  The first curve reached 5, 13, 18 and 26.
- Level ups give about 17 picks in a full run, and wave clears give 29 more, so about 46 in all.
- The skill tree holds 54 ranks that one run can learn, counting one skill from each group that locks out its rivals.
  Five of them are the abilities Kael no longer starts with: Warp Strike, Fire Flask, Ice Spikes, Lightning and Crystal Nova.
- Every level gate is still reached: ultimates (levels 11 to 13) between waves 17 and 20, and the six-hit combo (level 17) near wave 28.

With level ups alone a full run learned about half the tree.
With wave picks it learned all of it near the end; with the slower curve and the five new skills it falls a few ranks short, so boons fill fewer cards.

## Boons

From that point boons fill the cards that skills cannot, so every pick still shows three cards and offers a real choice.
They live in `src/constants/boons.ts`.

- Second Wind restores all HP and MP.
- Vigor adds 10 max HP for the run.
- Honing adds 1 attack and 1 spell damage for the run.

Vigor and Honing stack and are added after the skills' percentage bonuses, so the card text is exactly what Kael gets.
Each is worth about half a rank of a passive skill: Keen Edge gives 2 attack per rank and Vigor is two levels of HP growth.

## Difficulty check

The bot runs below predate the balance pass that made levels slower, halved heal and MP drops and made the warp, spells and ultimate learnable; they have not been rerun since.

A bot that only mashes J and takes the first card was run in a headless browser with six bots for seven to eight minutes each.

- Before wave picks: 36 deaths, all at wave 5 (the first Rift Brute), at level 4.
- With wave picks: 41 deaths, 40 at wave 5 and one at wave 8, mean wave 5.07.

The extra picks in the first waves do not carry a mash-only player past the brute, so the early difficulty is unchanged.
The bot cannot reach the late waves, so how much stronger a full tree makes Kael against the waves 20 to 30 warden fights is untested.
