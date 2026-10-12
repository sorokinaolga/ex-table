import { useMemo, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { AccordionItemContext } from './AccordionItem.context';
import { useAccordionContext } from './Accordion.context';

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

export function AccordionItem({ value, className, children, ...rest }: AccordionItemProps) {
  const accordion = useAccordionContext('Item');
  const panelId = `accordion-panel-${value}`;
  const controlId = `accordion-control-${value}`;
  const itemRef = useRef<HTMLDivElement | null>(null);

  const active = accordion.isItemActive(value);

  const ctxValue = useMemo(
    () => ({
      value,
      active,
      controlId,
      panelId,
      itemRef,
    }),
    [value, active, controlId, panelId]
  );

  const classes = ['accordion__item', active && 'accordion__item--active', className].filter(Boolean).join(' ');

  return (
    <AccordionItemContext.Provider value={ctxValue}>
      <div ref={itemRef} className={classes} {...rest}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}
