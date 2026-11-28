import { pathToFileURL } from "node:url";
import { GAME_MODULES } from "../constants";
import type { Game, Random, ResonanceRules, StageDef, StageMods } from "../types/game";

type Fn = (...args: never[]) => unknown;

type ModuleExports = Record<string, unknown>;

type GameExports = Record<keyof typeof GAME_MODULES, ModuleExports>;

function checkedExports(bundle: Record<string, unknown>): GameExports {
  for (const [key, { path, names }] of Object.entries(GAME_MODULES)) {
    const module = bundle[key] as ModuleExports | undefined;
    for (const name of names) {
      if (module?.[name] === undefined) {
        throw new Error(`the game no longer exports ${name} from ${path}`);
      }
    }
  }
  return bundle as GameExports;
}

export async function loadGame(bundleFile: string): Promise<Game> {
  const loaded = checkedExports(await import(pathToFileURL(bundleFile).href));
  const fn = <T extends Fn>(module: Record<string, unknown>, name: string): T => module[name] as T;
  const value = <T>(module: Record<string, unknown>, name: string): T => module[name] as T;
  const Rng = value<new (seed: number) => Random>(loaded.rng, "Rng");
  const kindOf = fn<(foe: string) => { flies?: boolean }>(loaded.kinds, "kindOf");
  const bossProfile = fn<(foe: string) => { adds: readonly string[] } | null>(loaded.bossFight, "bossProfile");
  const stageModsOf = fn<(stage: StageDef, hyper: boolean) => StageMods>(loaded.stageArc, "stageMods");
  const pactTotals = fn<(hero: unknown, build: unknown) => { power: number }>(loaded.pacts, "pactTotals");
  const resonanceRanks = fn<(build: unknown, hero: unknown, arts: unknown) => ReturnType<Game["resonanceRanks"]>>(
    loaded.ranks,
    "resonanceRanks",
  );
  const roomBeats = value<{ parPerSurgeFoe: number; parPerBigFoe: number }>(loaded.arc, "ROOM_BEATS");
  const mastery = value<{ levels: number }>(loaded.growth, "MASTERY");
  const charge = value<{ ranks: number; damage: number }>(loaded.growth, "CHARGE_RANK");
  const attunement = value<{ levels: number }>(loaded.growth, "ATTUNEMENT");

  return {
    heroes: value(loaded.roster, "CHARACTERS"),
    stageOrder: value(loaded.graph, "STAGE_ORDER"),
    stages: value(loaded.stages, "STAGES"),
    stageArcs: value(loaded.arc, "STAGE_ARCS"),
    parPerSurgeFoe: roomBeats.parPerSurgeFoe,
    parPerBigFoe: roomBeats.parPerBigFoe,
    flyerToughness: value(loaded.arc, "FLYER_TOUGHNESS"),
    finaleFoe: value<{ foe: string }>(loaded.waves, "FINALE").foe,
    growth: {
      skillMaxLevel: value(loaded.growth, "SKILL_MAX_LEVEL"),
      skillSlots: value(loaded.growth, "SKILL_SLOTS"),
      masteryLevels: mastery.levels,
      chargeRanks: charge.ranks,
      chargeDamage: charge.damage,
      attunementLevels: attunement.levels,
    },
    resonance: {
      blaze: value<ResonanceRules["blaze"]>(loaded.resonance, "BLAZE"),
      frost: value<ResonanceRules["frost"]>(loaded.resonance, "FROST"),
      storm: value<ResonanceRules["storm"]>(loaded.resonance, "STORM"),
      venom: value<ResonanceRules["venom"]>(loaded.resonance, "VENOM"),
      void: value<ResonanceRules["void"]>(loaded.resonance, "VOID"),
    },
    boons: value(loaded.boons, "BOONS"),
    random: (seed) => new Rng(seed),
    stageMods: (stage) => stageModsOf(stage, false),
    buildRoute: fn(loaded.route, "buildRoute"),
    ladderChoices: fn(loaded.ladder, "ladderChoices"),
    ladderFoe: fn(loaded.route, "ladderFoe"),
    ladderHp: fn(loaded.stageArc, "ladderHp"),
    flies: (foe) => kindOf(foe).flies === true,
    bossAdds: (foe) => bossProfile(foe)?.adds ?? [],
    levelBetween: fn(loaded.stageArc, "levelBetween"),
    bandWave: fn(loaded.stageArc, "bandWave"),
    freshBuild: fn(loaded.build, "freshBuild"),
    cardCount: fn(loaded.cards, "cardCount"),
    dealCards: fn(loaded.cards, "dealCards"),
    picksBetween: fn(loaded.supply, "picksBetween"),
    rollChest: fn(loaded.chests, "rollChest"),
    computeStats: fn(loaded.stats, "computeStats"),
    heldRows: fn(loaded.skills, "heldRows"),
    growthRows: fn(loaded.skills, "growthRows"),
    pactPower: (hero, held) => pactTotals(hero, held).power,
    resonanceRanks: (held, hero) => resonanceRanks(held, hero, value(loaded.arts, "ARTS")),
    resonanceStats: fn(loaded.ranks, "resonanceStats"),
    activeFusions: fn(loaded.ranks, "activeFusions"),
  };
}
