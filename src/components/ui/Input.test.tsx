import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders input field', () => {
    render(<Input />);
    expect(screen.getByTestId('ui-input')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('associates label with input using htmlFor', () => {
    render(<Input label="Email Address" id="email" />);
    const label = screen.getByText('Email Address');
    const input = screen.getByLabelText('Email Address');
    expect(label).toHaveAttribute('for', 'email');
    expect(input).toHaveAttribute('id', 'email');
  });

  it('generates id from label when no id provided', () => {
    render(<Input label="Full Name" />);
    const input = screen.getByLabelText('Full Name');
    expect(input).toHaveAttribute('id', 'full-name');
  });

  it('displays error message', () => {
    render(<Input label="Password" error="Password is required" />);
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('applies error styling when error present', () => {
    render(<Input error="Error message" />);
    const input = screen.getByTestId('ui-input');
    expect(input).toHaveClass('border-[#ef4444]');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('links error message with aria-describedby', () => {
    render(<Input label="Username" id="username" error="Invalid username" />);
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('aria-describedby', 'username-error');
    const error = screen.getByRole('alert');
    expect(error).toHaveAttribute('id', 'username-error');
  });

  it('handles value changes', async () => {
    const user = userEvent.setup();
    let value = '';
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      value = e.target.value;
    };

    render(<Input onChange={handleChange} />);
    const input = screen.getByTestId('ui-input');

    await user.type(input, 'test value');
    expect(value).toBe('test value');
  });

  it('respects disabled state', () => {
    render(<Input disabled />);
    const input = screen.getByTestId('ui-input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('supports readOnly prop', () => {
    render(<Input readOnly value="Read only value" />);
    const input = screen.getByTestId('ui-input');
    expect(input).toHaveAttribute('readonly');
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" />);
    expect(screen.getByTestId('ui-input')).toHaveClass('custom-input');
  });

  it('has correct base styling', () => {
    render(<Input />);
    const input = screen.getByTestId('ui-input');
    expect(input).toHaveClass('bg-[#18181b]');
    expect(input).toHaveClass('text-[#fafafa]');
    expect(input).toHaveClass('border-[#3f3f46]');
    expect(input).toHaveClass('font-mono');
  });
});
