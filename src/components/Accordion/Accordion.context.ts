import { createContext, useContext } from 'react';

export type AccordionVariant = 'default' | 'contained' | 'filled' | 'separated';
export type AccordionChevronPosition = 'left' | 'right';

export interface AccordionContextValue {
  value: string[];
  toggleItem: (itemValue: string) => void;
  isItemActive: (itemValue: string) => boolean;
  variant: AccordionVariant;
  chevronPosition: AccordionChevronPosition;
  chevron: React.ReactNode;
  disableChevronRotation: boolean;
  transitionDuration: number;
  loop: boolean;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext(component: string): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error(`<Accordion.${component}> must be used within <Accordion>`);
  }
  return ctx;
}
