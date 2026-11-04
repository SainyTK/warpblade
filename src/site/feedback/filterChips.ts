import { el } from "../dom";

export interface FilterOption<T> {
  value: T;
  label: string;
}

export interface FilterChips<T> {
  element: HTMLElement;
  value(): T;
  set(value: T): void;
}

/** a labelled row of toggle chips where one is on */
export function filterChips<T>(
  label: string,
  options: readonly FilterOption<T>[],
  onChange: () => void,
): FilterChips<T> {
  const element = el("div", "filter-row");
  element.setAttribute("role", "group");
  element.setAttribute("aria-label", label);
  let current = options[0]?.value as T;
  const buttons = options.map((option) => {
    const button = el("button", "filter-chip", option.label);
    button.type = "button";
    button.addEventListener("click", () => {
      set(option.value);
      onChange();
    });
    return { option, button };
  });
  function set(value: T): void {
    current = value;
    for (const { option, button } of buttons) button.setAttribute("aria-pressed", String(option.value === value));
  }
  set(current);
  element.append(el("span", "filter-label", label), ...buttons.map(({ button }) => button));
  return { element, value: () => current, set };
}
