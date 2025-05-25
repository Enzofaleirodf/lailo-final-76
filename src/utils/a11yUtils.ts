
/**
 * Accessibility utility functions
 */

/**
 * Generates appropriate ARIA attributes for interactive elements
 */
export const getAriaAttributes = (
  role: string,
  label: string,
  expanded?: boolean,
  controls?: string
) => {
  const attrs: Record<string, any> = {
    role,
    'aria-label': label,
  };

  if (expanded !== undefined) {
    attrs['aria-expanded'] = expanded;
  }

  if (controls) {
    attrs['aria-controls'] = controls;
  }

  return attrs;
};

/**
 * Keyboard navigation handler
 */
export const handleKeyboardNavigation = (
  event: React.KeyboardEvent,
  onEnter?: () => void,
  onSpace?: () => void,
  onEscape?: () => void
) => {
  switch (event.key) {
    case 'Enter':
      if (onEnter) {
        event.preventDefault();
        onEnter();
      }
      break;
    case ' ':
      if (onSpace) {
        event.preventDefault();
        onSpace();
      }
      break;
    case 'Escape':
      if (onEscape) {
        event.preventDefault();
        onEscape();
      }
      break;
  }
};

/**
 * Focus management utilities
 */
export const focusUtils = {
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  },

  restoreFocus: (element: HTMLElement | null) => {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }
};
