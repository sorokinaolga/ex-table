import type { HTMLAttributes, ReactNode } from 'react';
import type { PaperProps } from '../Paper/Paper';

export interface CardProps extends PaperProps {
  children?: ReactNode;
}

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  inheritPadding?: boolean;
  children?: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
  children?: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
  children?: ReactNode;
}

export type { PaperProps as CardPaperProps };
