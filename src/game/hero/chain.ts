import type { RopePoint } from "../../types/hero";

/** A verlet rope hanging from an anchor: the scarf and the ponytail. */
export class Chain {
  readonly points: RopePoint[];
  private ready = false;
  constructor(
    count: number,
    private readonly segment: number,
    private readonly gravity: number,
  ) {
    this.points = Array.from({ length: count }, () => ({ x: 0, y: 0, px: 0, py: 0 }));
  }
  /** move the whole rope, for a teleport */
  shift(dx: number, dy: number): void {
    for (const q of this.points) {
      q.x += dx;
      q.y += dy;
      q.px += dx;
      q.py += dy;
    }
  }
  step(ax: number, ay: number, dt: number, wind: number): void {
    const p = this.points;
    if (!this.ready) {
      for (const q of p) Object.assign(q, { x: ax, y: ay, px: ax, py: ay });
      this.ready = true;
    }
    Object.assign(p[0], { x: ax, y: ay, px: ax, py: ay });
    for (let i = 1; i < p.length; i++) {
      const q = p[i];
      const vx = (q.x - q.px) * 0.92;
      const vy = (q.y - q.py) * 0.92;
      q.px = q.x;
      q.py = q.y;
      q.x += vx + wind * dt * dt;
      q.y += vy + this.gravity * dt * dt;
    }
    for (let k = 0; k < 4; k++)
      for (let i = 1; i < p.length; i++) {
        const a = p[i - 1];
        const b = p[i];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1e-4;
        const f = (d - this.segment) / d;
        if (i === 1) {
          b.x -= dx * f;
          b.y -= dy * f;
        } else {
          a.x += dx * f * 0.5;
          a.y += dy * f * 0.5;
          b.x -= dx * f * 0.5;
          b.y -= dy * f * 0.5;
        }
      }
  }
}
