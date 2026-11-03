import type { JobEvent, JobView } from '@shared/api';

/** A job view after one streamed event. A reset leaves the view as it was; the caller reloads it. */
export function applyJobEvent(view: JobView, event: JobEvent): JobView {
  const next = { ...view, seq: event.seq };
  switch (event.type) {
    case 'upsert': {
      const index = view.items.findIndex((item) => item.id === event.item.id);
      const items =
        index === -1
          ? [...view.items, event.item]
          : view.items.map((item, i) => (i === index ? event.item : item));
      return { ...next, items };
    }
    case 'append':
      return {
        ...next,
        items: view.items.map((item) =>
          item.id === event.id && (item.kind === 'text' || item.kind === 'thinking')
            ? { ...item, text: item.text + event.text }
            : item,
        ),
      };
    case 'run':
      return { ...next, run: event.run };
    case 'preview':
      return { ...next, preview: event.preview };
    case 'place':
      return { ...next, branch: event.branch, workdir: event.workdir };
    default:
      return view;
  }
}
