import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children content', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('has correct base styling', () => {
    render(<Card>Content</Card>);
    const card = screen.getByTestId('ui-card');
    expect(card).toHaveClass('bg-[#18181b]');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('rounded-xl');
    expect(card).toHaveClass('p-8');
  });

  it('renders with cyan glow by default', () => {
    render(<Card>Content</Card>);
    const card = screen.getByTestId('ui-card');
    expect(card).toHaveClass('border-[#22d3ee]/20');
    expect(card).toHaveClass('shadow-[#22d3ee]/10');
  });

  it('renders with purple glow', () => {
    render(<Card glowColor="purple">Content</Card>);
    const card = screen.getByTestId('ui-card');
    expect(card).toHaveClass('border-[#a855f7]/20');
    expect(card).toHaveClass('shadow-[#a855f7]/10');
  });

  it('renders with green glow', () => {
    render(<Card glowColor="green">Content</Card>);
    const card = screen.getByTestId('ui-card');
    expect(card).toHaveClass('border-[#22c55e]/20');
    expect(card).toHaveClass('shadow-[#22c55e]/10');
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Content</Card>);
    expect(screen.getByTestId('ui-card')).toHaveClass('custom-class');
  });
});
