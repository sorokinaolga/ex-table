import { forwardRef, useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './SegmentedControl.css';

export type SegmentedControlSize = 'xs' | 'sm' | 'md' | 'lg';
export type SegmentedControlOrientation = 'horizontal' | 'vertical';
export type SegmentedControlColor = 'accent' | 'warning' | 'error' | 'default';

export type SegmentedControlItem = string | { value: string; label: ReactNode; disabled?: boolean };

export interface SegmentedControlProps {
  data: SegmentedControlItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;

  size?: SegmentedControlSize;
  orientation?: SegmentedControlOrientation;
  color?: SegmentedControlColor;
  fullWidth?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  transitionDuration?: number;
  transitionTimingFunction?: string;
  withItemsBorders?: boolean;

  'aria-label'?: string;
  className?: string;
}

const SIZE_HEIGHT: Record<SegmentedControlSize, string> = {
  xs: '26px',
  sm: '32px',
  md: '38px',
  lg: '44px',
};

const SIZE_FONT: Record<SegmentedControlSize, string> = {
  xs: '12px',
  sm: '13px',
  md: '14px',
  lg: '15px',
};

const SIZE_PADDING: Record<SegmentedControlSize, string> = {
  xs: '0 10px',
  sm: '0 14px',
  md: '0 18px',
  lg: '0 22px',
};

function getItemValue(item: SegmentedControlItem): string {
  return typeof item === 'string' ? item : item.value;
}

function getItemLabel(item: SegmentedControlItem): ReactNode {
  return typeof item === 'string' ? item : item.label;
}

function getItemDisabled(item: SegmentedControlItem): boolean {
  return typeof item === 'object' && item.disabled === true;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  {
    data,
    value: valueProp,
    defaultValue,
    onChange,
    size = 'md',
    orientation = 'horizontal',
    color = 'accent',
    fullWidth = false,
    readOnly = false,
    disabled = false,
    transitionDuration = 200,
    transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)',
    withItemsBorders = true,
    'aria-label': ariaLabel,
    className,
  },
  ref
) {
  const autoId = useId();
  const isControlled = valueProp !== undefined;
  const firstEnabledValue = data.find((item) => !getItemDisabled(item)) ? getItemValue(data.find((item) => !getItemDisabled(item))!) : '';

  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? firstEnabledValue);
  const value = isControlled ? valueProp : internalValue;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
    ready: boolean;
  }>({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    ready: false,
  });

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [ref]
  );

  const commit = useCallback(
    (next: string) => {
      if (readOnly || disabled) return;
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [readOnly, disabled, isControlled, onChange]
  );

  const updateIndicator = useCallback(() => {
    const activeIndex = data.findIndex((item) => getItemValue(item) === value);
    if (activeIndex === -1) {
      setIndicatorStyle((s) => ({ ...s, ready: false }));
      return;
    }

    const node = itemRefs.current[activeIndex];
    const root = rootRef.current;
    if (!node || !root) return;

    const rootRect = root.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();

    setIndicatorStyle({
      width: nodeRect.width,
      height: nodeRect.height,
      left: nodeRect.left - rootRect.left,
      top: nodeRect.top - rootRect.top,
      ready: true,
    });
  }, [data, value]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, size, orientation, fullWidth]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(() => updateIndicator());
    observer.observe(root);
    return () => observer.disconnect();
  }, [updateIndicator]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (readOnly || disabled) return;

    const enabledItems = data.map((item, i) => ({ item, i })).filter(({ item }) => !getItemDisabled(item));

    if (enabledItems.length === 0) return;

    const currentIndex = data.findIndex((item) => getItemValue(item) === value);
    const currentEnabledIndex = enabledItems.findIndex(({ i }) => i === currentIndex);

    const focusItem = (enabledIndex: number) => {
      const wrapped = ((enabledIndex % enabledItems.length) + enabledItems.length) % enabledItems.length;
      const target = enabledItems[wrapped];
      commit(getItemValue(target.item));
      itemRefs.current[target.i]?.focus();
    };

    const isHorizontal = orientation === 'horizontal';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        focusItem(currentEnabledIndex + 1);
        break;
      case prevKey:
        e.preventDefault();
        focusItem(currentEnabledIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusItem(0);
        break;
      case 'End':
        e.preventDefault();
        focusItem(enabledItems.length - 1);
        break;
    }
  };

  const rootClasses = [
    'segmented-control',
    `segmented-control--size-${size}`,
    `segmented-control--color-${color}`,
    `segmented-control--orientation-${orientation}`,
    fullWidth && 'segmented-control--full-width',
    readOnly && 'segmented-control--read-only',
    disabled && 'segmented-control--disabled',
    withItemsBorders && 'segmented-control--with-borders',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={setRootRef}
      className={rootClasses}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      tabIndex={disabled ? undefined : 0}
      onKeyDown={handleKeyDown}
      style={
        {
          '--segmented-height': SIZE_HEIGHT[size],
          '--segmented-font': SIZE_FONT[size],
          '--segmented-padding': SIZE_PADDING[size],
          '--segmented-transition': `${transitionDuration}ms ${transitionTimingFunction}`,
        } as React.CSSProperties
      }
    >
      {indicatorStyle.ready && (
        <div
          className="segmented-control__indicator"
          style={{
            width: indicatorStyle.width,
            height: indicatorStyle.height,
            transform: `translate(${indicatorStyle.left}px, ${indicatorStyle.top}px)`,
          }}
          aria-hidden="true"
        />
      )}

      {data.map((item, i) => {
        const itemValue = getItemValue(item);
        const itemLabel = getItemLabel(item);
        const itemDisabled = getItemDisabled(item);
        const selected = itemValue === value;

        return (
          <button
            key={`${autoId}-${itemValue}`}
            ref={(node) => {
              itemRefs.current[i] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={itemDisabled || disabled || undefined}
            disabled={itemDisabled || disabled}
            tabIndex={selected ? 0 : -1}
            className={['segmented-control__item', selected && 'segmented-control__item--selected', itemDisabled && 'segmented-control__item--disabled'].filter(Boolean).join(' ')}
            onClick={() => {
              if (readOnly) return;
              commit(itemValue);
            }}
          >
            {itemLabel}
          </button>
        );
      })}
    </div>
  );
});
