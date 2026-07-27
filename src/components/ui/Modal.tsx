// filepath: src/components/ui/Modal.tsx
import { ReactNode, useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export type ModalVariant = 'static' | 'animated';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: ModalSize;
  variant?: ModalVariant;
  /**
   * Show the X close button in the header.
   * Defaults to true.
   */
  showCloseButton?: boolean;
  /**
   * When true, the backdrop gets `overflow-y-auto` and the card
   * gets `my-8` so very tall modals can scroll inside the page.
   * Defaults to false.
   */
  scrollable?: boolean;
  /**
   * Modal content. For animated modals, callers usually pass
   * `<form>...body...<div className="custom-modal-footer">buttons</div></form>`
   * so the submit button can be inside the form.
   */
  children: ReactNode;
}

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Returns the focusable elements within a container, in DOM order.
 */
function getFocusable(container: HTMLElement): HTMLElement[] {
  const nodes = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  );
  return nodes.filter(el => !el.hasAttribute('aria-hidden') && el.offsetParent !== null);
}

/**
 * Reusable modal dialog with full a11y:
 * - role="dialog" + aria-modal + aria-labelledby + aria-describedby
 * - Escape closes the modal
 * - Focus moves into the modal panel on open (to first focusable, or the panel itself)
 * - Tab and Shift+Tab cycle only within the modal while it is open
 * - Focus is restored to the previously focused element on close
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  variant = 'static',
  showCloseButton = true,
  scrollable = false,
  children,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Track the element that had focus before the modal opened so we can restore it.
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Remember the element that had focus before opening so we can restore it.
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    // Move focus into the modal: prefer the first focusable, fall back to the panel.
    const focusContainer = panelRef.current;
    if (focusContainer) {
      const focusables = getFocusable(focusContainer);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        focusContainer.focus();
      }
    }

    // Close on Escape, trap Tab/Shift+Tab within the modal panel.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = getFocusable(panelRef.current);
        if (focusables.length === 0) {
          // Nothing tabbable inside — keep focus on the panel itself.
          e.preventDefault();
          panelRef.current.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !panelRef.current.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last || !panelRef.current.contains(active)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the trigger element when the modal closes.
      const prev = previouslyFocusedRef.current;
      if (prev && typeof prev.focus === 'function' && document.contains(prev)) {
        prev.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const backdropClasses = scrollable
    ? 'custom-modal-backdrop fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto'
    : 'custom-modal-backdrop fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4';

  const cardClasses = `custom-modal-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl ${SIZE_CLASS[size]} w-full`;

  const renderCard = () => {
    if (variant === 'animated') {
      const animatedCardClasses = scrollable
        ? `${cardClasses} overflow-hidden my-8`
        : `${cardClasses} overflow-hidden`;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={animatedCardClasses}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
        >
          <div className="custom-modal-header p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 flex justify-between items-center">
            <div>
              <h3 id={titleId} className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
              {description && (
                <p id={descriptionId} className="text-xs text-slate-500 mt-1">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {children}
        </motion.div>
      );
    }

    // variant === 'static'
    return (
      <div
        className={`${cardClasses} p-6 space-y-4`}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 id={titleId} className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {children}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div
        className={backdropClasses}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {renderCard()}
      </div>
    </AnimatePresence>
  );
}