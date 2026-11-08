import { W } from "../../../../constants/stage";
import { sfx } from "../../../../services/audio";
import { createAnchorDrop } from "../../../effects/orrin/anchorDrop";
import { emitSkillEvent } from "../../../skills/events";
import { skillValues, withCharms } from "../../../skills/query";
import { game, hero } from "../../../state";
import { surfaceBelow } from "../../../world";
import { canCast } from "../castCheck";
import { orrin } from "../memory";

const FALL = "o_anchorfall";

/** I with Anchor Fall: anchors drop from rifts ahead of him, one after another; evolved, five across the screen */
export function pressAnchorFall(): boolean {
  const v = skillValues(FALL);
  if (!canCast(orrin.anchorCd, v.mp)) return true;
  hero.mp -= v.mp;
  orrin.anchorCd = withCharms("cooldown", v.cooldown);
  const count = withCharms("amount", v.count);
  const xs = v.rain
    ? Array.from({ length: count }, (_, i) => ((i + 0.5) / count) * W)
    : Array.from({ length: count }, (_, i) => hero.x + hero.face * (50 + i * 30));
  const landedAt: number[] = [];
  const root = v.root ? withCharms("duration", v.root) : 0;
  xs.forEach((x, i) => {
    const cx = Math.max(10, Math.min(W - 10, x));
    const spec = { power: v.power, ring: withCharms("area", v.ring), stun: v.stun, pull: v.pull, delay: i * 0.12 };
    game.fx.push(
      createAnchorDrop(cx, surfaceBelow(cx, hero.y - 4), spec, (at) => {
        landedAt.push(at);
        if (!root || landedAt.length < 2) return;
        const [a, b] = [Math.min(...landedAt), Math.max(...landedAt)];
        for (const e of game.enemies) if (e.hp > 0 && !e.air && e.x > a && e.x < b) e.pinned = Math.max(e.pinned, root);
      }),
    );
  });
  sfx.rattle();
  emitSkillEvent({ type: "cast", ability: FALL });
  return true;
}
