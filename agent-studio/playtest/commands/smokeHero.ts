import { ACTION_KEYS, KEYS } from "../constants/keys";
import type { Check } from "../types/report";
import type { Session } from "../types/session";
import type { GameSnapshot } from "../types/snapshot";

const WAVE_TIMEOUT_MS = 6_000;
const HURT_TIMEOUT_MS = 30_000;
const WALK_MS = 600;
const WALK_MIN_PX = 5;
const ACTION_PRESS_MS = 120;
const ACTION_SETTLE_MS = 500;
/** the HP bar may lag the hero's HP by this many percent */
const HP_BAR_SLACK = 1.5;

type Add = (name: string, ok: boolean, detail?: string) => void;

async function walk(session: Session, key: string): Promise<number> {
  const before = (await session.state()).hero.x;
  await session.press(key, WALK_MS);
  return (await session.state()).hero.x - before;
}

async function checkWaveHud(session: Session, add: Add): Promise<void> {
  const state = await session.waitFor((s) => s.wave >= 1, WAVE_TIMEOUT_MS, "wave 1");
  const waveOk = state.hud.waveText.includes(`WAVE ${state.wave}/`);
  const levelOk = state.hud.levelText === `LV ${state.level}`;
  add("HUD shows the wave and level", waveOk && levelOk, `"${state.hud.waveText}", "${state.hud.levelText}"`);
}

async function checkWalk(session: Session, add: Add): Promise<void> {
  const right = await walk(session, KEYS.right);
  const left = await walk(session, KEYS.left);
  add(
    "hero walks both ways",
    right > WALK_MIN_PX && left < -WALK_MIN_PX,
    `D moved ${right.toFixed(1)} px, A ${left.toFixed(1)} px`,
  );
}

/** every action key once; J must start a blow and W a jump, the rest must at least not break anything */
async function checkActions(session: Session, add: Add): Promise<void> {
  const seen: string[] = [];
  const outcomes = new Map<string, GameSnapshot>();
  for (const key of ACTION_KEYS) {
    const errorsBefore = session.errors().length;
    const before = await session.state();
    await session.press(key, ACTION_PRESS_MS);
    const after = await session.state();
    outcomes.set(key, after);
    seen.push(`${key}: ${before.hero.state} to ${after.hero.state}`);
    await session.advance(ACTION_SETTLE_MS);
    add(`${key} raises no errors`, session.errors().length === errorsBefore);
  }
  const attack = outcomes.get(KEYS.attack);
  const jump = outcomes.get(KEYS.up);
  add("J starts an attack", attack !== undefined && attack.hero.state !== "idle", seen.join(", "));
  add("W leaves the ground", jump !== undefined && !jump.hero.ground);
}

async function checkPause(session: Session, add: Add): Promise<void> {
  await session.tap(KEYS.pause);
  const paused = await session.state();
  await session.tap(KEYS.pause);
  const resumed = await session.state();
  add("Escape opens and closes the pause menu", paused.menu.context === "pause" && resumed.menu.context === null);
}

/** stand still until a foe lands a blow, then the HP bar must match the HP left */
async function checkHpBar(session: Session, add: Add): Promise<void> {
  const state = await session.waitFor((s) => s.hero.hp < s.hero.maxHp, HURT_TIMEOUT_MS, "the hero to be hurt");
  const shown = Number.parseFloat(state.hud.hpWidth);
  const expected = (state.hero.hp / state.hero.maxHp) * 100;
  add(
    "HP bar follows damage",
    Math.abs(shown - expected) <= HP_BAR_SLACK,
    `bar ${shown.toFixed(1)}%, HP ${expected.toFixed(1)}%`,
  );
}

/** start a run with this hero through the menu and try everything a player does in the first seconds */
export async function smokeHero(session: Session, heroId: string): Promise<Check[]> {
  const checks: Check[] = [];
  const add: Add = (name, ok, detail) => checks.push({ name, hero: heroId, ok, detail });
  try {
    await session.startRun(heroId);
    add("run starts through the menu", true);
    await checkWaveHud(session, add);
    await checkWalk(session, add);
    await checkActions(session, add);
    await checkPause(session, add);
    await checkHpBar(session, add);
  } catch (error) {
    add("hero smoke test finished", false, String(error));
  }
  const errors = session.errors();
  add("no page or console errors", errors.length === 0, errors.join(" | ") || undefined);
  return checks;
}
