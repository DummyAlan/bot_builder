import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ValidationBadge } from './ValidationBadge';

describe('ValidationBadge', () => {
  it('should render valid status badge', () => {
    render(<ValidationBadge status="valid" />);
    
    expect(screen.getByTestId('validation-badge-valid')).toBeInTheDocument();
    expect(screen.getByText('Valid')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should render invalid status badge', () => {
    render(<ValidationBadge status="invalid" />);
    
    expect(screen.getByTestId('validation-badge-invalid')).toBeInTheDocument();
    expect(screen.getByText('Invalid')).toBeInTheDocument();
    expect(screen.getByText('✗')).toBeInTheDocument();
  });

  it('should render warning status badge', () => {
    render(<ValidationBadge status="warning" />);
    
    expect(screen.getByTestId('validation-badge-warning')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('⚠')).toBeInTheDocument();
  });

  it('should render auto-fixed status badge', () => {
    render(<ValidationBadge status="auto-fixed" />);
    
    expect(screen.getByTestId('validation-badge-auto-fixed')).toBeInTheDocument();
    expect(screen.getByText('Auto-fixed')).toBeInTheDocument();
    expect(screen.getByText('⟳')).toBeInTheDocument();
  });

  it('should display custom label', () => {
    render(<ValidationBadge status="valid" label="Verified" />);
    
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('should display count when provided', () => {
    render(<ValidationBadge status="valid" count={15} />);
    
    expect(screen.getByText('(15)')).toBeInTheDocument();
  });

  it('should apply correct color classes for valid status', () => {
    const { container } = render(<ValidationBadge status="valid" />);
    const badge = screen.getByTestId('validation-badge-valid');
    
    expect(badge.className).toContain('text-[#10B981]');
    expect(badge.className).toContain('border-[#10B981]');
  });

  it('should apply correct color classes for invalid status', () => {
    const { container } = render(<ValidationBadge status="invalid" />);
    const badge = screen.getByTestId('validation-badge-invalid');
    
    expect(badge.className).toContain('text-[#EF4444]');
    expect(badge.className).toContain('border-[#EF4444]');
  });

  it('should apply correct color classes for warning status', () => {
    const { container } = render(<ValidationBadge status="warning" />);
    const badge = screen.getByTestId('validation-badge-warning');
    
    expect(badge.className).toContain('text-[#F97316]');
    expect(badge.className).toContain('border-[#F97316]');
  });

  it('should apply correct color classes for auto-fixed status', () => {
    const { container } = render(<ValidationBadge status="auto-fixed" />);
    const badge = screen.getByTestId('validation-badge-auto-fixed');
    
    expect(badge.className).toContain('text-[#22D3EE]');
    expect(badge.className).toContain('border-[#22D3EE]');
  });

  it('should apply custom className', () => {
    render(<ValidationBadge status="valid" className="custom-class" />);
    const badge = screen.getByTestId('validation-badge-valid');
    
    expect(badge.className).toContain('custom-class');
  });

  it('should have rounded-full class for pill shape', () => {
    render(<ValidationBadge status="valid" />);
    const badge = screen.getByTestId('validation-badge-valid');
    
    expect(badge.className).toContain('rounded-full');
  });

  it('should combine label and count correctly', () => {
    render(<ValidationBadge status="valid" label="Verified Fields" count={10} />);
    
    expect(screen.getByText('Verified Fields')).toBeInTheDocument();
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('should not display count when not provided', () => {
    const { container } = render(<ValidationBadge status="valid" />);
    
    expect(container.textContent).not.toContain('()');
  });
});
