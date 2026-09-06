import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './Group.css';

export type GroupGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type GroupAlign = 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline';
export type GroupJustify = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

export interface GroupProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  gap?: GroupGap | number | string;
  align?: GroupAlign;
  justify?: GroupJustify;
  nowrap?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

const GAP_TO_VAR: Record<GroupGap, string> = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
};

function resolveGap(gap: GroupGap | number | string): string {
  if (typeof gap === 'number') return `${gap}px`;
  if (gap in GAP_TO_VAR) return GAP_TO_VAR[gap as GroupGap];
  return gap;
}

export const Group = forwardRef<HTMLDivElement, GroupProps>(function Group(
  { as: Component = 'div', gap = 'md', align = 'center', justify = 'flex-start', nowrap = false, fullWidth = false, className, style, children, ...rest },
  ref
) {
  const classes = ['group', fullWidth && 'group--full-width', nowrap && 'group--nowrap', className].filter(Boolean).join(' ');

  const mergedStyle: React.CSSProperties = {
    '--group-gap': resolveGap(gap),
    '--group-align': align,
    '--group-justify': justify,
    ...style,
  } as React.CSSProperties;

  return (
    <Component ref={ref as never} className={classes} style={mergedStyle} {...rest}>
      {children}
    </Component>
  );
});

export const GroupSpacer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function GroupSpacer({ className, ...rest }, ref) {
  return <div ref={ref} className={['group__spacer', className].filter(Boolean).join(' ')} aria-hidden="true" {...rest} />;
});
