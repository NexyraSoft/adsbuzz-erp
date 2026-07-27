// filepath: src/components/ui/SearchBar.tsx
import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

type SearchBarProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** Show the leading search icon. Default: true. */
  showIcon?: boolean;
  /** Max width utility class. Default: 'max-w-xs'. */
  maxWidthClass?: string;
};

/**
 * Standardized search input used across data tables and panels.
 * Always renders a `text` input with the orange brand focus ring.
 */
export function SearchBar({
  showIcon = true,
  maxWidthClass = 'max-w-xs',
  className = '',
  ...rest
}: SearchBarProps) {
  const inputClasses = [
    'w-full text-xs',
    showIcon ? 'pl-9 pr-4 py-2' : 'px-3 py-2',
    'bg-slate-50 dark:bg-slate-950',
    'border border-slate-200 dark:border-slate-800',
    'rounded-xl text-slate-800 dark:text-slate-200',
    'placeholder-slate-400',
    'focus:outline-none focus:ring-2 focus:ring-brand-orange',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!showIcon) {
    return (
      <input
        type="text"
        className={`${maxWidthClass} ${inputClasses}`}
        {...rest}
      />
    );
  }

  return (
    <div className={`relative ${maxWidthClass}`}>
      <input type="text" className={inputClasses} {...rest} />
      <Search
        className="absolute left-3 top-2.5 text-slate-400 pointer-events-none"
        size={14}
      />
    </div>
  );
}
