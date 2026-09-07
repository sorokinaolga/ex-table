import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './Center.css';

export interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  inline?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  children?: ReactNode;
}

export const Center = forwardRef<HTMLDivElement, CenterProps>(function Center({ as: Component = 'div', inline = false, fullWidth = false, fullHeight = false, className, children, ...rest }, ref) {
  const classes = ['center', inline && 'center--inline', fullWidth && 'center--full-width', fullHeight && 'center--full-height', className].filter(Boolean).join(' ');

  return (
    <Component ref={ref as never} className={classes} {...rest}>
      {children}
    </Component>
  );
});
