import type { ElementSounds, HitMaterial, MusicTrack, SoundId, SoundSpec } from "../types/audio";
import type { ElementId, StageId } from "../types/campaign";
import type { DrillSpellLook } from "../types/drill";
import type { EnemyType } from "../types/enemy";

export const AUDIO_DIR = `${import.meta.env.BASE_URL}audio`;

export const SAME_SOUND_GAP = 0.03;

export const SFX_LEVEL = 0.8;

export const MUSIC_LEVEL = 0.32;

export const MUSIC_FADE = 1.2;

export const LAND_SOUND_SPEED = 140;

const spec = (files: readonly string[], volume: number, pitchSpread: number, voices: number): SoundSpec => ({
  files,
  volume,
  pitchSpread,
  voices,
});

export const SOUNDS: Record<SoundId, SoundSpec> = {
  swing: spec(["swing-1", "swing-2", "swing-3"], 0.32, 0.08, 3),
  swingHeavy: spec(["swing-heavy-1", "swing-heavy-2"], 0.42, 0.06, 2),
  hitFlesh: spec(["hit-flesh-1", "hit-flesh-2", "hit-flesh-3"], 0.5, 0.1, 4),
  hitHeavy: spec(["hit-heavy-1", "hit-heavy-2"], 0.6, 0.06, 2),
  hitArmour: spec(["hit-armour-1", "hit-armour-2"], 0.42, 0.08, 3),
  hitSlime: spec(["hit-slime-1", "hit-slime-2"], 0.55, 0.12, 3),
  crit: spec(["crit"], 0.32, 0.05, 2),
  keen: spec(["keen"], 0.3, 0.04, 1),
  warp: spec(["warp"], 0.36, 0.05, 2),
  dash: spec(["dash"], 0.3, 0.08, 2),
  jump: spec(["jump"], 0.16, 0.06, 1),
  doubleJump: spec(["jump-double"], 0.14, 0.05, 1),
  land: spec(["land"], 0.22, 0.1, 1),
  block: spec(["block-1", "block-2"], 0.4, 0.08, 3),
  parry: spec(["parry"], 0.42, 0.03, 2),
  hurt: spec(["hurt"], 0.38, 0.05, 2),
  defeat: spec(["defeat"], 0.45, 0, 1),
  foeDeath: spec(["foe-death"], 0.3, 0.12, 3),
  cast: spec(["cast"], 0.28, 0.06, 2),
  spellBlaze: spec(["spell-fire"], 0.4, 0.06, 3),
  spellFrost: spec(["spell-ice"], 0.36, 0.06, 3),
  spellStorm: spec(["spell-lightning"], 0.24, 0.06, 3),
  spellVenom: spec(["spell-venom"], 0.38, 0.1, 3),
  spellVoid: spec(["spell-void"], 0.26, 0.05, 2),
  resonance: spec(["resonance"], 0.09, 0.04, 2),
  chargeStep: spec(["charge-step"], 0.2, 0, 1),
  chargeRelease: spec(["charge-release"], 0.42, 0.04, 2),
  boom: spec(["boom-1", "boom-2"], 0.36, 0.08, 3),
  thunder: spec(["thunder"], 0.36, 0.05, 2),
  shatter: spec(["shatter"], 0.34, 0.08, 2),
  levelUp: spec(["level-up"], 0.34, 0, 1),
  learn: spec(["learn"], 0.26, 0, 1),
  pickup: spec(["pickup"], 0.12, 0.08, 2),
  coin: spec(["coin"], 0.14, 0.1, 3),
  chest: spec(["chest"], 0.32, 0, 1),
  bossRoar: spec(["boss-roar"], 0.5, 0.04, 1),
  bossDefeat: spec(["boss-defeat"], 0.5, 0, 1),
  surge: spec(["surge"], 0.3, 0, 1),
  gate: spec(["gate"], 0.5, 0.04, 1),
  stageClear: spec(["stage-clear"], 0.38, 0, 1),
  mapSelect: spec(["map-select"], 0.3, 0, 1),
  menuMove: spec(["menu-move"], 0.18, 0, 1),
  menuConfirm: spec(["menu-confirm"], 0.26, 0, 1),
  denied: spec(["denied"], 0.2, 0, 1),
  perfect: spec(["perfect"], 0.3, 0.02, 1),
  lunge: spec(["lunge"], 0.24, 0.08, 2),
  tired: spec(["tired"], 0.24, 0.08, 1),
};

export const MATERIAL_SOUND: Record<HitMaterial, SoundId> = {
  flesh: "hitFlesh",
  armour: "hitArmour",
  slime: "hitSlime",
};

export const FOE_MATERIAL: Partial<Record<EnemyType, HitMaterial>> = {
  warden: "armour",
  golem: "armour",
  oakheart: "armour",
  riftknight: "armour",
  forgeguard: "armour",
  cindersmith: "armour",
  shardling: "armour",
  skyguard: "armour",
  tomeguard: "armour",
  sovereign: "armour",
  mire: "slime",
  boghulk: "slime",
  bogleech: "slime",
  slagling: "slime",
  sparkjelly: "slime",
  inkling: "slime",
  rotcrawler: "slime",
  sporepuff: "slime",
  spitbloom: "slime",
  sporeheart: "slime",
  maw: "slime",
};

export const SPELL_SOUND: ElementSounds = {
  blaze: "spellBlaze",
  frost: "spellFrost",
  storm: "spellStorm",
  venom: "spellVenom",
  void: "spellVoid",
};

export const LOOK_ELEMENT: Record<DrillSpellLook, ElementId> = {
  flame: "blaze",
  shard: "frost",
  spark: "storm",
};

export const RESONANCE_PITCH: Record<ElementId, number> = {
  blaze: 0.9,
  frost: 1.25,
  storm: 1.1,
  venom: 0.8,
  void: 0.7,
};

export const MUSIC_FILES: Record<MusicTrack, string> = {
  map: "map",
  stage1: "stage-1",
  stage2: "stage-2",
  stage3: "stage-3",
  stage4: "stage-4",
  boss: "boss",
};

export const STAGE_MUSIC: Record<StageId, MusicTrack> = {
  prologue: "stage1",
  marsh: "stage2",
  foundry: "stage3",
  glacier: "stage4",
  skyway: "stage1",
  archive: "stage2",
  moonlit: "stage4",
  veil: "stage3",
  blight: "stage2",
  citadel: "stage3",
};
