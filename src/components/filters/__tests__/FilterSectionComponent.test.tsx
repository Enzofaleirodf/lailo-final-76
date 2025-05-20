
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    
    // Check if children content is displayed when expanded
    expect(screen.getByTestId('section-content')).toBeInTheDocument();
  });

  test('toggles content visibility when header is clicked', () => {
    const { rerender } = render(
      <FilterSectionComponent 
        title={mockTitle} 
        isExpanded={false} 
        onToggle={mockOnToggle}
      >
        {mockContent}
      </FilterSectionComponent>
    );
    
    // Content should be hidden (opacity 0) when collapsed
    const content = screen.getByTestId('section-content').closest('.transition-all');
    expect(content).toHaveClass('opacity-0');
    
    // Click on header to toggle
    fireEvent.click(screen.getByText(mockTitle));
    expect(mockOnToggle).toHaveBeenCalled();
    
    // Rerender with expanded=true to simulate state change
    rerender(
      <FilterSectionComponent 
        title={mockTitle} 
        isExpanded={true} 
        onToggle={mockOnToggle}
      >
        {mockContent}
      </FilterSectionComponent>
    );
    
    // Content should now be visible
    expect(content).toHaveClass('opacity-100');
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
    
    // Check aria attributes on toggle button
    const toggleButton = screen.getByRole('button', { name: mockTitle });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(toggleButton).toHaveAttribute('aria-controls');
    
    // Check region has correct role
    const contentId = toggleButton.getAttribute('aria-controls');
    const contentRegion = document.getElementById(contentId as string);
    expect(contentRegion).toHaveAttribute('role', 'region');
  });
});
