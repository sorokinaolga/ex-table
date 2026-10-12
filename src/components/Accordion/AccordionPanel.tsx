import { forwardRef, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { useAccordionContext } from './Accordion.context';
import { useAccordionItemContext } from './AccordionItem.context';

export interface AccordionPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(function AccordionPanel({ className, children, style, ...rest }, ref) {
  const accordion = useAccordionContext('Panel');
  const item = useAccordionItemContext();
  const innerRef = useRef<HTMLDivElement | null>(null);

  const duration = accordion.transitionDuration;

  const wrapperStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateRows: item.active ? '1fr' : '0fr',
    transition: `grid-template-rows ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    ...style,
  };

  const innerStyle: React.CSSProperties = {
    overflow: 'hidden',
    minHeight: 0,
  };

  const classes = ['accordion__panel', item.active && 'accordion__panel--active', className].filter(Boolean).join(' ');

  return (
    <div
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      id={item.panelId}
      role="region"
      aria-labelledby={item.controlId}
      hidden={!item.active}
      className={classes}
      style={wrapperStyle}
      {...rest}
    >
      <div style={innerStyle}>
        <div className="accordion__panel-content">{children}</div>
      </div>
    </div>
  );
});
