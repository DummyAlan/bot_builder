/**
 * DataSummaryTable Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataSummaryTable } from './DataSummaryTable';
import { mockSIData } from '@/mocks/si-mock-data';

describe('DataSummaryTable', () => {
  it('renders all SI data fields', () => {
    render(<DataSummaryTable data={mockSIData} />);

    // Check for key fields
    expect(screen.getByText('Shipper Name')).toBeInTheDocument();
    expect(screen.getByText(mockSIData.shipperName)).toBeInTheDocument();
    
    expect(screen.getByText('Consignee Name')).toBeInTheDocument();
    expect(screen.getByText(mockSIData.consigneeName)).toBeInTheDocument();
    
    expect(screen.getByText('Booking Number')).toBeInTheDocument();
    expect(screen.getByText(mockSIData.bookingNumber)).toBeInTheDocument();
    
    expect(screen.getByText('Container Number')).toBeInTheDocument();
    expect(screen.getByText(mockSIData.containerNumber)).toBeInTheDocument();
  });

  it('displays weight with correct unit', () => {
    render(<DataSummaryTable data={mockSIData} />);
    
    expect(screen.getByText(`${mockSIData.weight} ${mockSIData.weightUnit}`)).toBeInTheDocument();
  });

  it('displays volume with correct unit', () => {
    render(<DataSummaryTable data={mockSIData} />);
    
    expect(screen.getByText(`${mockSIData.volume} ${mockSIData.volumeUnit}`)).toBeInTheDocument();
  });

  it('shows N/A for optional fields when missing', () => {
    const dataWithoutOptional = {
      ...mockSIData,
      vesselName: undefined,
      voyageNumber: undefined,
    };
    
    render(<DataSummaryTable data={dataWithoutOptional} />);
    
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThanOrEqual(2);
  });

  it('highlights modified fields when highlightChanges is true', () => {
    const modifiedFields = ['shipperName', 'consigneeName'];
    
    render(
      <DataSummaryTable
        data={mockSIData}
        highlightChanges={true}
        modifiedFields={modifiedFields}
      />
    );
    
    // Check for modified indicators
    const modifiedIndicators = screen.getAllByText('(Modified)');
    expect(modifiedIndicators).toHaveLength(modifiedFields.length);
  });

  it('does not highlight fields when highlightChanges is false', () => {
    const modifiedFields = ['shipperName', 'consigneeName'];
    
    render(
      <DataSummaryTable
        data={mockSIData}
        highlightChanges={false}
        modifiedFields={modifiedFields}
      />
    );
    
    // Should not show any modified indicators
    expect(screen.queryByText('(Modified)')).not.toBeInTheDocument();
  });

  it('renders with correct test IDs', () => {
    render(<DataSummaryTable data={mockSIData} />);
    
    expect(screen.getByTestId('data-summary-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-row-shipperName')).toBeInTheDocument();
    expect(screen.getByTestId('table-row-bookingNumber')).toBeInTheDocument();
  });

  it('displays all 17 fields', () => {
    render(<DataSummaryTable data={mockSIData} />);
    
    // Count table rows (excluding header)
    const rows = screen.getAllByRole('row');
    // 17 data rows + 1 header row = 18 total
    expect(rows.length).toBe(18);
  });

  it('formats dates correctly', () => {
    render(<DataSummaryTable data={mockSIData} />);
    
    expect(screen.getByText(mockSIData.cargoReadyDate)).toBeInTheDocument();
    expect(screen.getByText(mockSIData.requestedShipDate)).toBeInTheDocument();
  });
});
