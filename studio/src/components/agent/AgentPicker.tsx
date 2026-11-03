import type { ReactNode } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface AgentPickerOption {
  value: string;
  label: string;
  description?: string;
  /** Shown in the destructive color, in the list and on the trigger when chosen. */
  dangerous?: boolean;
}

interface AgentPickerProps {
  /** The accessible name, such as "Model". */
  label: string;
  icon: ReactNode;
  value: string | null;
  options: AgentPickerOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  /** The chosen option is dangerous, such as skipping approvals. */
  dangerous?: boolean;
}

/** A compact composer picker: the icon and chosen label, opening a list above the composer. */
export function AgentPicker({
  label,
  icon,
  value,
  options,
  onChange,
  placeholder = 'None',
  title,
  dangerous = false,
}: AgentPickerProps) {
  return (
    <Select
      value={value}
      items={options.map((option) => ({ value: option.value, label: option.label }))}
      onValueChange={(next) => {
        if (typeof next === 'string') {
          onChange(next);
        }
      }}
      disabled={!options.length}
    >
      <SelectTrigger
        aria-label={label}
        title={title}
        className={cn(
          'compact:h-11 h-8 max-w-[14rem] shrink-0 rounded-full px-2.5 text-[13px] text-muted-foreground hover:bg-background hover:text-foreground [&_svg]:size-4',
          dangerous &&
            'bg-destructive-surface text-destructive hover:bg-destructive-surface hover:text-destructive',
        )}
      >
        <span
          aria-hidden
          className={cn('narrow:hidden', dangerous ? 'text-destructive' : 'text-muted-foreground')}
        >
          {icon}
        </span>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={cn(option.dangerous && 'text-destructive')}
          >
            <SelectItemText>{option.label}</SelectItemText>
            {option.description && (
              <span className="block text-[12px] text-muted-foreground">{option.description}</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
