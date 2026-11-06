import { bank } from "../../store/meta";
import { coinAmount } from "../coinIcon";
import { el } from "../dom";
import { lockIcon } from "./lockIcon";

/** how long a refused press shakes the price */
const DENY_MS = 400;

export interface HeroLock {
  root: HTMLElement;
  price: number;
  /** the price, or the question in its place once a press asked */
  show: (armed: boolean) => void;
  /** shake the price: the bank cannot pay for it */
  deny: () => void;
}

/** the padlock and the price of a locked hero, on the hero screen */
export function heroLock(price: number): HeroLock {
  const root = el("span", "hero-lock");
  const show = (armed: boolean): void => {
    if (armed) {
      root.replaceChildren(lockIcon(), "Unlock? Press again");
      return;
    }
    const tag = coinAmount(price);
    if (price > bank()) tag.classList.add("short");
    root.replaceChildren(lockIcon(), tag);
  };
  const deny = (): void => {
    root.classList.remove("deny");
    void root.offsetWidth;
    root.classList.add("deny");
    setTimeout(() => root.classList.remove("deny"), DENY_MS);
  };
  show(false);
  return { root, price, show, deny };
}
