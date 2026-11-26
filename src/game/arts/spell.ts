import { STAGES } from "../../stages";
import { ARTS } from "../../stages/arts";
import type { ArtDef } from "../../types/art";
import type { ArtId } from "../../types/campaign";
import type { DrillSpell } from "../../types/drill";
import type { Enemy } from "../../types/enemy";
import { staggerFoe } from "../enemies/stagger";
import { ART_CASTING } from "./casting";

const WEAKNESS = { damage: 3, stagger: 0.5 } as const;
const cache = new Map<string, DrillSpell>();

const weakBoss = (id: ArtId): string | undefined => Object.values(STAGES).find((stage) => stage.weakTo === id)?.boss;

function weakness(id: ArtId) {
  return (foe: Enemy): number => {
    if (weakBoss(id) !== foe.type) return 1;
    staggerFoe(foe, WEAKNESS.stagger);
    return WEAKNESS.damage;
  };
}

export function artSpell(art: ArtDef, level: number, attack: number, hero: string): DrillSpell {
  const key = `${hero}:${art.id}:${level}`;
  const known = cache.get(key);
  if (known) return known;
  const row = art.levels[Math.max(0, Math.min(art.levels.length, level) - 1)];
  const spell: DrillSpell = {
    id: art.id,
    name: art.name,
    color: art.color,
    core: art.core,
    damage: row.damageTimesAttack * attack,
    radius: row.radius,
    range: row.range,
    speed: row.speed,
    delay: row.delay,
    look: art.look,
    freeze: row.freeze,
    cooldown: ART_CASTING[art.id].cooldown,
    mp: ART_CASTING[art.id].mp,
    status: art.status ? (foe) => art.status?.(foe, level) : undefined,
    damageScale: weakness(art.id),
    burst: art.burst ? (x, y) => art.burst?.(x, y, level) : undefined,
    drawBolt: art.drawBolt,
    drawImpact: art.drawImpact,
  };
  cache.set(key, spell);
  return spell;
}

export const artName = (id: ArtId): string => ARTS[id].name;
