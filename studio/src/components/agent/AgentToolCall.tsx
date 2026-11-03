import type { ToolItem } from '@shared/api';
import { Check, ChevronRight, LoaderCircle, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DEFAULT_TOOL_ICON, TOOL_ICONS } from '@/constants/agentTools';
import { toolInputText, toolSummary } from '@/utils/agentTools';
import { AgentImage } from './AgentImage';
import { AgentToolSection } from './AgentToolSection';

const STATUS_LABEL = { running: 'Running', done: 'Done', error: 'Failed' } as const;

/** One tool call as a folded row: icon, tool, what it works on and its state. Open it for the input and output. */
export function AgentToolCall({ item }: { item: ToolItem }) {
  const Icon = TOOL_ICONS[item.name] ?? DEFAULT_TOOL_ICON;
  const summary = toolSummary(item.name, item.input);
  return (
    <Collapsible className="rounded-[10px] border border-border bg-background">
      <CollapsibleTrigger className="group flex compact:min-h-11 min-h-9 w-full min-w-0 items-center gap-2 rounded-[10px] px-3 py-1.5 text-left text-sm hover:bg-muted">
        <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        <span className="shrink-0 font-medium">{item.name}</span>
        {summary && <span className="min-w-0 truncate text-muted-foreground">{summary}</span>}
        <span className="ml-auto flex shrink-0 items-center gap-1.5">
          {item.status === 'running' && (
            <LoaderCircle aria-hidden className="size-4 animate-spin text-muted-foreground" />
          )}
          {item.status === 'done' && <Check aria-hidden className="size-4 text-success" />}
          {item.status === 'error' && <X aria-hidden className="size-4 text-destructive" />}
          <span className="sr-only">{STATUS_LABEL[item.status]}</span>
          <ChevronRight
            aria-hidden
            className="size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-90"
          />
        </span>
      </CollapsibleTrigger>
      {item.result && item.result.images.length > 0 && (
        <ul aria-label={`${item.name} images`} className="flex flex-wrap gap-2 px-3 pb-2">
          {item.result.images.map((image) => (
            <li key={image.src}>
              <AgentImage image={image} variant="thumbnail" />
            </li>
          ))}
        </ul>
      )}
      <CollapsibleContent>
        <div className="grid gap-2 border-border border-t px-3 py-2">
          <AgentToolSection label="Input" text={toolInputText(item.name, item.input)} />
          {item.result && (
            <AgentToolSection
              label={item.result.isError ? 'Error' : 'Output'}
              text={item.result.text || 'No output.'}
              error={item.result.isError}
            />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
