import type { ReactNode } from 'react';

interface AgentApprovalCardProps {
  title: string;
  description: string | null;
  children: ReactNode;
  actions: ReactNode;
}

/** The frame every pending request shares: what the agent asks, the details, and the answers. */
export function AgentApprovalCard({
  title,
  description,
  children,
  actions,
}: AgentApprovalCardProps) {
  return (
    <section
      aria-label="The agent is waiting for you"
      className="rounded-card border border-border-strong bg-card p-4 shadow-card"
    >
      <h3 className="font-semibold text-[15px] [overflow-wrap:anywhere]">{title}</h3>
      {description && (
        <p className="mt-1 text-muted-foreground text-sm [overflow-wrap:anywhere]">{description}</p>
      )}
      <div className="mt-3">{children}</div>
      <div className="mt-4 flex flex-wrap gap-2">{actions}</div>
    </section>
  );
}
