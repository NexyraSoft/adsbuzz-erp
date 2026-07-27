/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'default' | 'sm' | 'compact';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Optional icon to render before the button label.
   * Size of the icon is auto-scaled based on the button `size`.
   */
  leftIcon?: ReactNode;
  /**
   * Optional icon to render after the button label.
   */
  rightIcon?: ReactNode;
  /**
   * When true, stretches the button to fill its container's width.
   * Defaults to false.
   */
  fullWidth?: boolean;
  /**
   * Button label content.
   */
  children?: ReactNode;
}

const BASE_CLASSES = 'inline-flex items-center justify-center font-bold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 focus:outline-none';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // Orange — primary action (Save, Create, Onboard, Confirm)
  primary: 'bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl shadow-sm',
  // Blue — secondary action (Update Rate, Continue)
  secondary: 'bg-brand-blue hover:bg-[#154673] text-white rounded-xl',
  // Red — destructive action (Bulk Terminate, Disable)
  danger: 'bg-red-600 hover:bg-red-700 text-white rounded',
  // Ghost — text-only, used for modal Cancel
  ghost: 'text-slate-400 font-bold hover:text-slate-600 rounded',
  // Outline — slate background, used for inline table actions (Edit)
  outline: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-200 dark:hover:bg-slate-300 text-slate-950 border border-slate-300 dark:border-slate-400 shadow-xs rounded-md',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  // Standard padding — used for primary/secondary action buttons
  default: 'text-xs px-4 py-2.5',
  // Smaller padding — used in headers and tight toolbars
  sm: 'text-xs px-3 py-1.5',
  // Tiny padding — used for inline table actions
  compact: 'text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5',
};

const ICON_SIZE: Record<ButtonSize, number> = {
  default: 14,
  sm: 12,
  compact: 10,
};

/**
 * Reusable button.
 *
 * Extracted from the ~20 hand-typed button class strings scattered
 * across the views. Variants are limited to the four that already
 * exist in the codebase:
 *  - "primary"   : orange (#F68B2D) — main action
 *  - "secondary" : blue   (#1F5E98) — alternative action
 *  - "danger"    : red    (#dc2626) — destructive action
 *  - "ghost"     : text-only slate   — modal cancel
 *
 * Sizes:
 *  - "default" : standard (px-4 py-2.5) — used in page headers
 *  - "sm"      : compact   (px-3 py-1.5) — used in toolbars
 *  - "compact" : tiny      (px-1.5 py-0.5) — used inside tables
 */
export function Button({
  variant = 'primary',
  size = 'default',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  type,
  ...rest
}: ButtonProps) {
  const classes = [
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = ICON_SIZE[size];

  return (
    <button type={type ?? 'button'} className={classes} {...rest}>
      {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-flex items-center">{rightIcon}</span>}
    </button>
  );
}
