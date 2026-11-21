import { game, progress } from "../../../../game/state";
import { createSandWave } from "../effects/sandWave";
import { fighterAt } from "./strike";

export function throwCrescents(power: number, source: string, pierce: boolean, count = 1): void {
  const { x, y } = fighterAt();
  for (let i = 0; i < count; i++) {
    for (const dir of [-1, 1]) {
      game.fx.push(
        createSandWave({
          x,
          y: y - 10 - i * 8,
          dir,
          damage: progress.stats.ad * power,
          range: 110,
          pierce,
          wounds: 1,
          source,
        }),
      );
    }
  }
}
