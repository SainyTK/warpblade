import type { CharacterDef } from "../types/character";
import { loadGeneratedHeroArt } from "./load";
import type { GeneratedHeroArt } from "./types";

export function bindTrainingHeroPicker(
  select: HTMLSelectElement,
  status: HTMLElement,
  roster: readonly CharacterDef[],
  onChange: (hero: CharacterDef, art: GeneratedHeroArt) => void,
): void {
  const heroes = new Map(roster.map((hero) => [hero.id, hero]));
  let active = select.value || roster[0]?.id;
  let generation = 0;
  select.replaceChildren(...roster.map((hero) => new Option(hero.name, hero.id)));
  select.value = active ?? "";
  select.addEventListener("change", async () => {
    const selected = heroes.get(select.value);
    if (!selected) {
      return;
    }
    const request = ++generation;
    status.textContent = "Loading character";
    try {
      const art = await loadGeneratedHeroArt(selected.id);
      if (request !== generation) {
        return;
      }
      if (!art) {
        throw new Error(`No generated art for ${selected.id}`);
      }
      onChange(selected, art);
      active = selected.id;
      status.textContent = "";
    } catch {
      if (request === generation) {
        status.textContent = `Could not load ${selected.name}`;
        select.value = active ?? "";
      }
    }
  });
}
