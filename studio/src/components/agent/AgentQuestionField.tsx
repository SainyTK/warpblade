import type { Question } from '@shared/api';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentQuestionFieldProps {
  question: Question;
  picked: string[];
  onToggle: (label: string) => void;
}

export function AgentQuestionField({ question, picked, onToggle }: AgentQuestionFieldProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm">
        {question.header && (
          <span className="mr-2 rounded-full bg-muted px-2 py-0.5 text-[12px] text-muted-foreground">
            {question.header}
          </span>
        )}
        {question.question}
      </legend>
      <div className="grid gap-2">
        {question.options.map((option) => {
          const selected = picked.includes(option.label);
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(option.label)}
              className={cn(
                'flex compact:min-h-11 items-start gap-2 rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-muted',
                selected && 'border-foreground bg-muted',
              )}
            >
              <Check
                aria-hidden
                className={cn('mt-0.5 size-4 shrink-0', !selected && 'invisible')}
              />
              <span>
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <span className="block text-muted-foreground">{option.description}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      {question.multiSelect && (
        <p className="mt-1 text-[12px] text-muted-foreground">Choose one or more.</p>
      )}
    </fieldset>
  );
}
