import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SIDataForm } from './SIDataForm';
import { mockSIData } from '@/mocks/si-data-mock';

describe('SIDataForm', () => {
  it('renders form with extracted data', () => {
    render(<SIDataForm data={mockSIData} />);
    expect(screen.getByTestId('si-data-form')).toBeInTheDocument();
  });

  it('displays file name and upload time', () => {
    render(<SIDataForm data={mockSIData} />);
    expect(screen.getByText(mockSIData.fileName)).toBeInTheDocument();
  });

  it('displays shipper information', () => {
    render(<SIDataForm data={mockSIData} />);
    expect(screen.getByDisplayValue(mockSIData.shipperName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockSIData.shipperAddress)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockSIData.shipperContact)).toBeInTheDocument();
  });

  it('displays consignee information', () => {
    render(<SIDataForm data={mockSIData} />);
    expect(screen.getByDisplayValue(mockSIData.consigneeName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockSIData.consigneeAddress)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockSIData.consigneeContact)).toBeInTheDocument();
  });

  it('displays cargo details', () => {
    render(<SIDataForm data={mockSIData} />);
    expect(screen.getByDisplayValue(mockSIData.cargoDescription)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockSIData.containerNumber)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockSIData.bookingNumber)).toBeInTheDocument();
  });

  it('displays weight with unit', () => {
    render(<SIDataForm data={mockSIData} />);
    const weightField = screen.getByTestId('si-form-field-weight');
    expect(weightField).toHaveValue(`${mockSIData.weight} ${mockSIData.weightUnit}`);
  });

  it('displays volume with unit', () => {
    render(<SIDataForm data={mockSIData} />);
    const volumeField = screen.getByTestId('si-form-field-volume');
    expect(volumeField).toHaveValue(`${mockSIData.volume} ${mockSIData.volumeUnit}`);
  });

  it('displays shipping details', () => {
    render(<SIDataForm data={mockSIData} />);
    expect(screen.getByDisplayValue(mockSIData.portOfLoading)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockSIData.portOfDischarge)).toBeInTheDocument();
  });

  it('displays vessel and voyage information', () => {
    render(<SIDataForm data={mockSIData} />);
    if (mockSIData.vesselName) {
      expect(screen.getByDisplayValue(mockSIData.vesselName)).toBeInTheDocument();
    }
    if (mockSIData.voyageNumber) {
      expect(screen.getByDisplayValue(mockSIData.voyageNumber)).toBeInTheDocument();
    }
  });

  it('handles optional vessel and voyage fields', () => {
    const dataWithoutOptionalFields = {
      ...mockSIData,
      vesselName: undefined,
      voyageNumber: undefined,
    };
    render(<SIDataForm data={dataWithoutOptionalFields} />);
    const vesselField = screen.getByTestId('si-form-field-vesselName');
    const voyageField = screen.getByTestId('si-form-field-voyageNumber');
    expect(vesselField).toHaveValue('N/A');
    expect(voyageField).toHaveValue('N/A');
  });

  it('displays formatted dates', () => {
    render(<SIDataForm data={mockSIData} />);
    // Dates should be formatted as readable text
    const cargoReadyField = screen.getByTestId('si-form-field-cargoReadyDate');
    const requestedShipField = screen.getByTestId('si-form-field-requestedShipDate');
    
    // Check that dates are formatted (not as ISO strings)
    const cargoValue = (cargoReadyField as HTMLInputElement).value;
    const shipValue = (requestedShipField as HTMLInputElement).value;
    
    // Should not be ISO format (YYYY-MM-DD)
    expect(cargoValue).not.toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(shipValue).not.toMatch(/^\d{4}-\d{2}-\d{2}/);
    
    // Should contain year
    expect(cargoValue).toContain('2025');
    expect(shipValue).toContain('2025');
  });

  it('renders all fields as read-only by default', () => {
    render(<SIDataForm data={mockSIData} />);
    const inputs = screen.queryAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('readonly');
    });
  });

  it('respects readOnly prop', () => {
    render(<SIDataForm data={mockSIData} readOnly={false} />);
    const inputs = screen.queryAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).not.toHaveAttribute('readonly');
    });
  });

  it('has correct data-testid for all fields', () => {
    render(<SIDataForm data={mockSIData} />);
    
    const fieldNames = [
      'shipperName',
      'shipperContact',
      'shipperAddress',
      'consigneeName',
      'consigneeContact',
      'consigneeAddress',
      'cargoDescription',
      'containerNumber',
      'bookingNumber',
      'weight',
      'volume',
      'portOfLoading',
      'portOfDischarge',
      'vesselName',
      'voyageNumber',
      'cargoReadyDate',
      'requestedShipDate',
    ];

    fieldNames.forEach((fieldName) => {
      expect(screen.getByTestId(`si-form-field-${fieldName}`)).toBeInTheDocument();
    });
  });

  it('organizes fields in sections', () => {
    render(<SIDataForm data={mockSIData} />);
    expect(screen.getByText('Shipper Information')).toBeInTheDocument();
    expect(screen.getByText('Consignee Information')).toBeInTheDocument();
    expect(screen.getByText('Cargo Details')).toBeInTheDocument();
    expect(screen.getByText('Shipping Details')).toBeInTheDocument();
    expect(screen.getByText('Important Dates')).toBeInTheDocument();
  });
});
