import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { COPY_FEEDBACK_MS } from '@/constants/agent';
import { copyText } from '@/services/clipboard';

interface AgentCodeBlockProps {
  code: string;
  language: string;
}

/** A fenced code block: a header with the language and Copy, and the code in its own horizontal scroll. */
export function AgentCodeBlock({ code, language }: AgentCodeBlockProps) {
  const [copied, setCopied] = useState<boolean | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    window.clearTimeout(timer.current);
    setCopied(await copyText(code));
    timer.current = window.setTimeout(() => setCopied(null), COPY_FEEDBACK_MS);
  }

  return (
    <div className="my-4 overflow-hidden rounded-card border border-border bg-muted">
      <div className="flex items-center justify-between gap-2 border-border border-b py-1 pr-1 pl-3">
        <span className="font-mono text-[12px] text-muted-foreground">{language || 'text'}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className="compact:min-h-9 text-muted-foreground"
        >
          {copied ? <Check /> : <Copy />}
          {copied ? 'Copied' : copied === false ? 'Copy failed' : 'Copy'}
        </Button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[13px] leading-normal">
        <code>{code}</code>
      </pre>
    </div>
  );
}
