
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterDropdown from '../FilterDropdown';

describe('FilterDropdown', () => {
  const mockOnChange = jest.fn();
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default value', () => {
    render(
      <FilterDropdown
        value="option1"
        onChange={mockOnChange}
        options={options}
        aria-label="Test dropdown"
      />
    );

    expect(screen.getByLabelText('Test dropdown')).toBeInTheDocument();
    expect(screen.getByLabelText('Test dropdown')).toHaveValue('option1');
  });

  test('calls onChange when selection changes', () => {
    render(
      <FilterDropdown
        value="option1"
        onChange={mockOnChange}
        options={options}
        aria-label="Test dropdown"
      />
    );

    fireEvent.change(screen.getByLabelText('Test dropdown'), {
      target: { value: 'option2' }
    });

    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  test('applies custom className', () => {
    render(
      <FilterDropdown
        value="option1"
        onChange={mockOnChange}
        options={options}
        className="custom-class"
        aria-label="Test dropdown"
      />
    );

    expect(screen.getByLabelText('Test dropdown')).toHaveClass('custom-class');
  });

  test('applies disabled state correctly', () => {
    render(
      <FilterDropdown
        value="option1"
        onChange={mockOnChange}
        options={options}
        disabled={true}
        aria-label="Test dropdown"
      />
    );

    expect(screen.getByLabelText('Test dropdown')).toBeDisabled();
  });

  test('shows placeholder when provided', () => {
    render(
      <FilterDropdown
        value=""
        onChange={mockOnChange}
        options={options}
        placeholder="Select an option"
        aria-label="Test dropdown"
      />
    );

    const selectElement = screen.getByLabelText('Test dropdown');
    expect(selectElement).toHaveValue('');
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });
});
