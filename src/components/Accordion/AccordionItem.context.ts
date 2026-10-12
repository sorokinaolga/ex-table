import { createContext, useContext } from 'react';
import type { RefObject } from 'react';

export interface AccordionItemContextValue {
  value: string;
  active: boolean;
  controlId: string;
  panelId: string;
  itemRef: RefObject<HTMLDivElement | null>;
}

export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export function useAccordionItemContext(): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error('<Accordion.Control> and <Accordion.Panel> must be used within <Accordion.Item>');
  }
  return ctx;
}
