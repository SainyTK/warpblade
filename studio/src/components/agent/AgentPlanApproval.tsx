import type { ApprovalItem } from '@shared/api';
import { Button } from '@/components/ui/button';
import { useActiveJob } from '@/hooks/useActiveJob';
import { AgentApprovalCard } from './AgentApprovalCard';
import { AgentMarkdown } from './AgentMarkdown';

/** The agent's plan at the end of plan mode. Approving leaves plan mode; Keep planning sends it back. */
export function AgentPlanApproval({ item, plan }: { item: ApprovalItem; plan: string }) {
  const { decide } = useActiveJob();
  return (
    <AgentApprovalCard
      title="Ready to code?"
      description="Approve the plan to let the agent start. You can keep it asking before edits or let it accept them."
      actions={
        <>
          <Button onClick={() => decide(item.id, 'allow')}>Approve, ask before edits</Button>
          <Button variant="outline" onClick={() => decide(item.id, 'always')}>
            Approve and accept edits
          </Button>
          <Button variant="ghost" onClick={() => decide(item.id, 'deny')}>
            Keep planning
          </Button>
        </>
      }
    >
      <div className="max-h-[50vh] overflow-y-auto rounded-md bg-muted px-4 py-1">
        <AgentMarkdown text={plan} />
      </div>
    </AgentApprovalCard>
  );
}
