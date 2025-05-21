
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterSectionComponent from '../FilterSectionComponent';

// Mock the use-mobile hook
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}));

describe('FilterSectionComponent', () => {
  const mockOnToggle = jest.fn();
  const mockTitle = "Test Filter Section";
  const mockContent = <div data-testid="section-content">Filter content</div>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with title and children', () => {
    render(
      <FilterSectionComponent 
        title={mockTitle} 
        isExpanded={true} 
        onToggle={mockOnToggle}
      >
        {mockContent}
      </FilterSectionComponent>
    );
    
    // Check if title is displayed
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
    
    // Check if children content is displayed
    expect(screen.getByTestId('section-content')).toBeInTheDocument();
  });

  test('applies correct background gradient to header', () => {
    render(
      <FilterSectionComponent 
        title={mockTitle} 
        isExpanded={true} 
        onToggle={mockOnToggle}
      >
        {mockContent}
      </FilterSectionComponent>
    );
    
    // Verify header has the gradient class
    const header = screen.getByText(mockTitle).closest('div');
    expect(header).toHaveClass('bg-gradient-to-r');
    expect(header).toHaveClass('from-brand-50');
    expect(header).toHaveClass('to-white');
  });

  test('has correct accessibility attributes', () => {
    render(
      <FilterSectionComponent 
        title={mockTitle} 
        isExpanded={true} 
        onToggle={mockOnToggle}
      >
        {mockContent}
      </FilterSectionComponent>
    );
    
    // Check region has correct role
    const region = screen.getByRole('region');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('id', `filter-section-${mockTitle.toLowerCase().replace(/\s+/g, '-')}`);
  });
});
