import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import './Skeleton.css';

export type SkeletonRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'pill' | 'none';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  radius?: SkeletonRadius;
  circle?: boolean;
  animation?: SkeletonAnimation;
}

function resolveSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return `${value}px`;
  return value;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton({ width, height, radius = 'sm', circle = false, animation = 'pulse', className, style, ...rest }, ref) {
  const classes = ['skeleton', `skeleton--animation-${animation}`, !circle && `skeleton--radius-${radius}`, circle && 'skeleton--circle', className].filter(Boolean).join(' ');

  const mergedStyle: CSSProperties = {
    width: resolveSize(width),
    height: resolveSize(height),
    ...style,
  };

  return <div ref={ref} className={classes} style={mergedStyle} aria-hidden="true" {...rest} />;
});

export type SkeletonCircleProps = Omit<SkeletonProps, 'circle' | 'radius'>;

export const SkeletonCircle = forwardRef<HTMLDivElement, SkeletonCircleProps>(function SkeletonCircle(props, ref) {
  return <Skeleton ref={ref} circle {...props} />;
});

export interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number;
  lineHeight?: number | string;
  gap?: number | string;
  animation?: SkeletonAnimation;
  lastLineWidth?: number | string;
}

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(function SkeletonText(
  { lines = 3, lineHeight = 14, gap = 8, animation = 'pulse', lastLineWidth = '70%', className, style, ...rest },
  ref
) {
  const classes = ['skeleton-text', className].filter(Boolean).join(' ');

  const mergedStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: resolveSize(gap),
    ...style,
  };

  return (
    <div ref={ref} className={classes} style={mergedStyle} {...rest}>
      {Array.from({ length: lines }, (_, i) => {
        const isLast = i === lines - 1;
        return <Skeleton key={i} animation={animation} height={resolveSize(lineHeight)} width={isLast && lines > 1 ? resolveSize(lastLineWidth) : '100%'} radius="xs" />;
      })}
    </div>
  );
});

export interface SkeletonButtonProps extends Omit<SkeletonProps, 'radius' | 'circle'> {
  size?: 'xs' | 'sm' | 'md';
}

const BUTTON_SIZE: Record<NonNullable<SkeletonButtonProps['size']>, { height: string; width: string }> = {
  xs: { height: '26px', width: '72px' },
  sm: { height: '32px', width: '88px' },
  md: { height: '38px', width: '104px' },
};

export const SkeletonButton = forwardRef<HTMLDivElement, SkeletonButtonProps>(function SkeletonButton({ size = 'md', height, width, ...rest }, ref) {
  const defaults = BUTTON_SIZE[size];
  return <Skeleton ref={ref} height={height ?? defaults.height} width={width ?? defaults.width} radius="md" {...rest} />;
});

export interface SkeletonAvatarProps extends Omit<SkeletonProps, 'circle' | 'radius'> {
  size?: number | string;
}

export const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonAvatarProps>(function SkeletonAvatar({ size = 40, ...rest }, ref) {
  return <Skeleton ref={ref} circle height={size} width={size} {...rest} />;
});
