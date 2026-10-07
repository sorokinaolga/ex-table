import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './Slider.css';

export type SliderSize = 'xs' | 'sm' | 'md' | 'lg';
export type SliderColor = 'accent' | 'warning' | 'error' | 'default';

export interface SliderMark {
  value: number;
  label?: ReactNode;
}

export interface SliderProps {
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  onChangeEnd?: (value: number | [number, number]) => void;

  range?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;

  size?: SliderSize;
  color?: SliderColor;

  label?: string | ((value: number) => ReactNode);
  showLabelOnHover?: boolean;
  alwaysShowLabel?: boolean;
  labelFormatter?: (value: number) => string;

  marks?: SliderMark[];
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'pill';

  thumbSize?: number;
  children?: ReactNode;

  disabled?: boolean;
  readOnly?: boolean;

  'aria-label'?: string;
  className?: string;
}

const SIZE_HEIGHT: Record<SliderSize, number> = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
};

const THUMB_SIZE: Record<SliderSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
};

const COLOR_VAR: Record<SliderColor, string> = {
  accent: 'var(--theme-accent)',
  warning: 'var(--theme-warning)',
  error: 'var(--theme-error)',
  default: 'var(--theme-fg-subtle)',
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function roundToStep(value: number, step: number, min: number): number {
  const steps = Math.round((value - min) / step);
  return min + steps * step;
}

function roundToPrecision(value: number, precision?: number): number {
  if (precision == null) return value;
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    value: valueProp,
    defaultValue,
    onChange,
    onChangeEnd,
    range = false,
    min = 0,
    max = 100,
    step = 1,
    precision,
    size = 'md',
    color = 'accent',
    label,
    showLabelOnHover = true,
    alwaysShowLabel = true,
    labelFormatter,
    marks,
    radius = 'pill',
    thumbSize,
    disabled = false,
    readOnly = false,
    'aria-label': ariaLabel,
    className,
    children,
  },
  ref
) {
  const isControlled = valueProp !== undefined;
  const initialValue = useMemo(() => {
    if (defaultValue !== undefined) return defaultValue;
    return range ? ([min, max] as [number, number]) : min;
  }, [defaultValue, range, min, max]);

  const [internalValue, setInternalValue] = useState<number | [number, number]>(initialValue);
  const value = isControlled ? valueProp! : internalValue;

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<0 | 1 | null>(null);
  const [hovering, setHovering] = useState(false);
  const [hoveredThumb, setHoveredThumb] = useState<0 | 1 | null>(null);

  const interactive = !disabled && !readOnly;
  const thumbPx = thumbSize ?? THUMB_SIZE[size];
  const trackHeight = SIZE_HEIGHT[size];

  const percent = (v: number) => ((v - min) / (max - min)) * 100;

  const values: [number, number] = useMemo(() => {
    if (range && Array.isArray(value)) {
      return [Math.min(value[0], value[1]), Math.max(value[0], value[1])];
    }
    return [typeof value === 'number' ? value : min, 0];
  }, [range, value, min]);

  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return min;

      const rect = track.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      const raw = min + ratio * (max - min);
      const stepped = roundToStep(raw, step, min);
      return clamp(roundToPrecision(stepped, precision), min, max);
    },
    [min, max, step, precision]
  );

  const commit = useCallback(
    (next: number | [number, number]) => {
      if (!interactive) return;
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [interactive, isControlled, onChange]
  );

  const updateFromPointer = useCallback(
    (clientX: number, thumbIndex?: 0 | 1) => {
      const nextValue = getValueFromPosition(clientX);

      if (range) {
        const [currentMin, currentMax] = values;

        let target: 0 | 1;
        if (thumbIndex !== undefined) {
          target = thumbIndex;
        } else {
          const distMin = Math.abs(nextValue - currentMin);
          const distMax = Math.abs(nextValue - currentMax);
          target = distMin <= distMax ? 0 : 1;
        }

        let newMin = currentMin;
        let newMax = currentMax;

        if (target === 0) {
          newMin = Math.min(nextValue, currentMax);
        } else {
          newMax = Math.max(nextValue, currentMin);
        }

        commit([newMin, newMax]);
      } else {
        commit(nextValue);
      }
    },
    [range, values, getValueFromPosition, commit]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (range) {
      const v = getValueFromPosition(e.clientX);
      const [minV, maxV] = values;
      const distMin = Math.abs(v - minV);
      const distMax = Math.abs(v - maxV);
      const target: 0 | 1 = distMin <= distMax ? 0 : 1;
      setDragging(target);
      updateFromPointer(e.clientX, target);
    } else {
      setDragging(0);
      updateFromPointer(e.clientX, 0);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging === null) return;
    updateFromPointer(e.clientX, dragging);
  };

  const handlePointerUp = () => {
    if (dragging === null) return;
    setDragging(null);
    onChangeEnd?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;

    const stepValue = (direction: 1 | -1) => {
      if (range) {
        const [minV, maxV] = values;
        const target = dragging ?? 0;
        if (target === 0) {
          const next = clamp(minV + direction * step, min, maxV);
          commit([next, maxV]);
        } else {
          const next = clamp(maxV + direction * step, minV, max);
          commit([minV, next]);
        }
      } else {
        const current = typeof value === 'number' ? value : min;
        const next = clamp(current + direction * step, min, max);
        commit(roundToPrecision(next, precision));
      }
    };

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        stepValue(1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        stepValue(-1);
        break;
      case 'Home':
        e.preventDefault();
        if (range) commit([min, values[1]]);
        else commit(min);
        break;
      case 'End':
        e.preventDefault();
        if (range) commit([values[0], max]);
        else commit(max);
        break;
      case 'PageUp':
        e.preventDefault();
        stepValue(1);
        stepValue(1);
        stepValue(1);
        stepValue(1);
        stepValue(1);
        break;
      case 'PageDown':
        e.preventDefault();
        for (let i = 0; i < 5; i++) stepValue(-1);
        break;
    }
  };

  const getLabelText = (v: number): ReactNode => {
    if (typeof label === 'function') return label(v);
    if (typeof label === 'string') return label;
    if (labelFormatter) return labelFormatter(v);
    return roundToPrecision(v, precision);
  };

  const shouldShowLabel = label !== undefined || labelFormatter !== undefined;
  const labelVisible = shouldShowLabel && (alwaysShowLabel || dragging !== null || (showLabelOnHover && hovering));

  const rootClasses = ['slider', `slider--size-${size}`, `slider--color-${color}`, `slider--radius-${radius}`, disabled && 'slider--disabled', readOnly && 'slider--read-only', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      className={rootClasses}
      style={
        {
          '--slider-color': COLOR_VAR[color],
          '--slider-track-height': `${trackHeight}px`,
          '--slider-thumb-size': `${thumbPx}px`,
        } as React.CSSProperties
      }
    >
      <div className="slider__track-wrap" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
        <div
          ref={trackRef}
          className="slider__track"
          role="slider"
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={range ? undefined : values[0]}
          aria-valuetext={range ? undefined : String(getLabelText(values[0]))}
          aria-disabled={disabled || undefined}
          aria-readonly={readOnly || undefined}
          tabIndex={interactive ? 0 : undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
        >
          {range ? (
            <div
              className="slider__bar"
              style={{
                left: `${percent(values[0])}%`,
                width: `${percent(values[1]) - percent(values[0])}%`,
              }}
            />
          ) : (
            <div
              className="slider__bar"
              style={{
                left: 0,
                width: `${percent(values[0])}%`,
              }}
            />
          )}

          {(range ? [0, 1] : [0]).map((idx) => {
            const v = values[idx as 0 | 1];
            const isActive = dragging === idx || hoveredThumb === idx;
            return (
              <div
                key={idx}
                className={['slider__thumb', isActive && 'slider__thumb--active'].filter(Boolean).join(' ')}
                style={{ left: `${percent(v)}%` }}
                onMouseEnter={() => setHoveredThumb(idx as 0 | 1)}
                onMouseLeave={() => setHoveredThumb(null)}
              >
                {labelVisible && (labelVisible as boolean) && <div className="slider__label">{getLabelText(v)}</div>}
              </div>
            );
          })}
        </div>

        {marks && marks.length > 0 && (
          <div className="slider__marks">
            {marks.map((mark) => (
              <div key={mark.value} className="slider__mark" style={{ left: `${percent(mark.value)}%` }}>
                <span className="slider__mark-dot" aria-hidden="true" />
                {mark.label != null && <span className="slider__mark-label">{mark.label}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {children}
    </div>
  );
});
