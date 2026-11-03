import type { ApprovalItem } from '@shared/api';
import { ShieldCheck, ShieldX } from 'lucide-react';

const OUTCOME: Record<Exclude<ApprovalItem['status'], 'pending'>, string> = {
  allowed: 'Allowed once',
  always: 'Always allowed',
  denied: 'Denied',
  cancelled: 'Cancelled',
};

const PLAN_OUTCOME: Partial<Record<ApprovalItem['status'], string>> = {
  allowed: 'Plan approved',
  always: 'Plan approved, edits accepted',
  denied: 'Kept planning',
};

export function AgentApprovalResolved({ item }: { item: ApprovalItem }) {
  if (item.status === 'pending') {
    return null;
  }
  const granted = item.status === 'allowed' || item.status === 'always';
  const Icon = granted ? ShieldCheck : ShieldX;
  const outcome =
    (item.plan !== null && PLAN_OUTCOME[item.status]) ||
    `${OUTCOME[item.status]}: ${item.toolName}`;
  return (
    <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
      <Icon aria-hidden className="size-4 shrink-0" />
      {outcome}
    </p>
  );
}
