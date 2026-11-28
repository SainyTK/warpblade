import type { LegacyShopPrice } from "../types/armory";

export const LEGACY_PRICE_GROWTH = 1.6;
export const LEGACY_PRICE_ROUND = 5;

export const LEGACY_SHOP_PRICES: Readonly<Record<string, LegacyShopPrice>> = {
  vitality: { firstPrice: 20, levels: 5 },
  edge: { firstPrice: 30, levels: 5 },
  arcana: { firstPrice: 30, levels: 5 },
  wellspring: { firstPrice: 20, levels: 5 },
  precision: { firstPrice: 30, levels: 5 },
  fleet: { firstPrice: 25, levels: 4 },
  lungs: { firstPrice: 20, levels: 5 },
  rerolls: { firstPrice: 30, levels: 3 },
  skips: { firstPrice: 25, levels: 3 },
  banishes: { firstPrice: 35, levels: 3 },
  lodestone: { firstPrice: 60, levels: 1 },
  warpShock: { firstPrice: 150, levels: 1 },
  headStart: { firstPrice: 200, levels: 1 },
  lastLight: { firstPrice: 300, levels: 3 },
};

export const LEGACY_REMOVED_HERO_PRICES: Readonly<Record<string, number>> = {
  sable: 300,
  hulda: 400,
  orrin: 550,
  mirel: 750,
  wenna: 1000,
  tallis: 1350,
  jory: 1800,
  brannoc: 2450,
};
