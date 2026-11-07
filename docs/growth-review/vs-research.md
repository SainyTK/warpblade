# Vampire Survivors progression math (research notes)

Collected 2026-11-07.
Primary source is the community Vampire Survivors Wiki at vampire.survivors.wiki (the wiki the developer's community now maintains).
Page text was read in raw wikitext form (`?action=raw`) so the numbers are copied from the wiki's own data fields, not paraphrased.
The older Fandom wiki (vampire-survivors.fandom.com) returned HTTP 402 to automated fetches and was not used.

Abbreviation used below: `W/` = `https://vampire.survivors.wiki/w/`.
Each table names its source page; every number in that table comes from that page unless a row says otherwise.
Numbers marked **estimate** or **derived** are not stated by any source; their basis is given.

Version note: the wiki reflects the game as of its July 2026 beta notes (v1.15.x line).
Base-game weapon numbers have been stable for years, but treat any value as "current wiki" and not "launch 2022".

---

## 1. Experience and levels

### 1.1 XP requirement rules

Source: [W/Level_up](https://vampire.survivors.wiki/w/Level_up)

| Rule | Value |
|---|---|
| XP for level 1 to 2 | 5 |
| Increase in requirement per level, levels 2-20 | +10 XP per level (2 to 3 = 15, 3 to 4 = 25, ...) |
| Increase per level, levels 21-40 | +13 XP per level |
| Increase per level, level 41+ | +16 XP per level |
| Extra XP to leave level 20 | +600 |
| Extra XP to leave level 40 | +2,400 |
| Growth bonus while at level 20 and at level 40 | +100% Growth until the next level is reached |

Source for the Growth bonus mechanics: [W/Growth](https://vampire.survivors.wiki/w/Growth) says the +100% at levels 20 and 40 offsets "a formula change that makes leveling up harder ... which applied retroactively", and is removed again at 21 and 41.

### 1.2 Closed-form cumulative XP (what the wiki calculator actually uses)

Source: the wiki's Lua module behind its XP calculator, [W/Module:Experience](https://vampire.survivors.wiki/w/Module:Experience) (function `calcXpFactor`, used by `_main`).

```
total XP to reach level L = k * (L - 1)^2
k = min(5 + 1.5 * floor((L - 1) / 20), 8)    -> k = 5 for L <= 20, 6.5 for L 21-40, 8 for L >= 41
```

This reproduces the prose rules (step growth of +10, +13, +16 per level because d/dL of k*L^2 is 2k), and it explains the "retroactive" jump: when k changes from 5 to 6.5 at level 20 the whole curve is re-based, which is the 600-ish spike.
The same module also contains an older iterative function (`calcXp`) that gives smaller totals after level 21 (e.g. 2,808 instead of 2,866.5 at level 22).
The wiki prose itself notes its chart does not match the simple "+13 per level" reading (21 to 22 costs 266.5 XP in the chart).
I use `calcXpFactor` below because it is what the live calculator runs and it matches the Growth page's "retroactive" description. **Not verified against game code.**

| Reach level | Total XP (k*(L-1)^2) | XP for that single level-up | Source |
|---|---|---|---|
| 2 | 5 | 5 | W/Module:Experience |
| 5 | 80 | 35 | same |
| 10 | 405 | 85 | same |
| 15 | 980 | 135 | same |
| 20 | 1,805 | 185 | same |
| 21 | 2,600 | 795 (185 + 10 + 600) | same |
| 22 | 2,866.5 | 266.5 | same |
| 30 | 5,466.5 | 370.5 | same |
| 40 | 9,886.5 | 500.5 | same |
| 41 | 12,800 | 2,913.5 | same |
| 50 | 19,208 | 776 | same |
| 60 | 27,848 | 936 | same |
| 80 | 49,928 | 1,256 | same |
| 100 | 78,408 | 1,576 | same |
| 150 | 177,608 | - | **derived** from the same formula |
| 200 | 316,808 | - | **derived** from the same formula |

XP per gem and enemy: blue gems up to 2 XP, green up to 9, red anything above ([W/Experience_Gem](https://vampire.survivors.wiki/w/Experience_Gem)).
Per-enemy XP values are in section 5.2.
Growth multiplies gem value; Crown gives +8% per level (section 4), the Growth PowerUp +3% per rank, max +15% ([W/Growth](https://vampire.survivors.wiki/w/Growth)).

### 1.3 Level reached by minute

No reliable source gives a level-by-minute curve for a normal Mad Forest run.
What exists is anecdotal:

| Claim | Context | Source |
|---|---|---|
| Players say you need one evolved weapon by about minute 10, when Werewolves arrive, or the run tends to end | Steam forum, Jan 2022 | [Steam thread "So... The Mad Forest"](https://steamcommunity.com/app/1794680/discussions/0/3195868049829675674/) |
| Getting to minute 13-15 then dying is "very typical" for new players; another dies "around lvl 20 every single time" | Steam forum summary via search; **unverified** | search summary, thread not opened |
| Level 421 at minute 30, 679 at minute 60, 600M combined damage by minute 90 | Dairy Plant, Hyper + Endless, Trousers, one weapon slot. Not comparable to a normal run (Hyper and late-unlock relics) | [Straight Dope forum, 28 Feb 2023](https://boards.straightdope.com/t/vampire-survivors-fun-indie-rogue-lite-game-with-72-000-overwhelmingly-positive-reviews-on-steam-costs-3/962791?page=19) |
| Level 837 and 1,132M damage at minute 30; a replication got level 868, 159k kills, 1,012M damage | The Bone Zone, Hyper, same special setup | same page |

**Estimate** for a "normal competent first-character Mad Forest run": no number is given here because no source supports one.
If you need a curve for the chart, build it from section 5 (enemy count and XP per kill) and label it as modelled.
The Reaper section below shows why the level matters: its HP is 655,350 x player level.

---

## 2. Level-up choice system

| Mechanic | Value | Source |
|---|---|---|
| Options per level-up | 3, sometimes 4 | [W/Level_up](https://vampire.survivors.wiki/w/Level_up) |
| Chance of a 4th option | `1 - 1/totalLuck` (base Luck is 100% = 1.0, so 0% with no Luck; +50% Luck from a max Clover gives 1 - 1/1.5 = 33.3%) | [W/Level_up](https://vampire.survivors.wiki/w/Level_up), [W/Luck](https://vampire.survivors.wiki/w/Luck) (base Luck 100%) |
| Chance that an option is forced to be an owned item | `1 + 0.3x - 1/totalLuck`, x = 2 on even levels, 1 on odd; checked twice per level-up, only while inventory is not full | [W/Level_up](https://vampire.survivors.wiki/w/Level_up) |
| Item weighting | Each item's chance about rarity / total pool weight. Whip, Magic Wand, Knife, Santa Water rarity 100; King Bible, Runetracer, Fire Wand 80; Garlic 70 | Level_up page; rarities from each weapon page |
| Weapon slots | 6 from level-ups (stage-found weapons can exceed this) | [W/Weapons](https://vampire.survivors.wiki/w/Weapons) |
| Passive slots | 6 | [W/Passive_items](https://vampire.survivors.wiki/w/Passive_items) |
| Weapon max level | 8 for all eight base weapons listed in section 3 | each weapon page (`max-level = 8`) |
| Passive max level | 5 for most; Duplicator 2 | each passive page (section 4) |
| When everything is maxed | Level-ups offer Gold or Floor Chicken (or extra levels if Limit Break is on) | [W/Level_up](https://vampire.survivors.wiki/w/Level_up), [W/Limit_Break](https://vampire.survivors.wiki/w/Limit_Break) |
| Reroll | +2 per PowerUp rank, max 5 ranks (10). New set excludes the discarded items | [W/Reroll](https://vampire.survivors.wiki/w/Reroll) |
| Skip | +2 per rank, max 5 ranks. Skipping gives XP instead of an item; the Skip page's tips say it grants 20% of the XP to the next level | [W/Skip](https://vampire.survivors.wiki/w/Skip) |
| Banish | +2 per rank, max 5 ranks. Removes the item from level-ups and chests for the rest of the run | [W/Banish](https://vampire.survivors.wiki/w/Banish) |
| Skip and Reroll with a full inventory | Not available | [W/Level_up](https://vampire.survivors.wiki/w/Level_up) |
| Invulnerability after picking | Brief, added in patch 0.2.12 | [W/Level_up](https://vampire.survivors.wiki/w/Level_up) |

### 2.1 Evolutions and chests

Source: [W/Evolution](https://vampire.survivors.wiki/w/Evolution), [W/Treasure_Chest](https://vampire.survivors.wiki/w/Treasure_Chest)

- Evolution needs the base weapon at max level (8) plus its passive in the inventory, then an evolution-capable chest.
For the original weapons the passive only has to be owned; the wiki says full passive level is required only for later weapons (Infinite Corridor, Crimson Shroud, most post-1.0 and DLC weapons).
- Evolution-capable chests in most stages drop from bosses that spawn at or after 10:00.
- Mad Forest exception: the 1:00 Glowing Bat chest can also evolve (its chest config has `evo=1`, see [W/Mad_Forest](https://vampire.survivors.wiki/w/Mad_Forest)). In practice nobody has a max-level weapon at 1:00, so the first realistic evolution is the 10:00 Giant Mantichana chest.
- One evolution per chest in Mad Forest. Some stages can do up to 3 or 5.
- Chests give 1, 3 or 5 upgrades to owned items. Roll order: 5-item chance, then 3-item, then 1-item, each multiplied by total Luck. Example from the 9:00 Silver Bat: 3% / 10% / 50% base.
- Coins: 100-200 (1 item), 300-600 (3), 500-1,000 (5), times Greed.
- The first six chests in a save always go 1-1-3-1-1-5.
- Bronze chests (before 10:00) normally cannot evolve; Silver (after 10:00) can.

---

## 3. Weapon stat tables

Cumulative values per level are **derived** by adding the wiki's per-level increments to the level-1 values; the increments and level-1 values themselves are from the cited page.
"Nominal DPS" = damage x amount / cooldown on a single target, with no Might, Cooldown, Area or crit bonuses and ignoring hit-box delay. It is **derived** arithmetic for comparing growth shape, not an in-game number.

### 3.1 Whip ([W/Whip](https://vampire.survivors.wiki/w/Whip))

Fixed: cooldown 1.35 s, interval 0.1 s, knockback 1, pierce = area of effect, ignores Speed and Duration. Evolves with Hollow Heart into Bloody Tear.

| Lv | Change | Damage | Amount | Area | Nominal DPS |
|---|---|---|---|---|---|
| 1 | base | 10 | 1 | 100% | 7.4 |
| 2 | +1 amount | 10 | 2 | 100% | 14.8 |
| 3 | +5 dmg | 15 | 2 | 100% | 22.2 |
| 4 | +10% area, +5 dmg | 20 | 2 | 110% | 29.6 |
| 5 | +5 dmg | 25 | 2 | 110% | 37.0 |
| 6 | +10% area, +5 dmg | 30 | 2 | 120% | 44.4 |
| 7 | +5 dmg | 35 | 2 | 120% | 51.9 |
| 8 | +5 dmg | 40 | 2 | 120% | 59.3 |

### 3.2 Magic Wand ([W/Magic_Wand](https://vampire.survivors.wiki/w/Magic_Wand))

Fixed: speed 100%, interval 0.1 s, knockback 1, targets nearest enemy. Evolves with Empty Tome into Holy Wand.

| Lv | Change | Damage | Cooldown | Amount | Pierce | Nominal DPS |
|---|---|---|---|---|---|---|
| 1 | base | 10 | 1.2 s | 1 | 1 | 8.3 |
| 2 | +1 amount | 10 | 1.2 | 2 | 1 | 16.7 |
| 3 | -0.2 s cooldown | 10 | 1.0 | 2 | 1 | 20.0 |
| 4 | +1 amount | 10 | 1.0 | 3 | 1 | 30.0 |
| 5 | +10 dmg | 20 | 1.0 | 3 | 1 | 60.0 |
| 6 | +1 amount | 20 | 1.0 | 4 | 1 | 80.0 |
| 7 | +1 pierce | 20 | 1.0 | 4 | 2 | 80.0 |
| 8 | +10 dmg | 30 | 1.0 | 4 | 2 | 120.0 |

### 3.3 Knife ([W/Knife](https://vampire.survivors.wiki/w/Knife))

Fixed: cooldown 1.0 s, speed 100%, knockback 0.5, fires in facing direction. Evolves with Bracer into Thousand Edge.

| Lv | Change | Damage | Amount | Pierce | Interval | Nominal DPS |
|---|---|---|---|---|---|---|
| 1 | base | 6.5 | 1 | 1 | 0.10 s | 6.5 |
| 2 | +1 amount | 6.5 | 2 | 1 | 0.10 | 13.0 |
| 3 | +1 amount, +5 dmg | 11.5 | 3 | 1 | 0.10 | 34.5 |
| 4 | +1 amount, -0.02 s interval | 11.5 | 4 | 1 | 0.08 | 46.0 |
| 5 | +1 pierce | 11.5 | 4 | 2 | 0.08 | 46.0 |
| 6 | +1 amount, -0.02 s interval | 11.5 | 5 | 2 | 0.06 | 57.5 |
| 7 | +1 amount, +5 dmg | 16.5 | 6 | 2 | 0.06 | 99.0 |
| 8 | +1 pierce, -0.02 s interval | 16.5 | 6 | 3 | 0.04 | 99.0 |

### 3.4 King Bible ([W/King_Bible](https://vampire.survivors.wiki/w/King_Bible))

Fixed: cooldown 3.0 s (starts after duration ends), hitbox delay 1.7 s, knockback 1, orbits the player. Evolves with Spellbinder into Unholy Vespers.

| Lv | Change | Damage | Amount | Area | Speed | Duration |
|---|---|---|---|---|---|---|
| 1 | base | 10 | 1 | 100% | 100% | 3.0 s |
| 2 | +1 amount | 10 | 2 | 100% | 100% | 3.0 |
| 3 | +25% area, +30% speed | 10 | 2 | 125% | 130% | 3.0 |
| 4 | +0.5 s duration, +10 dmg | 20 | 2 | 125% | 130% | 3.5 |
| 5 | +1 amount | 20 | 3 | 125% | 130% | 3.5 |
| 6 | +25% area, +30% speed | 20 | 3 | 150% | 160% | 3.5 |
| 7 | +0.5 s duration, +10 dmg | 30 | 3 | 150% | 160% | 4.0 |
| 8 | +1 amount | 30 | 4 | 150% | 160% | 4.0 |

### 3.5 Garlic ([W/Garlic](https://vampire.survivors.wiki/w/Garlic))

Fixed: aura around player, ignores Amount, Duration, Speed; reduces enemy knockback and freeze resistance. Evolves with Pummarola into Soul Eater.

| Lv | Change | Damage | Cooldown | Area | Nominal DPS (per enemy in aura) |
|---|---|---|---|---|---|
| 1 | base | 5 | 1.3 s | 100% | 3.8 |
| 2 | +40% area, +2 dmg | 7 | 1.3 | 140% | 5.4 |
| 3 | -0.1 s cd, +1 dmg | 8 | 1.2 | 140% | 6.7 |
| 4 | +20% area, +1 dmg | 9 | 1.2 | 160% | 7.5 |
| 5 | -0.1 s cd, +2 dmg | 11 | 1.1 | 160% | 10.0 |
| 6 | +20% area, +1 dmg | 12 | 1.1 | 180% | 10.9 |
| 7 | -0.1 s cd, +1 dmg | 13 | 1.0 | 180% | 13.0 |
| 8 | +20% area, +2 dmg | 15 | 1.0 | 200% | 15.0 |

### 3.6 Santa Water ([W/Santa_Water](https://vampire.survivors.wiki/w/Santa_Water))

Fixed: cooldown 4.5 s, damage tick interval 0.3 s, hitbox delay 0.5 s, ignores Speed. Evolves with Attractorb into La Borra.
The wiki footnote says the level 5 and 7 duration steps are really +0.25 s (shown as 0.3).

| Lv | Change | Damage per tick | Amount | Area | Duration |
|---|---|---|---|---|---|
| 1 | base | 10 | 1 | 100% | 2.0 s |
| 2 | +1 amount, +20% area | 10 | 2 | 120% | 2.0 |
| 3 | +0.5 s, +10 dmg | 20 | 2 | 120% | 2.5 |
| 4 | +1 amount, +20% area | 20 | 3 | 140% | 2.5 |
| 5 | +0.25 s, +10 dmg | 30 | 3 | 140% | 2.75 |
| 6 | +1 amount, +20% area | 30 | 4 | 160% | 2.75 |
| 7 | +0.25 s, +5 dmg | 35 | 4 | 160% | 3.0 |
| 8 | +20% area, +5 dmg | 40 | 4 | 180% | 3.0 |

### 3.7 Runetracer ([W/Runetracer](https://vampire.survivors.wiki/w/Runetracer))

Fixed: cooldown 3.0 s, interval 0.2 s, hitbox delay 0.5 s, knockback 1, bounces off screen edges, infinite pierce. Evolves with Armor into NO FUTURE.
The wiki footnote says the level 3 and 6 duration steps are really +0.25 s.

| Lv | Change | Damage | Amount | Speed | Duration |
|---|---|---|---|---|---|
| 1 | base | 10 | 1 | 100% | 2.25 s |
| 2 | +5 dmg, +20% speed | 15 | 1 | 120% | 2.25 |
| 3 | +0.25 s, +5 dmg | 20 | 1 | 120% | 2.5 |
| 4 | +1 amount | 20 | 2 | 120% | 2.5 |
| 5 | +5 dmg, +20% speed | 25 | 2 | 140% | 2.5 |
| 6 | +0.25 s, +5 dmg | 30 | 2 | 140% | 2.75 |
| 7 | +1 amount | 30 | 3 | 140% | 2.75 |
| 8 | +0.5 s | 30 | 3 | 140% | 3.25 |

### 3.8 Fire Wand ([W/Fire_Wand](https://vampire.survivors.wiki/w/Fire_Wand))

Fixed: cooldown 3.0 s, amount 3, pierce 1, interval 0.02 s, fires at random enemies. Evolves with Spinach into Hellfire.

| Lv | Change | Damage | Speed | Nominal DPS |
|---|---|---|---|---|
| 1 | base | 20 | 75% | 20.0 |
| 2 | +10 dmg | 30 | 75% | 30.0 |
| 3 | +10 dmg, +20% speed | 40 | 95% | 40.0 |
| 4 | +10 dmg | 50 | 95% | 50.0 |
| 5 | +10 dmg, +20% speed | 60 | 115% | 60.0 |
| 6 | +10 dmg | 70 | 115% | 70.0 |
| 7 | +10 dmg, +20% speed | 80 | 135% | 80.0 |
| 8 | +10 dmg | 90 | 135% | 90.0 |

(The wiki infobox lists max speed as "135% (+60%)"; 75% + 3 x 20% = 135%.)

### 3.9 Evolutions

Evolved weapons have no level table; their stats are fixed (they can only grow further with Limit Break or passives).
Values in brackets are the wiki's change versus the max-level base weapon.

| Evolution | Requires | Damage | Cooldown | Amount | Area / Speed / Duration | Other | Source |
|---|---|---|---|---|---|---|---|
| Bloody Tear | Whip 8 + Hollow Heart | 40 | 1.35 s | 2 | Area 130% (+10%) | Crit 10% chance, x2 (Luck raises chance); heals 8 HP on a crit hit, max once per 1 s | [W/Bloody_Tear](https://vampire.survivors.wiki/w/Bloody_Tear) |
| Holy Wand | Magic Wand 8 + Empty Tome | 30 | 0.5 s (-0.5) | 4 | Speed 200% (+100%) | Pierce 2, interval 0.1 s, "fires with no delay" | [W/Holy_Wand](https://vampire.survivors.wiki/w/Holy_Wand) |
| Thousand Edge | Knife 8 + Bracer | 16.5 | 0.35 s (-0.65) | 6 | Speed 150% (+50%) | Pierce 3, interval 0.05 s; crits (30%, x3 in infobox) only with the Slash (XVI) Arcana | [W/Thousand_Edge](https://vampire.survivors.wiki/w/Thousand_Edge) |
| Unholy Vespers | King Bible 8 + Spellbinder | 30 | 3.0 s, no longer waits for duration | 4 | Area 175% (+25%), Speed 150% (-10%), Duration 3.0 s (-1) | Knockback 4; effectively permanent ring | [W/Unholy_Vespers](https://vampire.survivors.wiki/w/Unholy_Vespers) |
| Soul Eater | Garlic 8 + Pummarola | 20 (+5) | 1.0 s | - | Area 300% (+100%) | +1 flat damage per 60 HP healed, max +60 (not scaled by Might); chance to drop Little Hearts | [W/Soul_Eater](https://vampire.survivors.wiki/w/Soul_Eater) |
| La Borra | Santa Water 8 + Attractorb | 40 | 4.0 s (-0.5) | 4 | Area 200% (+20%), Duration 4.0 s (+1) | Pools follow the player and grow while moving; hitbox delay 0.5 s | [W/La_Borra](https://vampire.survivors.wiki/w/La_Borra) |
| NO FUTURE | Runetracer 8 + Armor | 30 | 1.0 s (-2), but cooldown starts after the 3.0 s duration, so 4 s cycle | 1 (-2) | Speed 280% (+140%), Duration 3.0 s | Explodes on bounce and when the player is hit (every 0.5 s max); +10% retaliation damage per Armor point | [W/NO_FUTURE](https://vampire.survivors.wiki/w/NO_FUTURE) |
| Hellfire | Fire Wand 8 + Spinach | 100 (+10) | 3.0 s | 2 (-1) | Speed 100% (-35%) | Infinite pierce, passes walls, interval 0.2 s | [W/Hellfire](https://vampire.survivors.wiki/w/Hellfire) |

**Derived** nominal single-target DPS of the evolutions (damage x amount / cooldown, no bonuses): Holy Wand 240, Thousand Edge 283, Bloody Tear 59 (plus crits), Hellfire 67, Unholy Vespers about 40 per 3 s cycle per enemy ring hit, but limited by its 1.7 s hit-box delay.
Compare to the max-level base weapons in section 3 (Magic Wand 120, Knife 99): the evolution roughly doubles to triples single-target output on the projectile weapons, while Whip to Bloody Tear mainly adds area, crits and healing.

---

## 4. Passive items

All have the effect listed per level, additive unless noted. Max level 5 except Duplicator.

| Item | Stat | Per level | Max level | Max total | Stacking | Source |
|---|---|---|---|---|---|---|
| Spinach | Might (damage) | +10% | 5 | +50% | Additive | [W/Spinach](https://vampire.survivors.wiki/w/Spinach) |
| Empty Tome | Cooldown | -8% | 5 | -40% | Additive | [W/Empty_Tome](https://vampire.survivors.wiki/w/Empty_Tome) |
| Duplicator | Amount | +1 | 2 | +2 | Additive | [W/Duplicator](https://vampire.survivors.wiki/w/Duplicator) |
| Candelabrador | Area | +10% | 5 | +50% | Additive | [W/Candelabrador](https://vampire.survivors.wiki/w/Candelabrador) |
| Bracer | Projectile speed | +10% | 5 | +50% | Additive | [W/Bracer](https://vampire.survivors.wiki/w/Bracer) |
| Spellbinder | Duration | +10% | 5 | +50% | Additive | [W/Spellbinder](https://vampire.survivors.wiki/w/Spellbinder) |
| Clover | Luck | +10% | 5 | +50% | Additive | [W/Clover](https://vampire.survivors.wiki/w/Clover) |
| Crown | Growth (XP gain) | +8% | 5 | +40% | Additive | [W/Crown](https://vampire.survivors.wiki/w/Crown) |
| Attractorb | Magnet (pickup range, base 30) | x1.5, then +33%, +25%, +20%, +33% | 5 | x3.98 (wiki rounds to +300%) | Multiplicative | [W/Attractorb](https://vampire.survivors.wiki/w/Attractorb), base 30 from [W/Magnet](https://vampire.survivors.wiki/w/Magnet) |
| Hollow Heart | Max Health | x1.2 | 5 | +149% (1.2^5 = 2.49) | Multiplicative | [W/Hollow_Heart](https://vampire.survivors.wiki/w/Hollow_Heart) |
| Pummarola | Recovery | +0.2 HP/s | 5 | +1.0 HP/s | Additive | [W/Pummarola](https://vampire.survivors.wiki/w/Pummarola) |
| Armor | Armor | -1 incoming damage per hit; level 1 also +10% retaliation damage | 5 | -5 | Additive | [W/Armor_(item)](https://vampire.survivors.wiki/w/Armor_(item)) |
| Wings | Move speed | +10% | 5 | +50% | Additive | [W/Wings](https://vampire.survivors.wiki/w/Wings) |
| Stone Mask | Greed (gold) | +10% | 5 | +50% | Additive | [W/Stone_Mask](https://vampire.survivors.wiki/w/Stone_Mask) |
| Skull O'Maniac | Curse | +10% | 5 | +50% | Additive | [W/Skull_O'Maniac](https://vampire.survivors.wiki/w/Skull_O%27Maniac) |

Level-up rarity weights: Spinach, Candelabrador, Bracer, Spellbinder, Clover, Attractorb, Armor, Stone Mask 100; Hollow Heart, Pummarola 90; Crown 70; Empty Tome, Duplicator, Wings 50; Skull O'Maniac 40 (same pages, `rarity` field).

For reference, the default character Antonio has 120 max HP, +1 Armor, and +10% damage every 10 levels up to +50% ([W/Antonio_Belpaese](https://vampire.survivors.wiki/w/Antonio_Belpaese)).

---

## 5. Enemy difficulty on Mad Forest

### 5.1 Stage modifiers

Source: [W/Mad_Forest](https://vampire.survivors.wiki/w/Mad_Forest) infobox.
Normal mode: time limit 30:00, starting spawns 10, enemy health x1, enemy speed x1.1, player speed x1.1, enemy minimum x1, XP x1.
Hyper mode: enemy speed x2, starting spawns 15, enemy minimum x1.25, gold x1.5.

Global spawn rules ([W/Enemies](https://vampire.survivors.wiki/w/Enemies)): each minute is a wave with a minimum count and a spawn interval. If fewer than the minimum are alive, enemies spawn until the quota is met; otherwise one of each wave enemy type spawns per interval. At 300+ alive, normal spawning stops (bosses and map events still spawn up to 500). Hard cap 500.

### 5.2 Enemy stats

Source: each enemy's page, `Statbox Enemy` fields (health, damage, movespeed, xp).
"HP x Level" means HP is multiplied by the player's level at the moment the enemy spawns ([W/Enemies](https://vampire.survivors.wiki/w/Enemies), Skills section).

| Enemy (wiki name) | HP | Damage | Move speed | XP | HP x Level | Source |
|---|---|---|---|---|---|---|
| Little Pipeestrello (BAT1) | 1 | 5 | 140 | 1 | no | [W/Pipeestrello](https://vampire.survivors.wiki/w/Pipeestrello) |
| Red-Eyed Pipeestrello 1 / 2 (BAT2/BAT3) | 5 | 5 | 140 | 1 | no | same |
| Bat Swarm bat | 1 | 1 | 700 | 1 | no | same |
| Glowing Bat (BAT4, boss/chest carrier) | 50 | 10 | 140 | 30 | **yes** | same |
| Silver Bat (BAT5, boss/chest carrier) | 50 | 10 | 140 | 30 | **yes** | same |
| Zombie | 10 | 10 | 100 | 1 (page infobox; statbox field blank) | no | [W/Zombie](https://vampire.survivors.wiki/w/Zombie) |
| Skeleton | 15 | 10 | 100 | 2 | no | [W/Skeleton](https://vampire.survivors.wiki/w/Skeleton) |
| Ghost / Ghost swarm | 10 | 5 | 200 / 700 | 1.5 | no | [W/Ghost](https://vampire.survivors.wiki/w/Ghost) |
| Gray Mudman (Mudman 1) | 70 | 10 | 100 | 2.5 | no | [W/Mudman](https://vampire.survivors.wiki/w/Mudman) |
| Green Mudman (Mudman 2) | 150 | 10 | 100 | 2.5 | no | same |
| Werewolf | 180 | 14 | 130 | 2 | no | [W/Werewolf](https://vampire.survivors.wiki/w/Werewolf) |
| Giant Bat | 270 | 10 | 140 | 2.5 | no | [W/Giant_Bat](https://vampire.survivors.wiki/w/Giant_Bat) |
| Mantichana | 500 | 20 | 80 | 3 | no | [W/Mantichana](https://vampire.survivors.wiki/w/Mantichana) |
| Big Mummy | 500 | 20 | 80 | 3 | no | [W/Big_Mummy](https://vampire.survivors.wiki/w/Big_Mummy) |
| Venus | 500 | 20 | 80 | 3 | no | [W/Venus](https://vampire.survivors.wiki/w/Venus) |
| Flower Wall | 30 | 1 | 20 | 2 | **yes** | [W/Flower_Wall](https://vampire.survivors.wiki/w/Flower_Wall) |
| Giant Mantichana (boss, 10:00) | 150 | 20 | 160 | 50 | **yes** | [W/Mantichana](https://vampire.survivors.wiki/w/Mantichana) |
| Giant Werewolf (boss, 15:00) | 200 | 20 | 130 | 2 | **yes** | [W/Werewolf](https://vampire.survivors.wiki/w/Werewolf) |
| Giant Mummy (boss, 20:00) | 250 | 20 | 80 | 25 | **yes** | [W/Big_Mummy](https://vampire.survivors.wiki/w/Big_Mummy) |
| Giant Blue Venus (boss, 25:00) | 150 | 30 | 160 | 50 | **yes** | [W/Venus](https://vampire.survivors.wiki/w/Venus) |
| The Reaper (30:00+) | 655,350 | 65,535 | 1,200 | 0 | **yes** | [W/The_Reaper](https://vampire.survivors.wiki/w/The_Reaper) |

Note: the Mad Forest wave table also lists a 5:00 "Mantichana" boss. The wiki does not say which variant; if it is the boss variant it has 150 HP x level.
Map events (Bat Swarm, Ghost Swarm, Flower Wall ring) add enemies on top of the wave and have a chance divided by total Luck ([W/Enemies](https://vampire.survivors.wiki/w/Enemies)).

### 5.3 Mad Forest wave table, minute by minute

Source: [W/Mad_Forest](https://vampire.survivors.wiki/w/Mad_Forest), "Waves" table. Chest columns are base chances for a 5-item / 3-item / 1-item chest before Luck; "evo" means the chest can evolve.

| Minute | Wave enemies | Enemy minimum | Spawn interval (s) | Boss / chest carrier | Chest 5/3/1 % (evo) | Map event |
|---|---|---|---|---|---|---|
| 0:00 | Red-Eyed Pipeestrello 2 | 15 | 1.0 | - | - | - |
| 1:00 | Zombie, Little Pipeestrello | 30 | 1.0 | Glowing Bat | 0/0/30 (evo) | - |
| 2:00 | Little, Red-Eyed 1, Red-Eyed 2 Pipeestrello | 50 | 0.5 | - | - | Bat Swarm x2 |
| 3:00 | Skeleton | 40 | 0.25 | Glowing Bat | 0/5/40 | Bat Swarm 10% |
| 4:00 | Skeleton, Ghost | 30 | 1.0 | - | - | Bat Swarm 10% |
| 5:00 | Green Mudman | 10 | 1.0 | Mantichana | 1/5/100 | Flower Wall ring (100%, 30 s) |
| 6:00 | Zombie, Green Mudman | 20 | 0.5 | - | - | Bat Swarm 10% |
| 7:00 | Red-Eyed 1 and 2, Gray Mudman | 80 | 0.5 | Glowing Bat | 3/10/50 | Bat Swarm 80% x5 |
| 8:00 | Zombie | 100 | 1.5 | Giant Bat | - | Bat Swarm 80% x2 |
| 9:00 | Giant Bat, Zombie | 30 | 0.5 | Silver Bat | 3/10/50 | Bat Swarm 70% x2 |
| 10:00 | Gray Mudman, Green Mudman | 10 | 0.5 | Giant Mantichana | 3/10/100 (evo) | Flower Wall ring (100%, 60 s) |
| 11:00 | Skeleton | 300 | 0.1 | Glowing Bat (Arcana chest only) | Arcana | Bat Swarm 10% |
| 12:00 | Werewolf, Ghost, Skeleton | 20 | 0.25 | Glowing Bat | 1/5/50 (evo) | Bat Swarm 10% |
| 13:00 | Werewolf, Ghost x2 | 150 | 0.5 | - | - | Ghost Swarm 70% x20, twice |
| 14:00 | Giant Bat, Werewolf | 20 | 0.1 | Silver Bat | 3/10/100 (evo) | - |
| 15:00 | Werewolf, Giant Bat, Green Mudman | 100 | 0.1 | Giant Werewolf | 3/10/100 (evo) | Flower Wall ring (80%, 60 s) |
| 16:00 | Mantichana, Gray Mudman, Green Mudman | 100 | 0.1 | Glowing Bat | 1/5/50 (evo) | - |
| 17:00 | Big Mummy | 20 | 1.0 | - | - | - |
| 18:00 | Big Mummy, Gray Mudman | 60 | 0.5 | Silver Bat | 3/10/100 (evo) | - |
| 19:00 | Big Mummy, Gray Mudman | 100 | 0.5 | - | - | - |
| 20:00 | Big Mummy, Green Mudman, Giant Bat | 100 | 0.1 | Giant Mummy | 3/10/100 (evo) | Bat Swarm 70% x20, twice |
| 21:00 | Flower Wall | 300 | 0.1 | Venus, Glowing Bat (Arcana chest) | Arcana | - |
| 22:00 | Flower Wall, Big Mummy | 200 | 0.1 | Glowing Bat | 3/10/100 (evo) | - |
| 23:00 | Flower Wall, Big Mummy | 300 | 0.1 | Silver Bat | 3/10/100 (evo) | - |
| 24:00 | Flower Wall, Big Mummy | 300 | 0.1 | Venus | - | - |
| 25:00 | Venus | 100 | 0.1 | Giant Blue Venus | 3/10/100 (evo) | Flower Wall ring x5 |
| 26:00 | Venus, Flower Wall | 150 | 0.1 | - | - | - |
| 27:00 | Big Mummy, Gray Mudman, Green Mudman | 300 | 0.1 | Glowing Bat | 3/10/100 (evo) | Ghost Swarm guaranteed, then x19 every 3 s |
| 28:00 | Giant Bat, Glowing Bat | 300 | 0.1 | - | - | - |
| 29:00 | Glowing Bat, Silver Bat | 300 | 0.1 | Glowing Bat | 3/10/100 (evo) | Bat Swarm guaranteed, then x19 every 3 s |
| 30:00+ | screen cleared | 1 | 60 | The Reaper, one more every minute | - | - |

**Derived** reading of the curve: the typical regular-enemy HP goes from 1-15 (minutes 0-4) to 70-150 (Mudmen, 5-10) to 180-270 (Werewolf, Giant Bat, 12-16) to 500 (Mummy, Mantichana, Venus, 16-27), roughly a 30x-100x rise over 30 minutes, while the minimum on-screen count goes from 15 to 300 and the interval from 1.0 s to 0.1 s.
Late Glowing and Silver Bats at minute 28-29 (50 HP x level) become the tankiest regular spawns at high level: at level 100 each has 5,000 HP.
Enemy contact damage stays in a narrow band, 5 to 20 (30 for Giant Blue Venus), against a 120 HP default character; the late-game threat comes from count and HP, not hit size.

### 5.4 Boss HP at sample player levels (**derived**)

Formula: listed HP x player level at spawn ([W/Enemies](https://vampire.survivors.wiki/w/Enemies), [W/The_Reaper](https://vampire.survivors.wiki/w/The_Reaper)). Curse multiplies on top (5.5).
The player levels below are example inputs, not claims about typical runs.

| Boss | Base | At level 30 | At level 60 | At level 100 | At level 200 |
|---|---|---|---|---|---|
| Glowing / Silver Bat | 50 | 1,500 | 3,000 | 5,000 | 10,000 |
| Giant Mantichana (10:00) | 150 | 4,500 | 9,000 | 15,000 | 30,000 |
| Giant Werewolf (15:00) | 200 | 6,000 | 12,000 | 20,000 | 40,000 |
| Giant Mummy (20:00) | 250 | 7,500 | 15,000 | 25,000 | 50,000 |
| Giant Blue Venus (25:00) | 150 | 4,500 | 9,000 | 15,000 | 30,000 |
| The Reaper (30:00) | 655,350 | 19.7M | 39.3M | 65.5M | 131.1M |

### 5.5 The Reaper

Source: [W/The_Reaper](https://vampire.survivors.wiki/w/The_Reaper).
Spawns at the stage time limit (30:00 on Mad Forest) and one more every minute after. HP 655,350 x player level at spawn, contact damage 65,535, move speed 1,200, immune to freeze-resist debuffs and instant kill, knockback -0.5 (it gets pulled toward the player when hit). Surviving to 30:00 pays 500 gold. Killing it the first time unlocks Mask of the Red Death.
Players report that without percentage-damage tools (Crimson Shroud, Infinite Corridor) or freezing (Clock Lancet), it is effectively unkillable at normal levels ([Steam thread, June 2022](https://steamcommunity.com/app/1794680/discussions/0/3424438414106287532/)).

### 5.6 Curse

Source: [W/Curse](https://vampire.survivors.wiki/w/Curse).
Base Curse 100%. Curse multiplies enemy HP, enemy move speed, wave enemy minimum, and spawn frequency: `effectiveSpawnInterval = spawnInterval / totalCurse`.
HP change applies to newly spawned enemies immediately; the other effects apply at the next minute. No upper limit, but the 500-enemy cap still holds.
Sources of Curse: Skull O'Maniac +10% per level (max +50%), Curse PowerUp +10% per rank (max +50%), some characters.
Curse does not directly raise XP per gem; it raises XP income only through more enemies.

---

## 6. Damage totals, DPS and the results screen

### 6.1 Results screen

Source: [W/Results](https://vampire.survivors.wiki/w/Results).
Top left: stage, mode, gold bonus, time survived, gold earned, level reached, enemies defeated.
Bottom left: one row per weapon with its level, total damage, time held, and damage per second. The top damage weapon and the top DPS weapon are highlighted in yellow.
Large numbers use SI prefixes (k, M, G, T, P, E).
Top right: character name and Golden Eggs used.

### 6.2 Reported damage numbers

| Reported value | Context | Source |
|---|---|---|
| 600M combined damage by minute 90, level 699 | Dairy Plant, Hyper, Endless, Trousers, one weapon slot | [Straight Dope forum, 28 Feb 2023](https://boards.straightdope.com/t/vampire-survivors-fun-indie-rogue-lite-game-with-72-000-overwhelmingly-positive-reviews-on-steam-costs-3/962791?page=19) |
| 1,132M damage at minute 30, level 837 | The Bone Zone, Hyper, same setup | same |
| 1,012M damage, 159k kills, level 868 at minute 30; second try 757M, 129k kills, level 777 | Replication of the Bone Zone run | same |
| Reaper at level 100 = about 65M HP | Steam players' arithmetic from wiki formula | [Steam thread](https://steamcommunity.com/app/1794680/discussions/0/3424438414106287532/) and 5.5 |

**Derived** average DPS for the 30-minute Bone Zone runs: 1,012M / 1,800 s = about 0.56M damage per second averaged over the whole run (actual late-run DPS is far higher because damage grows over time).
These runs use Hyper mode and late-game relics on stages with much denser spawns, so they are an upper bound and not a Mad Forest benchmark.

I found no reliable source for a per-weapon results-screen total of a normal 30-minute Mad Forest run (for example "Bloody Tear did X damage").
Reddit returned no data to automated requests and the PC Gamer feature "Reaching the DPS singularity" ([link](https://www.pcgamer.com/great-moments-in-pc-gaming-reaching-the-dps-singularity-in-vampire-survivors)) has no numbers.
**Estimate** basis if you need one: model per-weapon DPS from section 3 nominal values times passives (e.g. Holy Wand 240 nominal x 1.5 Might from Spinach x 1/0.6 from Empty Tome x (4+2)/4 from Duplicator, about 900 single-target DPS before character and PowerUp bonuses), and multiply by targets hit for area weapons. Label any such curve as modelled.

---

## Sources

- https://vampire.survivors.wiki/w/Level_up
- https://vampire.survivors.wiki/w/Module:Experience
- https://vampire.survivors.wiki/w/Growth
- https://vampire.survivors.wiki/w/Luck
- https://vampire.survivors.wiki/w/Experience_Gem
- https://vampire.survivors.wiki/w/Reroll
- https://vampire.survivors.wiki/w/Skip
- https://vampire.survivors.wiki/w/Banish
- https://vampire.survivors.wiki/w/Limit_Break
- https://vampire.survivors.wiki/w/Weapons
- https://vampire.survivors.wiki/w/Passive_items
- https://vampire.survivors.wiki/w/Evolution
- https://vampire.survivors.wiki/w/Treasure_Chest
- Weapon pages: Whip, Magic_Wand, Knife, King_Bible, Garlic, Santa_Water, Runetracer, Fire_Wand, Bloody_Tear, Holy_Wand, Thousand_Edge, Unholy_Vespers, Soul_Eater, La_Borra, NO_FUTURE, Hellfire (all under https://vampire.survivors.wiki/w/)
- Passive pages: Spinach, Empty_Tome, Duplicator, Candelabrador, Bracer, Spellbinder, Clover, Crown, Attractorb, Hollow_Heart, Pummarola, Armor_(item), Wings, Stone_Mask, Skull_O'Maniac, Magnet (same base URL)
- Stage and enemies: Mad_Forest, Enemies, Pipeestrello, Zombie, Skeleton, Ghost, Mudman, Werewolf, Giant_Bat, Mantichana, Big_Mummy, Venus, Flower_Wall, The_Reaper, Curse, Antonio_Belpaese (same base URL)
- https://vampire.survivors.wiki/w/Results
- https://steamcommunity.com/app/1794680/discussions/0/3195868049829675674/
- https://steamcommunity.com/app/1794680/discussions/0/3424438414106287532/
- https://steamcommunity.com/app/1794680/discussions/0/3276942370890128551
- https://boards.straightdope.com/t/vampire-survivors-fun-indie-rogue-lite-game-with-72-000-overwhelmingly-positive-reviews-on-steam-costs-3/962791?page=19
