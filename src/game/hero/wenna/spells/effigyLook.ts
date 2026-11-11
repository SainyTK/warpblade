import { EFFIGY_LOOK as E, WICK_WAX as X } from "../../../../constants/wenna/wickLook";
import { blit, detailCanvas } from "../../../../engine/sprite";
import { paintFlame } from "../wickFlame";

/** the effigy's canvas, its feet at the bottom middle */
const figure = detailCanvas(E.canvas.w, E.canvas.h, E.canvas.w / 2, E.canvas.h);

/**
 * The Wax Effigy with its feet at (x, y), `tall` pixels high at time `t`: a robed wax figure widening to its foot, a
 * round head, both arms raised, lit from the top left with a drip down its front, and a crown of three flames that
 * flicker out of step. It sways a little as it stands.
 */
export function drawEffigy(x: number, y: number, tall: number, t: number): void {
  const s = figure;
  const sway = Math.sin(t * 2.4) * 0.5;
  const top = -tall;
  const shoulder = top + E.head * 2;
  s.clear();
  s.begin();
  s.poly(
    [
      [sway - E.neck, shoulder],
      [sway + E.neck, shoulder],
      [E.foot, 0],
      [-E.foot, 0],
    ],
    X.body,
  );
  s.dot(sway, top + E.head, E.head, X.body);
  for (const side of [-1, 1])
    s.taper(
      sway + side * E.neck * 0.8,
      shoulder + 1.5,
      sway + side * E.arm.out,
      shoulder + 1.5 - E.arm.up,
      E.arm.thick,
      E.arm.thick * 0.7,
      X.body,
    );
  s.stroke(-E.foot, -0.6, E.foot, -0.6, 0.9, X.mid);
  s.shadeEdges(X.body, X.light, X.mid, 2);
  s.shadeEdges(X.mid, X.body, X.shade);
  s.commit();
  s.begin();
  s.stroke(sway - 0.8, shoulder + 2, -0.6, shoulder + 9, 0.35, X.light);
  s.dot(-0.6, shoulder + 9.4, 0.6, X.light);
  s.block(sway + 0.4, top + E.head - 0.5, X.ink, 0.5, 1);
  s.block(sway + 1.8, top + E.head - 0.5, X.ink, 0.5, 1);
  s.commit(false);
  s.outline(X.ink);
  s.begin();
  E.flames.forEach(([across, burn], i) => {
    paintFlame(s, {
      x: sway + across,
      y: top + 0.6 + Math.abs(across) * 0.3,
      tall: burn,
      wide: E.flameWide,
      bend: 0,
      lift: 0,
      t: Math.floor(t * 12) / 12,
      seed: i * 2.1,
    });
  });
  s.commit(false);
  blit(s, x, y, false);
}
