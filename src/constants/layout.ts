
/**
 * Layout constants for consistent spacing, z-index and dimensions
 */

// Z-index hierarchy
export const Z_INDEX = {
  BACKDROP: 10,
  DROPDOWN: 20,
  MOBILE_FILTER_BAR: 30,
  SIDEBAR: 40,
  MOBILE_NAV_BAR: 50,
  MODAL: 60,
  TOAST: 70,
  TOOLTIP: 80
} as const;

// Layout dimensions
export const LAYOUT_DIMENSIONS = {
  SIDEBAR_COLLAPSED: 64, // 16 * 4 = 64px (w-16)
  SIDEBAR_EXPANDED: 192, // 48 * 4 = 192px (w-48)
  MOBILE_NAV_HEIGHT: 64, // 16 * 4 = 64px (h-16)
  MOBILE_FILTER_HEIGHT: 64, // 16 * 4 = 64px (h-16)
  HEADER_HEIGHT: 64
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

// Common spacing values
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  '2XL': 48
} as const;
