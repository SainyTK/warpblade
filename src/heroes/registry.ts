import type { HeroModule } from "../types/heroModule";
import type { HeroId } from "./roster";

let modules: Readonly<Record<HeroId, HeroModule>> | undefined;

export function registerHeroes(all: Readonly<Record<HeroId, HeroModule>>): void {
  modules = all;
}

export function heroModule(id: string): HeroModule {
  if (!modules) {
    throw new Error(`The hero registry is empty while reading ${id}: the app entry imports src/heroes first.`);
  }
  return modules[id as HeroId];
}
