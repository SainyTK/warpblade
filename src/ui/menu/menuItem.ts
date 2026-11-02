/** a menu entry; with confirm, the first press asks again in its place and only the second one acts */
export function menuItem(label: string, onSelect: () => void, confirm?: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "menu-item";
  button.dataset.nav = "";
  button.textContent = label;
  button.addEventListener("click", () => {
    if (confirm && button.dataset.armed === undefined) {
      button.dataset.armed = "";
      button.textContent = confirm;
      return;
    }
    onSelect();
  });
  if (confirm)
    button.addEventListener("blur", () => {
      delete button.dataset.armed;
      button.textContent = label;
    });
  return button;
}
