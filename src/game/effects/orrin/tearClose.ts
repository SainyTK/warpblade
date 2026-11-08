import { PAL, SPARKS } from "../../../constants/palette";
import { PK } from "../../../types/particle";
import type { Point } from "../../../types/world";
import { lights, particles, rng } from "../../state";

/** an air bite's tear snaps shut: a one-frame flash of volt light and a few sparks thrown off it */
export function tearClose(at: Point): void {
  lights.add(at.x, at.y, 22, PAL.volt[4], 0.9, 1 / 30);
  for (let i = 0; i < 4; i++) {
    const a = rng.range(0, Math.PI * 2);
    const sp = rng.range(40, 90);
    particles.spawn(PK.SPARK, at.x, at.y, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.08, 0.16), {
      sparks: SPARKS.volt,
    });
  }
}
