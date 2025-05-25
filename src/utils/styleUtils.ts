/**
 * Style Utilities
 * 
 * This file contains utility functions for applying consistent styles throughout the application.
 */

import { cn } from '@/lib/utils';
import { COMPONENT_STYLES } from '@/constants/designSystem';

/**
 * Applies consistent input styles
 * 
 * @param isError Whether the input has an error
 * @param isActive Whether the input is active
 * @param additionalClasses Additional classes to apply
 * @returns A string of classes to apply to the input
 */
export const getInputStyles = (
  isError: boolean = false,
  isActive: boolean = false,
  additionalClasses: string = ''
): string => {
  return cn(
    COMPONENT_STYLES.input.base,
    isError ? COMPONENT_STYLES.input.error : '',
    isActive ? COMPONENT_STYLES.input.active : '',
    additionalClasses
  );
};

/**
 * Applies consistent button styles
 * 
 * @param variant The button variant ('primary', 'secondary', or 'outline')
 * @param additionalClasses Additional classes to apply
 * @returns A string of classes to apply to the button
 */
export const getButtonStyles = (
  variant: 'primary' | 'secondary' | 'outline' = 'primary',
  additionalClasses: string = ''
): string => {
  return cn(
    COMPONENT_STYLES.button.base,
    COMPONENT_STYLES.button[variant],
    additionalClasses
  );
};

/**
 * Applies consistent card styles
 * 
 * @param hover Whether to apply hover styles
 * @param additionalClasses Additional classes to apply
 * @returns A string of classes to apply to the card
 */
export const getCardStyles = (
  hover: boolean = true,
  additionalClasses: string = ''
): string => {
  return cn(
    COMPONENT_STYLES.card.base,
    hover ? COMPONENT_STYLES.card.hover : '',
    additionalClasses
  );
};

/**
 * Applies consistent badge styles
 * 
 * @param variant The badge variant ('primary', 'secondary', or 'accent')
 * @param additionalClasses Additional classes to apply
 * @returns A string of classes to apply to the badge
 */
export const getBadgeStyles = (
  variant: 'primary' | 'secondary' | 'accent' = 'primary',
  additionalClasses: string = ''
): string => {
  return cn(
    COMPONENT_STYLES.badge.base,
    COMPONENT_STYLES.badge[variant],
    additionalClasses
  );
};

/**
 * Applies consistent dropdown styles
 * 
 * @param isActive Whether the dropdown is active
 * @param isDisabled Whether the dropdown is disabled
 * @param additionalClasses Additional classes to apply
 * @returns A string of classes to apply to the dropdown
 */
export const getDropdownStyles = (
  isActive: boolean = false,
  isDisabled: boolean = false,
  additionalClasses: string = ''
): string => {
  return cn(
    COMPONENT_STYLES.dropdown.base,
    isActive ? COMPONENT_STYLES.dropdown.active : COMPONENT_STYLES.dropdown.inactive,
    COMPONENT_STYLES.dropdown.border,
    COMPONENT_STYLES.dropdown.focus,
    isDisabled ? COMPONENT_STYLES.dropdown.disabled : COMPONENT_STYLES.dropdown.enabled,
    additionalClasses
  );
};

/**
 * Applies responsive padding based on screen size
 * 
 * @param deviceType The device type ('mobile', 'tablet', 'desktop', or 'largeDesktop')
 * @returns A string of padding classes
 */
export const getResponsivePadding = (
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'largeDesktop'
): string => {
  switch (deviceType) {
    case 'mobile':
      return 'px-2 py-2';
    case 'tablet':
      return 'px-3 py-3';
    case 'desktop':
      return 'px-4 sm:px-5 py-5';
    case 'largeDesktop':
      return 'px-4 sm:px-6 py-6';
    default:
      return 'px-4 py-4';
  }
};

/**
 * Applies responsive typography based on screen size
 * 
 * @param deviceType The device type ('mobile', 'tablet', 'desktop', or 'largeDesktop')
 * @returns An object with typography classes for different text elements
 */
export const getResponsiveTypography = (
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'largeDesktop'
): Record<string, string> => {
  switch (deviceType) {
    case 'mobile':
      return {
        h1: 'text-2xl font-bold tracking-tight',
        h2: 'text-xl font-semibold',
        h3: 'text-lg font-medium',
        body: 'text-sm',
        small: 'text-xs',
      };
    case 'tablet':
      return {
        h1: 'text-3xl font-bold tracking-tight',
        h2: 'text-2xl font-semibold',
        h3: 'text-xl font-medium',
        body: 'text-base',
        small: 'text-sm',
      };
    case 'desktop':
    case 'largeDesktop':
    default:
      return {
        h1: 'text-4xl font-bold tracking-tight',
        h2: 'text-3xl font-semibold',
        h3: 'text-2xl font-medium',
        body: 'text-base',
        small: 'text-sm',
      };
  }
};