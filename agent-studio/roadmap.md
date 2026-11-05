# Studio roadmap

The director keeps this file current after every patch: it adds ideas, moves items between lists and removes what shipped.
Each item names the reference or pillar it serves and any feedback IDs behind it.
Order inside a list is priority order.

## Next big patches

- First: port the owner-approved dry-run patches to the current main. The owner chose this as the studio's first big patch on 5 November 2026. (Vampire Survivors, pillar 3)
  - The local branch `dry/first-patches` holds them, built and QA-passed on the game before the Ysra rework: 0.2.0 Spell Evolutions (commits `17a9ffc` to `e3f54ec`) and the 0.2.1 fixes (`71f5746` to `f9152a3`). The developer can read them with `git show` and `git diff`; their decision memos are `agent-studio/journal/0.2.0.md` and `0.2.1.md` on that branch.
  - 0.2.0: from hero level 6, a spell with its partner passive at full rank evolves at the next wave pick as a gold first card. Fire Flask with Mana Font 3/3 becomes Sunflask (the burst throws three smaller flasks), Ice Spikes with Swift Sigils 3/3 becomes Glacier Bloom (a second line behind the hero and a crown spire that bursts into freezing shards), Lightning with Arcane Power 4/4 becomes Thunderhead (a storm cloud that calls three more bolts). Also: a jump pressed during an attack is kept until the attack can be cancelled; Rift Warden base HP 900 to 720; every foe drops 25 percent more coins.
  - 0.2.1 on top: with Launcher learned, a held Up during a ground combo waits for J (a tapped Up still jumps); Sunflask's child flasks aim at the nearest foes on a low, short arc; Thunderhead's follow-up bolts 2 to 1.5 times ability power; the Sunflask card text describes the aim.
  - Since then the Ysra rework landed: Ysra has her glaive kit, Heat and fire rites and no spells, and heroes own their input through kits. Port what still fits: spell evolutions for Kael's spells, and decide what evolves for Ysra (her rites are the natural partner; say so in the plan if she gets none yet). Main already keeps effects started inside other effects, so that 0.2.0 fix is not needed. Re-check the jump and launcher fixes against the kit input code, re-measure every number with the bots (including the wave 20 runs for the Rift Warden), and capture new clips.
  - Ship it as one big patch whose notes cover all of it. Remove this item once it ships.
- New system: weapon evolutions. Two learned skills at full rank plus a passive evolve into a stronger form at a wave pick, the way Vampire Survivors evolves weapons. Builds on the existing Fusion lane. (Vampire Survivors, pillar 3)
- New system: class advancement. Each hero unlocks a second job after clearing the stage once, changing part of the combo, the special and the look. (Grand Chase, pillars 2 and 4)
- New system: achievements and unlocks. Goals such as "clear wave 15 with Ysra" unlock shop items, a hero or a stage, with a collection screen. (Vampire Survivors, pillar 4)
- New stage: a second stage with its own eras, platforms and hazards, unlocked by clearing the first. (Grand Chase dungeons, pillar 4)
- New hero: a third hero with ranged play and its own resource, unlocked through an achievement. (Grand Chase, pillar 2)
- New boss: a mid-stage boss with readable phases for wave 15, replacing a mini boss. (Grand Chase, pillar 1)
- Run modifiers: curses chosen before a run that make foes stronger for more coins. (Vampire Survivors, pillar 4)

## Small patch candidates

- Measure each hero's mash and skilled bot runs and bring their death waves within two waves of each other.
- Check the shop prices against coins earned per run (see `docs/meta-progress.md`).

## Shipped

Nothing yet.
