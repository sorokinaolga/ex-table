import { forwardRef } from 'react';
import type { ElementType, ReactNode } from 'react';
import './Anchor.css';

export type AnchorSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AnchorWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type AnchorColor = 'accent' | 'default' | 'dimmed' | 'inherit';
export type AnchorUnderline = 'always' | 'hover' | 'never';

export interface AnchorOwnProps {
  size?: AnchorSize;
  weight?: AnchorWeight;
  color?: AnchorColor;
  underline?: AnchorUnderline;
  inherit?: boolean;
  children?: ReactNode;
}

export type AnchorProps<T extends ElementType = 'a'> = AnchorOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof AnchorOwnProps | 'color'> & {
    as?: T;
  };

function isExternal(href: string | undefined): boolean {
  if (!href) return false;
  return /^https?:\/\//i.test(href) || href.startsWith('//');
}

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(function Anchor(
  { as: Component = 'a', size = 'md', weight = 'regular', color = 'accent', underline = 'hover', inherit = false, className, href, target, rel, children, ...rest },
  ref
) {
  const external = isExternal(href);
  const finalTarget = target ?? (external ? '_blank' : undefined);
  const finalRel = rel ?? (external ? 'noopener noreferrer' : undefined);

  const classes = ['anchor', `anchor--size-${size}`, `anchor--weight-${weight}`, `anchor--color-${inherit ? 'inherit' : color}`, `anchor--underline-${underline}`, className].filter(Boolean).join(' ');

  return (
    <Component ref={ref as never} className={classes} href={href} target={finalTarget} rel={finalRel} {...rest}>
      {children}
    </Component>
  );
}) as <T extends ElementType = 'a'>(props: AnchorProps<T> & React.RefAttributes<HTMLAnchorElement>) => React.ReactElement | null;
