import type { ApprovalItem } from '@shared/api';
import { Button } from '@/components/ui/button';
import { useActiveJob } from '@/hooks/useActiveJob';
import { toolInputText } from '@/utils/agentTools';
import { AgentApprovalCard } from './AgentApprovalCard';
import { AgentToolSection } from './AgentToolSection';

/** Allow once, always allow (saved where Claude Code saves its rules) or deny one tool call. */
export function AgentToolApproval({ item }: { item: ApprovalItem }) {
  const { decide } = useActiveJob();
  return (
    <AgentApprovalCard
      title={item.title}
      description={item.description}
      actions={
        <>
          <Button onClick={() => decide(item.id, 'allow')}>Allow once</Button>
          {item.canAlwaysAllow && (
            <Button variant="outline" onClick={() => decide(item.id, 'always')}>
              Always allow
            </Button>
          )}
          <Button variant="ghost" onClick={() => decide(item.id, 'deny')}>
            Deny
          </Button>
        </>
      }
    >
      <AgentToolSection label={item.toolName} text={toolInputText(item.toolName, item.input)} />
    </AgentApprovalCard>
  );
}
