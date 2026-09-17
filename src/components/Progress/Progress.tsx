import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './Progress.css';

export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ProgressRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'pill';
export type ProgressColor = 'accent' | 'warning' | 'error' | 'default';

export interface ProgressSection {
  value: number;
  color?: ProgressColor;
  label?: ReactNode;
  style?: React.CSSProperties;
}

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  value?: number;
  sections?: ProgressSection[];
  size?: ProgressSize;
  radius?: ProgressRadius;
  color?: ProgressColor;
  withLabel?: boolean;
  label?: ReactNode;
  striped?: boolean;
  animated?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = 0, sections, size = 'md', radius = 'pill', color = 'accent', withLabel = false, label, striped = false, animated = false, className, ...rest },
  ref
) {
  const classes = ['progress', `progress--size-${size}`, `progress--radius-${radius}`, striped && 'progress--striped', animated && 'progress--animated', className].filter(Boolean).join(' ');

  if (sections && sections.length > 0) {
    return (
      <div ref={ref} className={classes} role="progressbar" aria-valuemin={0} aria-valuemax={100} {...rest}>
        {sections.map((section, i) => (
          <div
            key={i}
            className={['progress__section', `progress__section--color-${section.color ?? color}`].join(' ')}
            style={{
              width: `${Math.max(0, Math.min(100, section.value))}%`,
              ...section.style,
            }}
          >
            {section.label != null && <span className="progress__label progress__label--inside">{section.label}</span>}
          </div>
        ))}
      </div>
    );
  }

  const clamped = Math.max(0, Math.min(100, value));

  const finalLabel = label ?? (withLabel ? `${Math.round(clamped)}%` : null);

  const barClasses = ['progress__bar', `progress__bar--color-${color}`, striped && 'progress__bar--striped', animated && 'progress__bar--animated'].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} {...rest}>
      <div className={barClasses} style={{ width: `${clamped}%` }}>
        {finalLabel != null && <span className="progress__label progress__label--inside">{finalLabel}</span>}
      </div>
    </div>
  );
});
