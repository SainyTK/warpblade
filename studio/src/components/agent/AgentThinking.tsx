import type { ThinkingItem } from '@shared/api';
import { Brain, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

/** The agent's thinking summary, folded away like Claude Code desktop. It reads "Thinking" while it streams. */
export function AgentThinking({ item, live }: { item: ThinkingItem; live: boolean }) {
  if (!item.text.trim() && !live) {
    return null;
  }
  return (
    <Collapsible>
      <CollapsibleTrigger className="group flex compact:min-h-11 min-h-8 items-center gap-2 rounded-md text-muted-foreground text-sm hover:text-foreground">
        <Brain aria-hidden className="size-4" />
        <span className={live ? 'animate-pulse' : undefined}>{live ? 'Thinking' : 'Thought'}</span>
        <ChevronRight
          aria-hidden
          className="size-4 transition-transform group-data-[panel-open]:rotate-90"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="mt-1 mb-2 whitespace-pre-wrap border-border border-l-2 pl-3 text-muted-foreground text-sm leading-relaxed [overflow-wrap:anywhere]">
          {item.text}
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
