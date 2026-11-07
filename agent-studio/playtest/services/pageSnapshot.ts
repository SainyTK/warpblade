import type { Page } from "playwright-core";
import { GAME_MODULES, SELECTORS } from "../constants/game";
import type { MenuStateModule, RunEndModule, StateModule } from "../types/gameModules";
import type { GameSnapshot } from "../types/snapshot";

const ARGS = { modules: GAME_MODULES, selectors: SELECTORS };

/** read the game's state, the HUD, the menu and any open pick, in one round trip */
export function readSnapshot(page: Page): Promise<GameSnapshot> {
  return page.evaluate(async ({ modules, selectors }) => {
    const [state, menu, runEnd] = (await Promise.all([
      import(modules.state),
      import(modules.menuState),
      import(modules.runEnd),
    ])) as [StateModule, MenuStateModule, RunEndModule];
    const { game, hero, progress, character } = state;
    const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const inMenu = focused?.closest(selectors.menu) ? focused : null;
    const ult = document.querySelector<HTMLElement>(selectors.ultRow);
    const dialog = document.querySelector<HTMLDialogElement>(selectors.pickDialog);
    const cards = dialog?.open ? [...document.querySelectorAll<HTMLElement>(selectors.pickCard)] : [];
    return {
      mode: game.mode,
      wave: game.wave,
      lull: game.lull,
      kills: game.kills,
      coins: game.coins,
      level: progress.level,
      picks: progress.picks,
      ultimate: progress.ultimate,
      hero: {
        id: character.id,
        x: hero.x,
        y: hero.y,
        hp: hero.hp,
        maxHp: progress.stats.hp,
        mp: hero.mp,
        maxMp: progress.stats.mp,
        stamina: hero.stamina,
        state: hero.state,
        face: hero.face,
        ground: hero.ground,
      },
      enemies: game.enemies.map((e) => ({
        type: e.type,
        rank: e.rank,
        x: e.x,
        y: e.y,
        hp: e.hp,
        state: e.state,
        face: e.face,
        stun: e.stun,
        air: e.air,
      })),
      hud: {
        waveText: document.querySelector(selectors.waveText)?.textContent ?? "",
        levelText: document.querySelector(selectors.levelText)?.textContent ?? "",
        hpWidth: document.querySelector<HTMLElement>(selectors.hpFill)?.style.width ?? "",
        tabs: [...document.querySelectorAll<HTMLElement>(selectors.hudTab)].map((tab) => ({
          id: tab.id,
          label: tab.textContent ?? "",
          // a tab inside a hidden group (another hero's rites) is not on screen either
          visible: tab.checkVisibility(),
          ready: !tab.classList.contains("wait"),
          selected: tab.classList.contains("on"),
        })),
        ultVisible: Boolean(ult?.checkVisibility()),
        ultPips: document.querySelectorAll(selectors.ultPip).length,
      },
      menu: {
        context: menu.menuContext(),
        screen: menu.menuScreen(),
        title: document.querySelector("#menuTitle")?.textContent ?? "",
        focus: inMenu
          ? {
              text: inMenu.textContent?.trim() ?? "",
              opens: inMenu.dataset.opens ?? "",
              hero: inMenu.dataset.hero ?? "",
            }
          : null,
      },
      pick: cards.map((card, index) => ({
        index,
        kind: card.dataset.kind ?? card.dataset.branch ?? "",
        branch: card.dataset.branch ?? "",
        name: card.querySelector(".pick-name")?.textContent ?? "",
        level: card.querySelectorAll(".pick-pips i.had, .pick-pips i.gain").length,
        selected: card.classList.contains("selected"),
      })),
      lastRun: runEnd.lastRun(),
    };
  }, ARGS);
}
