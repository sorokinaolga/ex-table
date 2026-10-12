import { useCallback } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useAccordionContext } from './Accordion.context';
import { useAccordionItemContext } from './AccordionItem.context';

export interface AccordionControlProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  icon?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

export function AccordionControl({ icon, description, className, children, disabled, ...rest }: AccordionControlProps) {
  const accordion = useAccordionContext('Control');
  const item = useAccordionItemContext();

  const handleClick = useCallback(() => {
    if (disabled) return;
    accordion.toggleItem(item.value);
  }, [accordion, item.value, disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const root = item.itemRef.current?.parentElement;
    if (!root) return;

    const controls = Array.from(root.querySelectorAll<HTMLButtonElement>('.accordion__control')).filter((btn) => !btn.disabled);

    const currentIndex = controls.indexOf(e.currentTarget);
    if (currentIndex === -1) return;

    const go = (index: number) => {
      const wrapped = accordion.loop ? (index + controls.length) % controls.length : Math.max(0, Math.min(controls.length - 1, index));
      controls[wrapped]?.focus();
    };

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        go(currentIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        go(currentIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        go(0);
        break;
      case 'End':
        e.preventDefault();
        go(controls.length - 1);
        break;
    }
  };

  const classes = ['accordion__control', !accordion.disableChevronRotation && item.active && 'accordion__control--active', className].filter(Boolean).join(' ');

  return (
    <button
      {...rest}
      id={item.controlId}
      type="button"
      className={classes}
      aria-expanded={item.active}
      aria-controls={item.panelId}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {accordion.chevronPosition === 'left' && (
        <span className="accordion__chevron" aria-hidden="true">
          {accordion.chevron}
        </span>
      )}

      {icon && (
        <span className="accordion__icon" aria-hidden="true">
          {icon}
        </span>
      )}

      <span className="accordion__label">
        <span className="accordion__label-text">{children}</span>
        {description && <span className="accordion__description">{description}</span>}
      </span>

      {accordion.chevronPosition === 'right' && (
        <span className="accordion__chevron" aria-hidden="true">
          {accordion.chevron}
        </span>
      )}
    </button>
  );
}
