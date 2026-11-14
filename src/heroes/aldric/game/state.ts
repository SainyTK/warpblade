import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import type { AldricAbility, AldricState } from "../types/state";

const perAbility = (n: number): Record<AldricAbility, number> => ({ rush: n, pillar: n, lance: n, mend: n, rally: n });

const fresh = (): AldricState => ({
  valor: 0,
  radiance: 0,
  bashT: -1,
  bashCd: 0,
  counter: false,
  sinceBlock: 99,
  barrier: 0,
  barrierBlows: 0,
  cd: perAbility(0),
  cdFull: perAbility(1),
  castAbility: "rush",
  castWide: false,
  castPower: 1,
  guardStride: 0,
  waved: false,
  rally: 0,
  mending: 0,
  domeX: 0,
  domeR: 0,
  domeLeft: 0,
});

/** the one owner of what Aldric's kit remembers; the HUD reads Valor from it, so a guest gets their own */
export const aldric: AldricState = fresh();
rememberPerSeat(objectMemory(aldric));

/** a fresh run */
export function resetAldricState(): void {
  Object.assign(aldric, fresh());
}

/** the timers run down */
export function tickAldricState(dt: number): void {
  aldric.bashCd = Math.max(0, aldric.bashCd - dt);
  aldric.sinceBlock += dt;
  aldric.barrier = Math.max(0, aldric.barrier - dt);
  if (aldric.barrier <= 0) aldric.barrierBlows = 0;
  aldric.domeLeft = Math.max(0, aldric.domeLeft - dt);
  aldric.rally = Math.max(0, aldric.rally - dt);
  aldric.mending = Math.max(0, aldric.mending - dt);
}
