import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './Title.css';

export type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6;
export type TitleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
export type TitleWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TitleColor = 'default' | 'dimmed' | 'muted' | 'accent' | 'error' | 'inherit';

const ORDER_TO_SIZE: Record<TitleOrder, TitleSize> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'md',
  6: 'sm',
};

const ORDER_TO_TAG: Record<TitleOrder, ElementType> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export interface TitleProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'color'> {
  order?: TitleOrder;
  size?: TitleSize;
  weight?: TitleWeight;
  color?: TitleColor;
  as?: ElementType;
  truncate?: boolean;
  children?: ReactNode;
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function Title({ order = 3, size, weight = 'semibold', color = 'default', as, truncate = false, className, children, ...rest }, ref) {
  const Component = as ?? ORDER_TO_TAG[order];
  const finalSize = size ?? ORDER_TO_SIZE[order];

  const classes = ['title', `title--order-${order}`, `title--size-${finalSize}`, `title--weight-${weight}`, `title--color-${color}`, truncate && 'title--truncate', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Component ref={ref as never} className={classes} {...rest}>
      {children}
    </Component>
  );
});
