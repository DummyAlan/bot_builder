import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ValidationSummaryCard } from './ValidationSummaryCard';
import { ValidationResult } from '@/types/validation';
import userEvent from '@testing-library/user-event';

const createValidResult = (): ValidationResult => ({
  isValid: true,
  issues: [],
  autoFixes: [],
  metadata: {
    totalFields: 17,
    validFields: 17,
    invalidFields: 0,
    warningFields: 0,
    autoFixedFields: 0,
  },
});

const createInvalidResult = (): ValidationResult => ({
  isValid: false,
  issues: [
    {
      field: 'containerNumber',
      severity: 'error',
      message: 'Invalid container number format',
      code: 'INVALID_FORMAT',
      suggestion: 'Use format: ABCD1234567',
    },
    {
      field: 'portOfDischarge',
      severity: 'warning',
      message: 'Port code may be invalid',
      code: 'INVALID_PORT',
    },
    {
      field: 'weight',
      severity: 'info',
      message: 'Weight is above average',
      code: 'INFO',
    },
  ],
  autoFixes: [],
  metadata: {
    totalFields: 17,
    validFields: 14,
    invalidFields: 1,
    warningFields: 1,
    autoFixedFields: 0,
  },
});

describe('ValidationSummaryCard', () => {
  it('should render validation passed state', () => {
    const result = createValidResult();
    render(<ValidationSummaryCard result={result} />);
    
    expect(screen.getByText('Validation Passed')).toBeInTheDocument();
    expect(screen.getByTestId('validation-badge-valid')).toBeInTheDocument();
  });

  it('should render validation failed state', () => {
    const result = createInvalidResult();
    render(<ValidationSummaryCard result={result} />);
    
    expect(screen.getByText('Validation Failed')).toBeInTheDocument();
    expect(screen.getByTestId('validation-badge-invalid')).toBeInTheDocument();
  });

  it('should display all badge counts correctly', () => {
    const result = createInvalidResult();
    render(<ValidationSummaryCard result={result} />);
    
    const validBadge = screen.getByTestId('validation-badge-valid');
    const invalidBadge = screen.getByTestId('validation-badge-invalid');
    const warningBadge = screen.getByTestId('validation-badge-warning');
    
    expect(validBadge).toHaveTextContent('14');
    expect(invalidBadge).toHaveTextContent('1');
    expect(warningBadge).toHaveTextContent('1');
  });

  it('should expand issues when clicked', async () => {
    const result = createInvalidResult();
    render(<ValidationSummaryCard result={result} />);
    
    const expandButton = screen.getByLabelText('Expand issues');
    await userEvent.click(expandButton);
    
    expect(screen.getByText('Errors (1)')).toBeInTheDocument();
    expect(screen.getByText('Warnings (1)')).toBeInTheDocument();
    expect(screen.getByText('Info (1)')).toBeInTheDocument();
  });

  it('should collapse issues when clicked again', async () => {
    const result = createInvalidResult();
    render(<ValidationSummaryCard result={result} />);
    
    const expandButton = screen.getByLabelText('Expand issues');
    await userEvent.click(expandButton);
    await userEvent.click(expandButton);
    
    expect(screen.queryByText('Errors (1)')).not.toBeInTheDocument();
  });

  it('should call onIssueClick when issue is clicked', async () => {
    const result = createInvalidResult();
    const onIssueClick = vi.fn();
    render(<ValidationSummaryCard result={result} onIssueClick={onIssueClick} />);
    
    const expandButton = screen.getByLabelText('Expand issues');
    await userEvent.click(expandButton);
    
    const issueButton = screen.getByText('Container Number').closest('button');
    await userEvent.click(issueButton!);
    
    expect(onIssueClick).toHaveBeenCalledWith('containerNumber');
  });

  it('should display error messages and suggestions', async () => {
    const result = createInvalidResult();
    render(<ValidationSummaryCard result={result} />);
    
    const expandButton = screen.getByLabelText('Expand issues');
    await userEvent.click(expandButton);
    
    expect(screen.getByText('Invalid container number format')).toBeInTheDocument();
    expect(screen.getByText('💡 Use format: ABCD1234567')).toBeInTheDocument();
  });

  it('should not show expand button when no issues', () => {
    const result = createValidResult();
    render(<ValidationSummaryCard result={result} />);
    
    expect(screen.queryByLabelText('Expand issues')).not.toBeInTheDocument();
  });

  it('should show auto-fixed badge when auto-fixes applied', () => {
    const result: ValidationResult = {
      ...createValidResult(),
      autoFixes: [
        {
          field: 'containerNumber',
          originalValue: 'abcd1234567',
          fixedValue: 'ABCD1234567',
          reason: 'Converted to uppercase',
        },
      ],
      metadata: {
        ...createValidResult().metadata,
        autoFixedFields: 1,
      },
    };
    
    render(<ValidationSummaryCard result={result} />);
    expect(screen.getByTestId('validation-badge-auto-fixed')).toBeInTheDocument();
  });

  it('should apply correct border color based on validation state', () => {
    const { container, rerender } = render(
      <ValidationSummaryCard result={createValidResult()} />
    );
    
    expect(container.querySelector('.border-\\[\\#10B981\\]\\/30')).toBeInTheDocument();
    
    rerender(<ValidationSummaryCard result={createInvalidResult()} />);
    expect(container.querySelector('.border-\\[\\#EF4444\\]\\/30')).toBeInTheDocument();
  });
});
