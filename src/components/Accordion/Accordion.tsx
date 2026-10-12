import { useCallback, useId, useMemo, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { AccordionContext, type AccordionChevronPosition, type AccordionVariant } from './Accordion.context';
import { AccordionItem } from './AccordionItem';
import { AccordionControl } from './AccordionControl';
import { AccordionPanel } from './AccordionPanel';
import './Accordion.css';

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  multiple?: boolean;
  variant?: AccordionVariant;
  chevronPosition?: AccordionChevronPosition;
  chevron?: ReactNode;
  disableChevronRotation?: boolean;
  transitionDuration?: number;
  loop?: boolean;
  children?: ReactNode;
}

const DEFAULT_CHEVRON = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function AccordionRoot({
  value: valueProp,
  defaultValue = [],
  onChange,
  multiple = false,
  variant = 'default',
  chevronPosition = 'right',
  chevron = DEFAULT_CHEVRON,
  disableChevronRotation = false,
  transitionDuration = 200,
  loop = true,
  className,
  children,
  ...rest
}: AccordionProps) {
  const baseId = useId();
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const value = isControlled ? valueProp! : internalValue;

  const toggleItem = useCallback(
    (itemValue: string) => {
      const isActive = value.includes(itemValue);
      let next: string[];

      if (multiple) {
        next = isActive ? value.filter((v) => v !== itemValue) : [...value, itemValue];
      } else {
        next = isActive ? [] : [itemValue];
      }

      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [value, multiple, isControlled, onChange]
  );

  const isItemActive = useCallback((itemValue: string) => value.includes(itemValue), [value]);

  const ctxValue = useMemo(
    () => ({
      value,
      toggleItem,
      isItemActive,
      variant,
      chevronPosition,
      chevron,
      disableChevronRotation,
      transitionDuration,
      loop,
    }),
    [value, toggleItem, isItemActive, variant, chevronPosition, chevron, disableChevronRotation, transitionDuration, loop]
  );

  const classes = ['accordion', `accordion--variant-${variant}`, `accordion--chevron-${chevronPosition}`, className].filter(Boolean).join(' ');

  return (
    <AccordionContext.Provider value={ctxValue}>
      <div className={classes} data-accordion-id={baseId} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

type AccordionComponent = typeof AccordionRoot & {
  Item: typeof AccordionItem;
  Control: typeof AccordionControl;
  Panel: typeof AccordionPanel;
};

const AccordionWithParts = AccordionRoot as AccordionComponent;
AccordionWithParts.Item = AccordionItem;
AccordionWithParts.Control = AccordionControl;
AccordionWithParts.Panel = AccordionPanel;

export { AccordionWithParts as Accordion };
