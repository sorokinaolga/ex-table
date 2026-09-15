import { forwardRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './Avatar.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'rounded' | 'square';
export type AvatarColor = 'default' | 'accent' | 'warning' | 'error';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  initials?: string;
  size?: AvatarSize | number;
  shape?: AvatarShape;
  color?: AvatarColor;
  fallback?: ReactNode;
  overlay?: ReactNode;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join('');
}

const SIZE_MAP: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72,
};

function resolveSize(size: AvatarSize | number): number {
  if (typeof size === 'number') return size;
  return SIZE_MAP[size];
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { src, alt, name, initials, size = 'md', shape = 'circle', color = 'default', fallback, overlay, className, style, ...rest },
  ref
) {
  const [imageError, setImageError] = useState(false);

  const px = resolveSize(size);
  const showImage = src && !imageError;
  const initialsText = initials ?? (name ? getInitials(name) : undefined);

  const classes = ['avatar', `avatar--shape-${shape}`, `avatar--color-${color}`, !showImage && 'avatar--fallback', className].filter(Boolean).join(' ');

  const mergedStyle: React.CSSProperties = {
    '--avatar-size': `${px}px`,
    '--avatar-font-size': `${Math.round(px * 0.4)}px`,
    ...style,
  } as React.CSSProperties;

  return (
    <div ref={ref} className={classes} style={mergedStyle} aria-label={!showImage ? (name ?? alt) : undefined} {...rest}>
      {showImage ? (
        <img src={src} alt={alt ?? name ?? ''} className="avatar__image" onError={() => setImageError(true)} />
      ) : (
        <span className="avatar__fallback" aria-hidden={!name ? true : undefined}>
          {fallback ?? initialsText}
        </span>
      )}

      {overlay && <span className="avatar__overlay">{overlay}</span>}
    </div>
  );
});

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: AvatarSize | number;
  spacing?: number;
  total?: number;
  showMore?: boolean;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup({ children, size = 'md', spacing = 8, total, showMore = true, className, style, ...rest }, ref) {
  const items = Array.isArray(children) ? children.flat() : [children];
  const visible = total != null ? items.slice(0, total) : items;
  const hiddenCount = total != null ? items.length - total : 0;

  const px = resolveSize(size);

  const classes = ['avatar-group', className].filter(Boolean).join(' ');

  const mergedStyle: React.CSSProperties = {
    '--avatar-group-overlap': `-${spacing}px`,
    ...style,
  } as React.CSSProperties;

  return (
    <div ref={ref} className={classes} style={mergedStyle} {...rest}>
      {visible.map((child, i) => (
        <span key={i} className="avatar-group__item">
          {child}
        </span>
      ))}
      {showMore && hiddenCount > 0 && (
        <span className="avatar-group__item">
          <Avatar size={px} color="default" fallback={`+${hiddenCount}`} aria-label={`Ещё ${hiddenCount}`} />
        </span>
      )}
    </div>
  );
});
