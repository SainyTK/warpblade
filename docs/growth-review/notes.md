# Growth review notes

Method behind `index.html`.
Rebuild the data with `sh docs/growth-review/build-data.sh` from the repo root.

## Both models

Each game runs 2,000 simulated runs twice: once taking the strongest card offered (measured by damage per second after the pick), once taking a random card.
Charts index damage to the start of the run, so the two games share one scale.

## Warpblade

`warpblade-model.mts` imports the game's own wave plan (`waveFoes`), foe table, XP curve, stat code (`computeStats`) and card dealing (`rollPicks`).
It assumes every foe dies and that cards are taken at the end of each wave, one per level gained.
Damage per second is attack damage times a typical move power of 1.2, combo throughput (hits / (0.3 s per hit + 0.5 s combo cooldown)), attack speed and crit.
Spells add ability power times their power (Fire 3.6, Ice 2.2 x 3 spikes, Lightning 4 + 2), limited by cooldown and by mana to about one cast per 4 seconds per learned spell; evolutions multiply their spell by 2 to 2.5.
A learned ultimate adds 7 x attack damage every 20 seconds.
Back and air hits are left out because they come from skill, not the build.
"Total foe HP per wave" includes mini bosses and the Warden; "HP of a typical foe" is the mean minion HP, carried over boss waves.

## Vampire Survivors

`vs-model.mjs` uses the wiki numbers collected in `vs-research.md` (each with a source URL): XP formula, weapon and passive tables, the Mad Forest wave table and chest times, with Antonio starting on the Whip.
Kills come from damage and enemy HP, XP from kills, so a strong build also levels faster.
Enemies arriving per minute is the wave minimum plus one of each wave type per spawn interval.
These parts are estimates and are written in the model next to each weapon: how many enemies an area or piercing weapon reaches in a dense crowd, the hits per cycle of King Bible, Santa Water and Runetracer, and how many pools of Santa Water reach one enemy.
Crowd reach scales with how dense the minute's crowd is.
Enemies whose HP scales with player level are left out of the enemies to kill: the Flower Wall ring stands still, and Glowing and Silver Bats carry chests.
A minute with nothing else (21 and 29) takes the enemies of the minute before.
Counting them made the late race chart fall far below 1 for every build, which does not match how the game plays.
The decision count is the median level at minute 30 plus about 17 chests.
The planner values a weapon whose evolution partner it owns as if evolved, which makes it build toward evolutions.
No source gives a level-by-minute curve or per-weapon totals for a normal run, so the results table is the median simulated run, not a recorded one.
