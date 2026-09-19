import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './RingProgress.css';

export type RingProgressColor = 'accent' | 'warning' | 'error' | 'default';

export interface RingProgressSection {
  value: number;
  color?: RingProgressColor;
  label?: ReactNode;
}

export interface RingProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  sections: RingProgressSection[];
  size?: number;
  thickness?: number;
  roundCaps?: boolean;
  label?: ReactNode;
}

const COLOR_VAR: Record<RingProgressColor, string> = {
  accent: 'var(--theme-accent)',
  warning: 'var(--theme-warning)',
  error: 'var(--theme-error)',
  default: 'var(--theme-fg-subtle)',
};

export const RingProgress = forwardRef<HTMLDivElement, RingProgressProps>(function RingProgress({ sections, size = 120, thickness = 12, roundCaps = false, label, className, style, ...rest }, ref) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let offset = 0;

  const classes = ['ring-progress', className].filter(Boolean).join(' ');

  const mergedStyle: React.CSSProperties = {
    width: size,
    height: size,
    ...style,
  };

  const total = sections.reduce((acc, s) => acc + Math.max(0, Math.min(100, s.value)), 0);

  return (
    <div ref={ref} className={classes} style={mergedStyle} role="progressbar" aria-valuenow={Math.round(Math.min(100, total))} aria-valuemin={0} aria-valuemax={100} {...rest}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="ring-progress__svg">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--theme-surface-hover)" strokeWidth={thickness} />

        {sections.map((section, i) => {
          const value = Math.max(0, Math.min(100, section.value));
          const sectionLength = (value / 100) * circumference;
          const dashArray = `${sectionLength} ${circumference}`;
          const dashOffset = -offset;
          offset += sectionLength;

          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={COLOR_VAR[section.color ?? 'accent']}
              strokeWidth={thickness}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap={roundCaps ? 'round' : 'butt'}
              transform={`rotate(-90 ${center} ${center})`}
              className="ring-progress__section"
            />
          );
        })}
      </svg>

      {label != null && <div className="ring-progress__label">{label}</div>}
    </div>
  );
});
