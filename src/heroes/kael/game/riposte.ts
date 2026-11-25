import { skillValues, withBuild } from "../../../game/skills/query";
import { hero } from "../../../game/state";

export function holdRiposte(time: number, blows: number): void {
  const mirror = skillValues("k_mirror");
  hero.riposte = Math.max(hero.riposte, time, mirror.ripTime ? withBuild("duration", mirror.ripTime) : 0);
  hero.riposteBlows = Math.max(hero.riposteBlows, blows, mirror.ripBlows ?? 0);
}
