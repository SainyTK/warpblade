import type { ReactNode } from 'react';

/** A titled group in a side panel. */
export function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-2 border-border border-b px-3 py-3 last:border-b-0">
      <h2 className="font-pixel text-[11px] text-muted-foreground uppercase tracking-wider">
        {title}
      </h2>
      {children}
    </section>
  );
}
