/**
 * Design System Constants
 * 
 * This file contains all the design system constants used throughout the application.
 * Centralizing these values helps maintain consistency and makes it easier to update
 * the design system in the future.
 */

// Breakpoints
export const BREAKPOINTS = {
  xs: '(max-width: 375px)',
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 1024px)',
  xl: '(max-width: 1280px)',
  '2xl': '(max-width: 1536px)',
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  largeDesktop: '(min-width: 1440px)',
};

// Colors
export const COLORS = {
  // Brand colors
  brand: {
    50: 'bg-brand-50',
    100: 'bg-brand-100',
    200: 'bg-brand-200',
    300: 'bg-brand-300',
    400: 'bg-brand-400',
    500: 'bg-brand-500',
    600: 'bg-brand-600',
    700: 'bg-brand-700',
    800: 'bg-brand-800',
    900: 'bg-brand-900',
  },
  // Text colors
  text: {
    white: 'text-white',
    gray: {
      400: 'text-gray-400',
      500: 'text-gray-500',
      600: 'text-gray-600',
      700: 'text-gray-700',
      800: 'text-gray-800',
      900: 'text-gray-900',
    },
    brand: {
      500: 'text-brand-500',
      600: 'text-brand-600',
      700: 'text-brand-700',
    },
    accent2: {
      600: 'text-accent2-600',
    },
    error: 'text-red-500',
  },
  // Background colors
  bg: {
    white: 'bg-white',
    gray: {
      50: 'bg-gray-50',
      100: 'bg-gray-100',
      200: 'bg-gray-200',
    },
    brand: {
      50: 'bg-brand-50',
      600: 'bg-brand-600',
      700: 'bg-brand-700',
    },
    accent2: {
      50: 'bg-accent2-50',
      400: 'bg-accent2-400',
      500: 'bg-accent2-500',
    },
    error: 'bg-red-500',
  },
  // Border colors
  border: {
    gray: {
      100: 'border-gray-100',
      200: 'border-gray-200',
      300: 'border-gray-300',
    },
    brand: {
      200: 'border-brand-200',
      300: 'border-brand-300',
      500: 'border-brand-500',
      700: 'border-brand-700',
    },
    accent2: {
      500: 'border-accent2-500',
    },
    error: 'border-red-300',
  },
};

// Typography
export const TYPOGRAPHY = {
  size: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  },
  weight: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },
  family: {
    urbanist: 'font-urbanist',
  },
  tracking: {
    tight: 'tracking-tight',
  },
  leading: {
    tight: 'leading-tight',
    none: 'leading-none',
  },
};

// Spacing
export const SPACING = {
  px: 'px',
  0: '0',
  0.5: '0.5',
  1: '1',
  1.5: '1.5',
  2: '2',
  2.5: '2.5',
  3: '3',
  3.5: '3.5',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: '11',
  12: '12',
  14: '14',
  16: '16',
  20: '20',
  24: '24',
  28: '28',
  32: '32',
  36: '36',
  40: '40',
  44: '44',
  48: '48',
  52: '52',
  56: '56',
  60: '60',
  64: '64',
  72: '72',
  80: '80',
  96: '96',
};

// Border radius
export const BORDER_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

// Shadows
export const SHADOWS = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
};

// Z-index
export const Z_INDEX = {
  0: 'z-0',
  10: 'z-10',
  20: 'z-20',
  30: 'z-30',
  40: 'z-40',
  50: 'z-50',
  auto: 'z-auto',
};

// Transitions
export const TRANSITIONS = {
  all: 'transition-all',
  colors: 'transition-colors',
  opacity: 'transition-opacity',
  shadow: 'transition-shadow',
  transform: 'transition-transform',
};

// Durations
export const DURATIONS = {
  75: 'duration-75',
  100: 'duration-100',
  150: 'duration-150',
  200: 'duration-200',
  300: 'duration-300',
  500: 'duration-500',
  700: 'duration-700',
  1000: 'duration-1000',
};

// Common component styles
export const COMPONENT_STYLES = {
  input: {
    base: 'h-10 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    error: 'border-red-300 focus-visible:ring-red-500',
    active: 'border-brand-300 focus-visible:ring-brand-500',
  },
  button: {
    base: 'h-10 px-4 py-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    primary: 'bg-brand-600 hover:bg-brand-700 text-white',
    secondary: 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-800',
    outline: 'bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 text-gray-700',
  },
  card: {
    base: 'rounded-lg border border-gray-200 bg-white shadow-sm',
    hover: 'hover:shadow-md transition-all duration-300',
  },
  badge: {
    base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    secondary: 'bg-gray-50 text-gray-700 border-gray-200',
    accent: 'bg-accent2-50 text-accent2-700 border-accent2-200',
  },
  dropdown: {
    base: 'w-full border rounded-lg h-10 pl-3 pr-10 text-sm appearance-none',
    active: 'text-gray-800 font-medium',
    inactive: 'text-gray-600',
    border: 'border-gray-300',
    focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    disabled: 'bg-gray-100 text-gray-500 cursor-not-allowed',
    enabled: 'bg-white cursor-pointer',
  },
};

// Animation
export const ANIMATION = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideInRight: 'animate-slide-in-right',
};

// Layout
export const LAYOUT = {
  container: {
    base: 'max-w-7xl mx-auto',
    padding: {
      mobile: 'px-2 py-2',
      tablet: 'px-3 py-3',
      desktop: 'px-4 sm:px-5 py-5',
      largeDesktop: 'px-4 sm:px-6 py-6',
    },
  },
  sidebar: {
    width: {
      collapsed: 'w-16',
      expanded: 'w-48',
    },
  },
  filter: {
    width: {
      desktop: 'w-[448px]',
    },
  },
};

// Timing
export const TIMING = {
  apiDelay: 800,
  animationDelay: 300,
  debounceDelay: 300,
  toastDuration: 3000,
};

// Magic numbers
export const MAGIC_NUMBERS = {
  itemsPerPage: 30,
  skeletonCount: 6,
  maxInputLength: 10,
};