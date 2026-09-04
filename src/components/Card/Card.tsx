import { forwardRef } from 'react';
import { Paper } from '../Paper/Paper';
import type { CardProps, CardSectionProps, CardHeaderProps, CardFooterProps } from './Card.types';
import './Card.css';

function CardRoot({ children, ...paperProps }: CardProps) {
  return <Paper {...paperProps}>{children}</Paper>;
}

export const CardSection = forwardRef<HTMLDivElement, CardSectionProps>(function CardSection({ inheritPadding = false, className, children, ...rest }, ref) {
  const classes = ['card__section', inheritPadding && 'card__section--inherit-padding', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...rest}>
      {children}
    </div>
  );
});

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader({ withBorder = true, className, children, ...rest }, ref) {
  const classes = ['card__header', withBorder && 'card__header--with-border', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...rest}>
      {children}
    </div>
  );
});

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter({ withBorder = true, className, children, ...rest }, ref) {
  const classes = ['card__footer', withBorder && 'card__footer--with-border', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...rest}>
      {children}
    </div>
  );
});

/**
 * Составной компонент Card.
 * Пример:
 *   <Card shadow="sm" padding="lg">
 *     <Card.Section>...</Card.Section>
 *     <Card.Header>Заголовок</Card.Header>
 *     <Text>Контент</Text>
 *     <Card.Footer>...</Card.Footer>
 *   </Card>
 */
export const Card = Object.assign(CardRoot, {
  Section: CardSection,
  Header: CardHeader,
  Footer: CardFooter,
});
