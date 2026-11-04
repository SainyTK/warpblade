import { el } from "../dom";

/** grey shapes of feedback cards while the list loads */
export function skeletonCards(count: number): DocumentFragment {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const card = el("div", "feedback-card panel skeleton-card");
    card.setAttribute("aria-hidden", "true");
    card.append(
      el("span", "skeleton skeleton-line skeleton-short"),
      el("span", "skeleton skeleton-line"),
      el("span", "skeleton skeleton-line skeleton-mid"),
    );
    fragment.append(card);
  }
  return fragment;
}
