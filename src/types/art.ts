import type { ArtId, ElementId } from "./campaign";
import type { DrillSpellLook, ElementImpact, ElementProjectile } from "./drill";
import type { Enemy } from "./enemy";

export interface ArtLevel {
  cardText: string;
  damageTimesAttack: number;
  radius: number;
  range: number;
  speed: number | null;
  delay: number;
  freeze: number;
}

export interface ArtDef {
  id: ArtId;
  name: string;
  element: ElementId;
  color: number;
  core: number;
  look: DrillSpellLook;
  levels: readonly [ArtLevel, ArtLevel, ArtLevel, ArtLevel, ArtLevel];
  status?(foe: Enemy, level: number): void;
  burst?(x: number, y: number, level: number): void;
  drawBolt?(bolt: ElementProjectile): void;
  drawImpact?(impact: ElementImpact): void;
}
