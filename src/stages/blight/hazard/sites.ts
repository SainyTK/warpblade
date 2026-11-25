import { W } from "../../../constants/stage";
import { BLIGHT_AREAS, BLIGHT_HAZARDS, type DriftSite } from "../layout";

export interface PoolSite {
  x0: number;
  x1: number;
  offset: number;
}

export interface CloudSite extends DriftSite {
  phase: number;
}

const starts = BLIGHT_AREAS.reduce<number[]>((list, _area, i) => {
  list.push(i === 0 ? 0 : list[i - 1] + BLIGHT_AREAS[i - 1].length + W);
  return list;
}, []);

export const POOL_SITES: readonly PoolSite[] = BLIGHT_HAZARDS.flatMap((sites, i) =>
  sites.pools.map((p, k) => ({ x0: starts[i] + p.x0, x1: starts[i] + p.x1, offset: (k * 1.37 + i * 0.61) % 1 })),
);

export const CLOUD_SITES: readonly CloudSite[] = BLIGHT_HAZARDS.flatMap((sites, i) =>
  sites.clouds.map((c, k) => ({ ...c, x: starts[i] + c.x, phase: k * 2.1 + i })),
);
