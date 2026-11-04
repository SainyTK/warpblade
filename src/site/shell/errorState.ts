import { el } from "../dom";

/** what failed, with a Retry button */
export function errorState(text: string, retry: () => void): HTMLElement {
  const box = el("div", "state-box state-error");
  box.setAttribute("role", "alert");
  const button = el("button", "button", "Retry");
  button.type = "button";
  button.addEventListener("click", retry);
  box.append(el("p", "state-text", text), button);
  return box;
}
