/**
 * Mock SI Data for Development
 */

import { ExtractedSIData } from '@/types/si-data';
import { ValidationResult } from '@/types/validation';

export const mockSIData: ExtractedSIData = {
  id: 'si_abc123',
  fileName: 'shipping_instruction_001.pdf',
  uploadedAt: new Date('2025-12-15T10:30:00Z'),
  status: 'validated',
  
  // Shipper Information
  shipperName: 'Global Export Corp',
  shipperAddress: '123 Harbor Street, Los Angeles, CA 90001, USA',
  shipperContact: '+1-310-555-0123',
  
  // Consignee Information
  consigneeName: 'Asia Import Trading Co',
  consigneeAddress: '456 Business Avenue, Singapore 018956',
  consigneeContact: '+65-6789-0123',
  
  // Cargo Details
  cargoDescription: 'Electronic Components - Semiconductors',
  containerNumber: 'MSCU1234567',
  weight: 15000,
  weightUnit: 'KG',
  volume: 28.5,
  volumeUnit: 'CBM',
  
  // Shipping Details
  portOfLoading: 'USLAX',
  portOfDischarge: 'SGSIN',
  vesselName: 'PACIFIC FORTUNE',
  voyageNumber: 'PF2025-12',
  bookingNumber: 'BK20251215-001',
  
  // Dates
  cargoReadyDate: '2025-12-20',
  requestedShipDate: '2025-12-25',
  
  // Validation metadata
  validationResult: {
    isValid: true,
    validatedAt: '2025-12-15T11:00:00Z',
    autoFixesApplied: 2,
  },
};

export const mockValidationResult: ValidationResult = {
  isValid: true,
  issues: [
    {
      field: 'vesselName',
      severity: 'info',
      message: 'Vessel name format verified',
      code: 'VESSEL_NAME_OK',
    },
  ],
  autoFixes: [
    {
      field: 'portOfLoading',
      originalValue: 'Los Angeles',
      fixedValue: 'USLAX',
      reason: 'Converted port name to UN/LOCODE',
    },
    {
      field: 'portOfDischarge',
      originalValue: 'Singapore',
      fixedValue: 'SGSIN',
      reason: 'Converted port name to UN/LOCODE',
    },
  ],
  metadata: {
    totalFields: 17,
    validFields: 17,
    invalidFields: 0,
    warningFields: 0,
    autoFixedFields: 2,
  },
};

export const mockSIDataWithWarnings: ExtractedSIData = {
  ...mockSIData,
  vesselName: undefined,
  voyageNumber: undefined,
  validationResult: {
    isValid: false,
    validatedAt: '2025-12-15T11:00:00Z',
    autoFixesApplied: 1,
  },
};

export const mockValidationResultWithWarnings: ValidationResult = {
  isValid: false,
  issues: [
    {
      field: 'vesselName',
      severity: 'warning',
      message: 'Vessel name is optional but recommended',
      code: 'VESSEL_NAME_MISSING',
      suggestion: 'Consider adding vessel name for better tracking',
    },
    {
      field: 'voyageNumber',
      severity: 'warning',
      message: 'Voyage number is optional but recommended',
      code: 'VOYAGE_NUMBER_MISSING',
      suggestion: 'Consider adding voyage number for better tracking',
    },
  ],
  autoFixes: [
    {
      field: 'portOfLoading',
      originalValue: 'Los Angeles',
      fixedValue: 'USLAX',
      reason: 'Converted port name to UN/LOCODE',
    },
  ],
  metadata: {
    totalFields: 17,
    validFields: 15,
    invalidFields: 0,
    warningFields: 2,
    autoFixedFields: 1,
  },
};
