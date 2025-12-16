import { describe, it, expect } from 'vitest';
import { siValidator } from './si-validators';
import { ExtractedSIData } from '@/types/si-data';

const createMockData = (overrides?: Partial<ExtractedSIData>): ExtractedSIData => ({
  id: '123',
  fileName: 'test.pdf',
  uploadedAt: new Date(),
  status: 'extracted',
  shipperName: 'Acme Corporation',
  shipperAddress: '123 Main Street, New York, NY 10001',
  shipperContact: '+1-555-123-4567',
  consigneeName: 'Global Logistics Inc',
  consigneeAddress: '456 Market Street, San Francisco, CA 94102',
  consigneeContact: 'contact@globallogistics.com',
  cargoDescription: 'Electronic components and accessories',
  containerNumber: 'ABCD1234567',
  weight: 15000,
  weightUnit: 'KG',
  volume: 25,
  volumeUnit: 'CBM',
  portOfLoading: 'USNYC',
  portOfDischarge: 'CNSHA',
  vesselName: 'Ocean Voyager',
  voyageNumber: 'V123',
  bookingNumber: 'BOOK123456',
  cargoReadyDate: '2025-12-20',
  requestedShipDate: '2025-12-25',
  ...overrides,
});

describe('SIValidator', () => {
  describe('Required Fields Validation', () => {
    it('should pass validation for complete data', () => {
      const data = createMockData();
      const issues = siValidator.validate(data);
      const errors = issues.filter(i => i.severity === 'error');
      expect(errors.length).toBe(0);
    });

    it('should return error for missing shipper name', () => {
      const data = createMockData({ shipperName: '' });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'shipperName' && i.severity === 'error');
      expect(error).toBeDefined();
      expect(error?.code).toBe('REQUIRED_FIELD');
    });

    it('should return error for missing container number', () => {
      const data = createMockData({ containerNumber: '' });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'containerNumber' && i.severity === 'error');
      expect(error).toBeDefined();
    });
  });

  describe('Container Number Validation', () => {
    it('should accept valid container number', () => {
      const data = createMockData({ containerNumber: 'ABCD1234567' });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'containerNumber' && i.severity === 'error');
      expect(error).toBeUndefined();
    });

    it('should reject invalid container number format', () => {
      const data = createMockData({ containerNumber: 'ABC123' });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'containerNumber' && i.severity === 'error');
      expect(error).toBeDefined();
      expect(error?.code).toBe('INVALID_FORMAT');
    });

    it('should reject container number with lowercase letters', () => {
      const data = createMockData({ containerNumber: 'abcd1234567' });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'containerNumber' && i.severity === 'error');
      expect(error).toBeDefined();
    });
  });

  describe('Port Code Validation', () => {
    it('should accept valid port codes', () => {
      const data = createMockData({ 
        portOfLoading: 'USNYC',
        portOfDischarge: 'CNSHA',
      });
      const issues = siValidator.validate(data);
      const errors = issues.filter(i => 
        (i.field === 'portOfLoading' || i.field === 'portOfDischarge') && 
        i.severity === 'error'
      );
      expect(errors.length).toBe(0);
    });

    it('should reject invalid port code format', () => {
      const data = createMockData({ portOfLoading: 'NYC' });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'portOfLoading' && i.severity === 'error');
      expect(error).toBeDefined();
      expect(error?.code).toBe('INVALID_FORMAT');
    });

    it('should warn when port codes are the same', () => {
      const data = createMockData({ 
        portOfLoading: 'USNYC',
        portOfDischarge: 'USNYC',
      });
      const issues = siValidator.validate(data);
      const warning = issues.find(i => i.field === 'portOfDischarge' && i.severity === 'warning');
      expect(warning).toBeDefined();
      expect(warning?.code).toBe('SAME_PORTS');
    });
  });

  describe('Date Validation', () => {
    it('should accept valid future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const dateString = futureDate.toISOString().split('T')[0];
      
      const data = createMockData({ 
        cargoReadyDate: dateString,
        requestedShipDate: dateString,
      });
      const issues = siValidator.validate(data);
      const errors = issues.filter(i => 
        (i.field === 'cargoReadyDate' || i.field === 'requestedShipDate') && 
        i.severity === 'error'
      );
      expect(errors.length).toBe(0);
    });

    it('should reject invalid date format', () => {
      const data = createMockData({ cargoReadyDate: '12/31/2025' });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'cargoReadyDate' && i.severity === 'error');
      expect(error).toBeDefined();
      expect(error?.code).toBe('INVALID_DATE');
    });

    it('should error when ship date is before cargo ready date', () => {
      const data = createMockData({ 
        cargoReadyDate: '2025-12-25',
        requestedShipDate: '2025-12-20',
      });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'requestedShipDate' && i.code === 'INVALID_DATE_ORDER');
      expect(error).toBeDefined();
    });
  });

  describe('Weight and Volume Validation', () => {
    it('should accept valid weight and volume', () => {
      const data = createMockData({ weight: 15000, volume: 25 });
      const issues = siValidator.validate(data);
      const errors = issues.filter(i => 
        (i.field === 'weight' || i.field === 'volume') && 
        i.severity === 'error'
      );
      expect(errors.length).toBe(0);
    });

    it('should reject negative weight', () => {
      const data = createMockData({ weight: -100 });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'weight' && i.severity === 'error');
      expect(error).toBeDefined();
      expect(error?.code).toBe('OUT_OF_RANGE');
    });

    it('should warn on unusually high weight', () => {
      const data = createMockData({ weight: 150000 });
      const issues = siValidator.validate(data);
      const warning = issues.find(i => i.field === 'weight' && i.severity === 'warning');
      expect(warning).toBeDefined();
    });

    it('should reject negative volume', () => {
      const data = createMockData({ volume: -5 });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'volume' && i.severity === 'error');
      expect(error).toBeDefined();
    });
  });

  describe('Name Validation', () => {
    it('should accept valid names', () => {
      const data = createMockData({ 
        shipperName: 'Acme Corporation',
        consigneeName: 'Global Logistics Inc',
      });
      const issues = siValidator.validate(data);
      const errors = issues.filter(i => 
        (i.field === 'shipperName' || i.field === 'consigneeName') && 
        i.severity === 'error'
      );
      expect(errors.length).toBe(0);
    });

    it('should reject name that is too short', () => {
      const data = createMockData({ shipperName: 'A' });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'shipperName' && i.severity === 'error');
      expect(error).toBeDefined();
      expect(error?.code).toBe('TOO_SHORT');
    });

    it('should reject name that is too long', () => {
      const data = createMockData({ 
        shipperName: 'A'.repeat(150),
      });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'shipperName' && i.severity === 'error');
      expect(error).toBeDefined();
      expect(error?.code).toBe('TOO_LONG');
    });
  });

  describe('Address Validation', () => {
    it('should accept valid addresses', () => {
      const data = createMockData({ 
        shipperAddress: '123 Main Street, New York, NY 10001',
      });
      const issues = siValidator.validate(data);
      const errors = issues.filter(i => i.field === 'shipperAddress' && i.severity === 'error');
      expect(errors.length).toBe(0);
    });

    it('should reject address that is too short', () => {
      const data = createMockData({ shipperAddress: 'Short' });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'shipperAddress' && i.severity === 'error');
      expect(error).toBeDefined();
      expect(error?.code).toBe('TOO_SHORT');
    });
  });

  describe('Contact Validation', () => {
    it('should accept valid phone number', () => {
      const data = createMockData({ shipperContact: '+1-555-123-4567' });
      const issues = siValidator.validate(data);
      const errors = issues.filter(i => i.field === 'shipperContact' && i.severity === 'error');
      expect(errors.length).toBe(0);
    });

    it('should accept valid email', () => {
      const data = createMockData({ consigneeContact: 'contact@example.com' });
      const issues = siValidator.validate(data);
      const errors = issues.filter(i => i.field === 'consigneeContact' && i.severity === 'error');
      expect(errors.length).toBe(0);
    });

    it('should warn on invalid contact format', () => {
      const data = createMockData({ shipperContact: 'invalid-contact' });
      const issues = siValidator.validate(data);
      const warning = issues.find(i => i.field === 'shipperContact' && i.severity === 'warning');
      expect(warning).toBeDefined();
    });
  });

  describe('Booking Number Validation', () => {
    it('should accept valid booking number', () => {
      const data = createMockData({ bookingNumber: 'BOOK123456' });
      const issues = siValidator.validate(data);
      const errors = issues.filter(i => i.field === 'bookingNumber' && i.severity === 'error');
      expect(errors.length).toBe(0);
    });

    it('should reject booking number that is too short', () => {
      const data = createMockData({ bookingNumber: 'BOOK' });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'bookingNumber' && i.severity === 'error');
      expect(error).toBeDefined();
      expect(error?.code).toBe('INVALID_LENGTH');
    });

    it('should reject booking number with special characters', () => {
      const data = createMockData({ bookingNumber: 'BOOK-123456' });
      const issues = siValidator.validate(data);
      const error = issues.find(i => i.field === 'bookingNumber' && i.severity === 'error');
      expect(error).toBeDefined();
    });
  });
});
