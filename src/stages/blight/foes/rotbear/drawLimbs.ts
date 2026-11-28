import type { SpriteCanvas } from "../../../../engine/sprite";
import { BEAR } from "./colors";
import type { Pt } from "./pose";

const F = BEAR.fur;

export function drawLeg(s: SpriteCanvas, root: Pt, paw: Pt, near: boolean, hind: boolean): void {
  const tone = near ? F[2] : F[1];
  const bend = hind ? 3 : -1.5;
  const knee: Pt = [(root[0] + paw[0]) / 2 + bend, (root[1] + paw[1]) / 2];
  s.begin();
  s.stroke(root[0], root[1], knee[0], knee[1], near ? 4.4 : 3.8, tone);
  s.stroke(knee[0], knee[1], paw[0], paw[1] - 2.2, near ? 3.4 : 3, tone);
  s.poly(
    [
      [paw[0] - 3, paw[1] - 4.5],
      [paw[0] + 3, paw[1] - 4.5],
      [paw[0] + 4.5, paw[1]],
      [paw[0] - 3.5, paw[1]],
    ],
    tone,
  );
  s.shadeEdges(tone, near ? F[3] : F[2], near ? F[1] : F[0], 2);
  s.commit();
  s.begin();
  const claw = near ? BEAR.bone[3] : BEAR.bone[1];
  const raised = paw[1] < -20;
  for (let i = 0; i < 3; i++) {
    if (raised) s.hairline(paw[0] + 3, paw[1] - 4 + i * 1.6, paw[0] + 5.5, paw[1] - 5 + i * 1.6, claw);
    else s.hairline(paw[0] + 1.5 + i * 1.3, paw[1] - 1.2, paw[0] + 2.5 + i * 1.3, paw[1] - 0.2, claw);
  }
  if (near) {
    s.hairline(knee[0] - 1.5, knee[1] + 1, knee[0] - 2.5, knee[1] + 3, F[1]);
    s.hairline(knee[0] + 0.5, knee[1] + 1.5, knee[0], knee[1] + 3.5, F[1]);
  }
  s.commit(false);
}

export function drawGuardShelf(s: SpriteCanvas, root: Pt, paw: Pt, raised: boolean): void {
  const mx = root[0] + (paw[0] - root[0]) * 0.55;
  const my = root[1] + (paw[1] - root[1]) * 0.55;
  const G = BEAR.guard;
  const reach = raised ? 4.5 : 3.5;
  s.begin();
  s.poly(
    [
      [mx - 1, my - 5],
      [mx + reach, my - 3.5],
      [mx + reach + 1.5, my - 0.5],
      [mx + reach - 0.5, my + 2],
      [mx - 0.5, my + 1.5],
    ],
    G[2],
  );
  s.poly(
    [
      [mx, my + 1],
      [mx + reach - 1, my + 2.5],
      [mx + reach - 1.5, my + 4.5],
      [mx + 0.5, my + 4],
    ],
    G[1],
  );
  s.shadeEdges(G[2], G[3], G[0], 2);
  s.hairline(mx + 0.5, my - 4.5, mx + reach, my - 3, G[4]);
  s.hairline(mx + 0.5, my - 1.5, mx + reach + 0.5, my - 0.5, G[1]);
  s.set(mx + reach - 1, my - 2.5, G[4]);
  s.commit();
}
