import { cn } from '@/lib/utils';

interface AgentToolSectionProps {
  label: string;
  text: string;
  error?: boolean;
}

/** A tool call's input or output, in monospace with its own scroll. */
export function AgentToolSection({ label, text, error = false }: AgentToolSectionProps) {
  return (
    <section>
      <h4 className="mb-1 text-[12px] text-muted-foreground">{label}</h4>
      <pre
        className={cn(
          'max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-2.5 font-mono text-[12.5px] leading-normal [overflow-wrap:anywhere]',
          error && 'text-destructive',
        )}
      >
        {text}
      </pre>
    </section>
  );
}
