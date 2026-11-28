import type { Session } from "../../types/session";
import { MIN_HIT_LOSS, RECORDER_TUNING, RECORDING_KEY, ROOM_MODULES } from "./constants";
import type { StateModule } from "./pageModules";
import type { Hit, Recording, Reward } from "./types";

export function installRecorder(session: Session): Promise<void> {
  return session.evaluate(
    async ({ path, tuning, minLoss, key }) => {
      const { game, hero, progress } = (await import(path)) as StateModule;
      const neutral = new Set<string>(tuning.neutralStates);
      interface Chain {
        start: number | null;
        lastStart: number | null;
        lastEnd: number | null;
      }
      const chains = new WeakMap<object, Chain>();
      const recording: Recording = { hits: [], rewards: [] };
      (globalThis as unknown as Record<string, Recording>)[key] = recording;
      const origin = performance.now();
      let lastHp = hero.hp;
      let lastLevel = progress.level;
      let lastShards = progress.heartShards + progress.manaShards;
      let lastEvolved = progress.build.evolved.length;
      let lastMode = game.mode;
      const reward = (t: number, kind: Reward["kind"]) => recording.rewards.push({ t, kind });
      const windupOf = (chain: Chain | undefined, now: number): number | null => {
        if (!chain) return null;
        if (chain.start !== null) return Math.round(now - chain.start);
        if (chain.lastEnd !== null && chain.lastStart !== null && now - chain.lastEnd < tuning.chainMemoryMs) {
          return Math.round(now - chain.lastStart);
        }
        return null;
      };
      const loop = () => {
        const now = performance.now();
        const t = Math.round(now - origin);
        for (const foe of game.enemies) {
          const active = !neutral.has(foe.state) && foe.hp > 0;
          let chain = chains.get(foe);
          if (!chain) {
            chain = { start: active ? now : null, lastStart: null, lastEnd: null };
            chains.set(foe, chain);
          }
          if (active && chain.start === null) chain.start = now;
          if (!active && chain.start !== null) {
            chain.lastStart = chain.start;
            chain.lastEnd = now;
            chain.start = null;
          }
        }
        const loss = lastHp - hero.hp;
        if (loss >= minLoss) {
          const sources = game.enemies
            .filter((foe) => foe.hp > 0 || (chains.get(foe)?.lastEnd ?? -1e9) > now - tuning.goneGraceMs)
            .map((foe) => {
              const chain = chains.get(foe);
              return {
                foe,
                dx: Math.abs(foe.x - hero.x),
                active: chain?.start !== null,
                windupMs: windupOf(chain, now),
              };
            })
            .filter((source) => source.windupMs !== null)
            .sort((a, b) => a.dx - b.dx);
          const source = sources.find((s) => s.active && s.dx < tuning.nearReach) ?? sources[0] ?? null;
          const hit: Hit = {
            t,
            loss,
            windupMs: source?.windupMs ?? null,
            foe: source?.foe.type ?? null,
            state: source?.foe.state ?? null,
          };
          recording.hits.push(hit);
        }
        lastHp = hero.hp;
        if (progress.level > lastLevel) reward(t, "level");
        if (progress.heartShards + progress.manaShards > lastShards) reward(t, "shard");
        if (progress.build.evolved.length > lastEvolved) reward(t, "evolution");
        if (game.mode === "chest" && lastMode !== "chest") reward(t, "chest");
        if (game.mode === "pick" && lastMode !== "pick") reward(t, "pick");
        lastLevel = progress.level;
        lastShards = progress.heartShards + progress.manaShards;
        lastEvolved = progress.build.evolved.length;
        lastMode = game.mode;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },
    { path: ROOM_MODULES.state, tuning: RECORDER_TUNING, minLoss: MIN_HIT_LOSS, key: RECORDING_KEY },
  );
}
