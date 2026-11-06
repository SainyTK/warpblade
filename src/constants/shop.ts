import type { ShopItem } from "../types/shop";

/** each level of a stat costs this many times the one before, rounded to PRICE_ROUND */
export const PRICE_GROWTH = 1.6;
export const PRICE_ROUND = 5;

/** Everything the shop sells, in the order it lists them. */
export const SHOP_ITEMS: readonly ShopItem[] = [
  { kind: "stat", id: "vitality", name: "Vitality", text: "Max HP +10.", stat: "hp", per: 10, levels: 5, price: 20 },
  { kind: "stat", id: "edge", name: "Honed Edge", text: "Attack damage +1.", stat: "ad", per: 1, levels: 5, price: 30 },
  { kind: "stat", id: "arcana", name: "Arcana", text: "Ability power +1.", stat: "ap", per: 1, levels: 5, price: 30 },
  {
    kind: "stat",
    id: "wellspring",
    name: "Wellspring",
    text: "Max MP +10.",
    stat: "mp",
    per: 10,
    levels: 5,
    price: 20,
  },
  {
    kind: "stat",
    id: "precision",
    name: "Precision",
    text: "Crit chance +2%.",
    stat: "crit",
    per: 0.02,
    levels: 5,
    price: 30,
  },
  {
    kind: "stat",
    id: "fleet",
    name: "Light Boots",
    text: "Move speed +3%.",
    stat: "move",
    per: 0.03,
    levels: 4,
    price: 25,
  },
  {
    kind: "stat",
    id: "lungs",
    name: "Endurance",
    text: "Max stamina +10.",
    stat: "stamina",
    per: 10,
    levels: 5,
    price: 20,
  },
  {
    kind: "skill",
    id: "lodestone",
    name: "Lodestone",
    text: "Coins fly to your hero at once, and foes drop a quarter more.",
    price: 60,
  },
  {
    kind: "skill",
    id: "warpShock",
    name: "Warp Shock",
    text: "Warp strikes and vault landings send a shockwave through foes close by.",
    price: 150,
  },
  {
    kind: "skill",
    id: "headStart",
    name: "Head Start",
    text: "Start every run at level 3, with two skill points.",
    price: 200,
  },
  {
    kind: "skill",
    id: "lastLight",
    name: "Last Light",
    text: "Once per run, a fatal blow leaves your hero standing with half their HP.",
    price: 300,
  },
];
