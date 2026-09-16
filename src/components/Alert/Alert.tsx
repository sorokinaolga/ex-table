import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import './Alert.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type AlertRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  title?: ReactNode;
  icon?: ReactNode;
  withCloseButton?: boolean;
  onClose?: () => void;
  withBorder?: boolean;
  radius?: AlertRadius;
  children?: ReactNode;
}

const DEFAULT_ICONS: Record<AlertVariant, ReactNode> = {
  info: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  warning: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = 'info', title, icon, withCloseButton = false, onClose, withBorder = false, radius = 'md', className, children, ...rest },
  ref
) {
  const classes = ['alert', `alert--variant-${variant}`, `alert--radius-${radius}`, withBorder && 'alert--with-border', className].filter(Boolean).join(' ');

  const finalIcon = icon ?? DEFAULT_ICONS[variant];

  return (
    <div ref={ref} className={classes} role={variant === 'error' ? 'alert' : 'status'} {...rest}>
      {finalIcon && (
        <span className="alert__icon" aria-hidden="true">
          {finalIcon}
        </span>
      )}

      <div className="alert__body">
        {title && <div className="alert__title">{title}</div>}
        {children && <div className="alert__content">{children}</div>}
      </div>

      {withCloseButton && (
        <ButtonIcon variant="subtle" shape="circle" size="sm" className="alert__close" aria-label="Закрыть" onClick={onClose}>
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </ButtonIcon>
      )}
    </div>
  );
});
