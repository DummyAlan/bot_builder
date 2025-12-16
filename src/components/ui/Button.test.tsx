import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders primary variant by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByTestId('ui-button');
    expect(button).toHaveClass('bg-[#22d3ee]');
  });

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByTestId('ui-button');
    expect(button).toHaveClass('bg-[#a855f7]');
  });

  it('renders outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByTestId('ui-button');
    expect(button).toHaveClass('border-[#22d3ee]');
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByTestId('ui-button')).toHaveClass('px-4', 'py-2');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByTestId('ui-button')).toHaveClass('px-6', 'py-3');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByTestId('ui-button')).toHaveClass('px-8', 'py-4');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByTestId('ui-button'));

    expect(clicked).toBe(true);
  });

  it('respects disabled state', async () => {
    const user = userEvent.setup();
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );

    const button = screen.getByTestId('ui-button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');

    await user.click(button);
    expect(clicked).toBe(false);
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByTestId('ui-button')).toHaveClass('custom-class');
  });
});
