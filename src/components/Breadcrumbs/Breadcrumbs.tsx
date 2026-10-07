import { Children, Fragment } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './Breadcrumbs.css';

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  separator?: ReactNode;
  'aria-label'?: string;
}

function BreadcrumbsRoot({ children, separator = '/', 'aria-label': ariaLabel = 'Хлебные крошки', className, ...rest }: BreadcrumbsProps) {
  const items = Children.toArray(children).filter(Boolean);

  return (
    <nav aria-label={ariaLabel} className={['breadcrumbs', className].filter(Boolean).join(' ')} {...rest}>
      <ol className="breadcrumbs__list">
        {items.map((child, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={i}>
              <li className="breadcrumbs__item">{child}</li>
              {!isLast && (
                <li className="breadcrumbs__separator" aria-hidden="true">
                  {separator}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

function BreadcrumbsSeparator({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

type BreadcrumbsComponent = typeof BreadcrumbsRoot & {
  Separator: typeof BreadcrumbsSeparator;
};

const BreadcrumbsWithParts = BreadcrumbsRoot as BreadcrumbsComponent;
BreadcrumbsWithParts.Separator = BreadcrumbsSeparator;

export { BreadcrumbsWithParts as Breadcrumbs };
