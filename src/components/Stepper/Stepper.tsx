import { Children, cloneElement, isValidElement, useCallback } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import './Stepper.css';

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperSize = 'xs' | 'sm' | 'md' | 'lg';
export type StepperColor = 'accent' | 'warning' | 'error' | 'default';

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  active: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: StepperOrientation;
  size?: StepperSize;
  color?: StepperColor;
  allowNextStepsSelect?: boolean;
  completedIcon?: ReactNode;
  errorIcon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export interface StepperStepProps {
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;

  _index?: number;
  _active?: number;
  _orientation?: StepperOrientation;
  _onStepClick?: (index: number) => void;
  _clickable?: boolean;
  _completedIcon?: ReactNode;
  _errorIcon?: ReactNode;
  _size?: StepperSize;
}

export interface StepperCompletedProps {
  children?: ReactNode;
  _index?: number;
  _active?: number;
  _orientation?: StepperOrientation;
}

const DEFAULT_COMPLETED_ICON = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DEFAULT_ERROR_ICON = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function StepperStep(props: StepperStepProps) {
  const { label, description, icon, hasError = false, disabled = false, className, _index = 0, _active = 0, _onStepClick, _clickable = true, _completedIcon, _errorIcon } = props;

  const isActive = _index === _active;
  const isCompleted = _index < _active;
  const interactive = _clickable && !disabled && _onStepClick;

  const state: 'active' | 'completed' | 'error' | 'default' = hasError ? 'error' : isActive ? 'active' : isCompleted ? 'completed' : 'default';

  const classes = ['stepper__step', `stepper__step--${state}`, disabled && 'stepper__step--disabled', interactive && 'stepper__step--interactive', className].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!interactive) return;
    _onStepClick(_index);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      _onStepClick(_index);
    }
  };

  const content = (
    <>
      <div className="stepper__step-icon" aria-hidden="true">
        {hasError ? (_errorIcon ?? DEFAULT_ERROR_ICON) : isCompleted ? (_completedIcon ?? DEFAULT_COMPLETED_ICON) : (icon ?? _index + 1)}
      </div>
      <div className="stepper__step-body">
        <div className="stepper__step-label">{label}</div>
        {description && <div className="stepper__step-description">{description}</div>}
      </div>
    </>
  );

  return (
    <div className={classes}>
      {interactive ? (
        <button type="button" className="stepper__step-button" onClick={handleClick} onKeyDown={handleKeyDown} disabled={disabled}>
          {content}
        </button>
      ) : (
        <div className="stepper__step-inner">{content}</div>
      )}
    </div>
  );
}

function StepperCompleted({ children }: StepperCompletedProps) {
  return <>{children}</>;
}

function StepperRoot({
  active,
  onStepClick,
  orientation = 'horizontal',
  size = 'md',
  color = 'accent',
  allowNextStepsSelect = true,
  completedIcon,
  errorIcon,
  children,
  className,
  ...rest
}: StepperProps) {
  const items = Children.toArray(children).filter(isValidElement);

  const isStepClickable = useCallback(
    (index: number): boolean => {
      if (!onStepClick) return false;
      if (allowNextStepsSelect) return true;
      return index <= active;
    },
    [onStepClick, allowNextStepsSelect, active]
  );

  const classes = ['stepper', `stepper--orientation-${orientation}`, `stepper--size-${size}`, `stepper--color-${color}`, className].filter(Boolean).join(' ');

  return (
    <div className={classes} role="group" aria-label="Шаги" {...rest}>
      {items.map((child, i) => {
        if (!isValidElement(child)) return null;

        if ((child.type as { displayName?: string }).displayName === 'StepperCompleted') {
          return null;
        }

        return (
          <div key={i} className="stepper__item" aria-current={i === active ? 'step' : undefined}>
            {cloneElement(child as ReactElement<StepperStepProps>, {
              _index: i,
              _active: active,
              _orientation: orientation,
              _onStepClick: onStepClick,
              _clickable: isStepClickable(i),
              _completedIcon: completedIcon,
              _errorIcon: errorIcon,
              _size: size,
            })}
            {i < items.length - 1 && <div className="stepper__connector" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );
}

StepperStep.displayName = 'StepperStep';
StepperCompleted.displayName = 'StepperCompleted';

type StepperComponent = typeof StepperRoot & {
  Step: typeof StepperStep;
  Completed: typeof StepperCompleted;
};

const StepperWithParts = StepperRoot as StepperComponent;
StepperWithParts.Step = StepperStep;
StepperWithParts.Completed = StepperCompleted;

export { StepperWithParts as Stepper };
