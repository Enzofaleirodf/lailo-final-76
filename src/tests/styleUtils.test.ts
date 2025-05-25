import { describe, it, expect } from 'vitest';
import { 
  getInputStyles, 
  getButtonStyles, 
  getCardStyles, 
  getBadgeStyles, 
  getDropdownStyles 
} from '../utils/styleUtils';

describe('styleUtils', () => {
  describe('getInputStyles', () => {
    it('returns base styles when no options are provided', () => {
      const styles = getInputStyles();
      expect(styles).toContain('h-10');
      expect(styles).toContain('w-full');
      expect(styles).toContain('rounded-lg');
      expect(styles).toContain('border');
      expect(styles).toContain('border-gray-300');
    });
    
    it('includes error styles when isError is true', () => {
      const styles = getInputStyles(true);
      expect(styles).toContain('border-red-300');
      expect(styles).toContain('focus-visible:ring-red-500');
    });
    
    it('includes active styles when isActive is true', () => {
      const styles = getInputStyles(false, true);
      expect(styles).toContain('border-brand-300');
      expect(styles).toContain('focus-visible:ring-brand-500');
    });
    
    it('includes additional classes when provided', () => {
      const styles = getInputStyles(false, false, 'test-class');
      expect(styles).toContain('test-class');
    });
  });
  
  describe('getButtonStyles', () => {
    it('returns primary styles by default', () => {
      const styles = getButtonStyles();
      expect(styles).toContain('bg-brand-600');
      expect(styles).toContain('hover:bg-brand-700');
      expect(styles).toContain('text-white');
    });
    
    it('returns secondary styles when variant is secondary', () => {
      const styles = getButtonStyles('secondary');
      expect(styles).toContain('bg-gray-100');
      expect(styles).toContain('border-gray-200');
      expect(styles).toContain('hover:bg-gray-200');
      expect(styles).toContain('text-gray-800');
    });
    
    it('returns outline styles when variant is outline', () => {
      const styles = getButtonStyles('outline');
      expect(styles).toContain('bg-white');
      expect(styles).toContain('border');
      expect(styles).toContain('border-gray-300');
      expect(styles).toContain('hover:bg-gray-50');
      expect(styles).toContain('hover:text-gray-700');
      expect(styles).toContain('text-gray-700');
    });
    
    it('includes additional classes when provided', () => {
      const styles = getButtonStyles('primary', 'test-class');
      expect(styles).toContain('test-class');
    });
  });
  
  describe('getCardStyles', () => {
    it('returns base styles with hover by default', () => {
      const styles = getCardStyles();
      expect(styles).toContain('rounded-lg');
      expect(styles).toContain('border');
      expect(styles).toContain('border-gray-200');
      expect(styles).toContain('bg-white');
      expect(styles).toContain('shadow-sm');
      expect(styles).toContain('hover:shadow-md');
      expect(styles).toContain('transition-all');
      expect(styles).toContain('duration-300');
    });
    
    it('returns base styles without hover when hover is false', () => {
      const styles = getCardStyles(false);
      expect(styles).toContain('rounded-lg');
      expect(styles).toContain('border');
      expect(styles).toContain('border-gray-200');
      expect(styles).toContain('bg-white');
      expect(styles).toContain('shadow-sm');
      expect(styles).not.toContain('hover:shadow-md');
      expect(styles).not.toContain('transition-all');
      expect(styles).not.toContain('duration-300');
    });
    
    it('includes additional classes when provided', () => {
      const styles = getCardStyles(true, 'test-class');
      expect(styles).toContain('test-class');
    });
  });
  
  describe('getBadgeStyles', () => {
    it('returns primary styles by default', () => {
      const styles = getBadgeStyles();
      expect(styles).toContain('inline-flex');
      expect(styles).toContain('items-center');
      expect(styles).toContain('rounded-full');
      expect(styles).toContain('px-2.5');
      expect(styles).toContain('py-0.5');
      expect(styles).toContain('text-xs');
      expect(styles).toContain('font-semibold');
      expect(styles).toContain('bg-brand-50');
      expect(styles).toContain('text-brand-700');
      expect(styles).toContain('border-brand-200');
    });
    
    it('returns secondary styles when variant is secondary', () => {
      const styles = getBadgeStyles('secondary');
      expect(styles).toContain('bg-gray-50');
      expect(styles).toContain('text-gray-700');
      expect(styles).toContain('border-gray-200');
    });
    
    it('returns accent styles when variant is accent', () => {
      const styles = getBadgeStyles('accent');
      expect(styles).toContain('bg-accent2-50');
      expect(styles).toContain('text-accent2-700');
      expect(styles).toContain('border-accent2-200');
    });
    
    it('includes additional classes when provided', () => {
      const styles = getBadgeStyles('primary', 'test-class');
      expect(styles).toContain('test-class');
    });
  });
  
  describe('getDropdownStyles', () => {
    it('returns base styles with inactive and enabled by default', () => {
      const styles = getDropdownStyles();
      expect(styles).toContain('w-full');
      expect(styles).toContain('border');
      expect(styles).toContain('rounded-lg');
      expect(styles).toContain('h-10');
      expect(styles).toContain('pl-3');
      expect(styles).toContain('pr-10');
      expect(styles).toContain('text-sm');
      expect(styles).toContain('appearance-none');
      expect(styles).toContain('text-gray-600');
      expect(styles).toContain('border-gray-300');
      expect(styles).toContain('focus-visible:outline-none');
      expect(styles).toContain('focus-visible:ring-2');
      expect(styles).toContain('focus-visible:ring-brand-500');
      expect(styles).toContain('focus-visible:ring-offset-2');
      expect(styles).toContain('bg-white');
      expect(styles).toContain('cursor-pointer');
    });
    
    it('includes active styles when isActive is true', () => {
      const styles = getDropdownStyles(true);
      expect(styles).toContain('text-gray-800');
      expect(styles).toContain('font-medium');
    });
    
    it('includes disabled styles when isDisabled is true', () => {
      const styles = getDropdownStyles(false, true);
      expect(styles).toContain('bg-gray-100');
      expect(styles).toContain('text-gray-500');
      expect(styles).toContain('cursor-not-allowed');
    });
    
    it('includes additional classes when provided', () => {
      const styles = getDropdownStyles(false, false, 'test-class');
      expect(styles).toContain('test-class');
    });
  });
});