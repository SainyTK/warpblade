import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

interface TextLinkProps extends ComponentProps<'a'> {
  /** Opens in a new tab without sending the referrer. */
  external?: boolean;
}

export function TextLink({ external = false, className, ...props }: TextLinkProps) {
  const target = external ? { target: '_blank', rel: 'noreferrer' } : {};
  return (
    <a className={cn('text-link underline underline-offset-2', className)} {...target} {...props} />
  );
}
