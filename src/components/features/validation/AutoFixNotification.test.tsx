import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AutoFixNotification } from './AutoFixNotification';
import { AutoFixResult } from '@/types/validation';
import userEvent from '@testing-library/user-event';

const createMockFixes = (): AutoFixResult[] => [
  {
    field: 'containerNumber',
    originalValue: 'abcd1234567',
    fixedValue: 'ABCD1234567',
    reason: 'Converted to uppercase',
  },
  {
    field: 'bookingNumber',
    originalValue: 'book 123456',
    fixedValue: 'BOOK123456',
    reason: 'Removed spaces and converted to uppercase',
  },
  {
    field: 'portOfLoading',
    originalValue: 'usnyc',
    fixedValue: 'USNYC',
    reason: 'Converted to uppercase UN/LOCODE format',
  },
];

describe('AutoFixNotification', () => {
  it('should render notification with correct title', () => {
    const fixes = createMockFixes();
    render(<AutoFixNotification fixes={fixes} onDismiss={() => {}} />);
    
    expect(screen.getByText('Auto-corrections Applied')).toBeInTheDocument();
  });

  it('should display count of auto-fixes', () => {
    const fixes = createMockFixes();
    render(<AutoFixNotification fixes={fixes} onDismiss={() => {}} />);
    
    expect(screen.getByText(/3 fields were automatically corrected/)).toBeInTheDocument();
  });

  it('should display singular form for single fix', () => {
    const fixes = [createMockFixes()[0]];
    render(<AutoFixNotification fixes={fixes} onDismiss={() => {}} />);
    
    expect(screen.getByText(/1 field was automatically corrected/)).toBeInTheDocument();
  });

  it('should display all fix details', () => {
    const fixes = createMockFixes();
    render(<AutoFixNotification fixes={fixes} onDismiss={() => {}} />);
    
    expect(screen.getByText('Container Number')).toBeInTheDocument();
    expect(screen.getByText('Booking Number')).toBeInTheDocument();
    expect(screen.getByText('Port Of Loading')).toBeInTheDocument();
  });

  it('should show original and fixed values', () => {
    const fixes = createMockFixes();
    render(<AutoFixNotification fixes={fixes} onDismiss={() => {}} />);
    
    expect(screen.getByText('abcd1234567')).toBeInTheDocument();
    expect(screen.getByText('ABCD1234567')).toBeInTheDocument();
  });

  it('should display fix reasons', () => {
    const fixes = createMockFixes();
    render(<AutoFixNotification fixes={fixes} onDismiss={() => {}} />);
    
    expect(screen.getByText('Converted to uppercase')).toBeInTheDocument();
    expect(screen.getByText('Removed spaces and converted to uppercase')).toBeInTheDocument();
  });

  it('should call onDismiss when dismiss button clicked', async () => {
    const fixes = createMockFixes();
    const onDismiss = vi.fn();
    render(<AutoFixNotification fixes={fixes} onDismiss={onDismiss} />);
    
    const dismissButton = screen.getByLabelText('Dismiss notification');
    await userEvent.click(dismissButton);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should call onDismiss when "Got it" button clicked', async () => {
    const fixes = createMockFixes();
    const onDismiss = vi.fn();
    render(<AutoFixNotification fixes={fixes} onDismiss={onDismiss} />);
    
    const gotItButton = screen.getByText('Got it');
    await userEvent.click(gotItButton);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should call onViewDetails when fix item clicked', async () => {
    const fixes = createMockFixes();
    const onViewDetails = vi.fn();
    render(
      <AutoFixNotification 
        fixes={fixes} 
        onDismiss={() => {}} 
        onViewDetails={onViewDetails} 
      />
    );
    
    const fixButton = screen.getByText('Container Number').closest('button');
    await userEvent.click(fixButton!);
    
    expect(onViewDetails).toHaveBeenCalledWith('containerNumber');
  });

  it('should not render when fixes array is empty', () => {
    const { container } = render(
      <AutoFixNotification fixes={[]} onDismiss={() => {}} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should truncate long values', () => {
    const longFix: AutoFixResult = {
      field: 'cargoDescription',
      originalValue: 'A'.repeat(50),
      fixedValue: 'B'.repeat(50),
      reason: 'Truncated',
    };
    
    render(<AutoFixNotification fixes={[longFix]} onDismiss={() => {}} />);
    
    const originalValue = screen.getByText(/A+\.\.\./);
    expect(originalValue).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const fixes = createMockFixes();
    const { container } = render(
      <AutoFixNotification fixes={fixes} onDismiss={() => {}} />
    );
    
    const card = container.querySelector('.border-\\[\\#22D3EE\\]');
    expect(card).toBeInTheDocument();
  });

  it('should display rotate icon', () => {
    const fixes = createMockFixes();
    render(<AutoFixNotification fixes={fixes} onDismiss={() => {}} />);
    
    expect(screen.getByText('⟳')).toBeInTheDocument();
  });

  it('should have scrollable fix list for many fixes', () => {
    const manyFixes = Array.from({ length: 10 }, (_, i) => ({
      field: `field${i}`,
      originalValue: `original${i}`,
      fixedValue: `fixed${i}`,
      reason: `Reason ${i}`,
    }));
    
    const { container } = render(
      <AutoFixNotification fixes={manyFixes} onDismiss={() => {}} />
    );
    
    const scrollableDiv = container.querySelector('.max-h-60.overflow-y-auto');
    expect(scrollableDiv).toBeInTheDocument();
  });
});
