import { describe, it, expect } from 'vitest';
import { autoFixer } from './auto-fix';
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

describe('AutoFixer', () => {
  describe('Container Number Auto-fix', () => {
    it('should convert lowercase to uppercase', () => {
      const data = createMockData({ containerNumber: 'abcd1234567' });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.containerNumber).toBe('ABCD1234567');
      expect(fixes.some(f => f.field === 'containerNumber')).toBe(true);
    });

    it('should remove spaces from container number', () => {
      const data = createMockData({ containerNumber: 'ABCD 123 4567' });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.containerNumber).toBe('ABCD1234567');
      expect(fixes.some(f => f.field === 'containerNumber')).toBe(true);
    });

    it('should not create fix entry if already correct', () => {
      const data = createMockData({ containerNumber: 'ABCD1234567' });
      const { fixes } = autoFixer.fix(data);
      
      expect(fixes.some(f => f.field === 'containerNumber')).toBe(false);
    });
  });

  describe('Booking Number Auto-fix', () => {
    it('should convert to uppercase', () => {
      const data = createMockData({ bookingNumber: 'book123456' });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.bookingNumber).toBe('BOOK123456');
      expect(fixes.some(f => f.field === 'bookingNumber')).toBe(true);
    });

    it('should remove spaces', () => {
      const data = createMockData({ bookingNumber: 'BOOK 123 456' });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.bookingNumber).toBe('BOOK123456');
      expect(fixes.some(f => f.field === 'bookingNumber')).toBe(true);
    });
  });

  describe('Port Code Auto-fix', () => {
    it('should convert port codes to uppercase', () => {
      const data = createMockData({ 
        portOfLoading: 'usnyc',
        portOfDischarge: 'cnsha',
      });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.portOfLoading).toBe('USNYC');
      expect(fixed.portOfDischarge).toBe('CNSHA');
      expect(fixes.filter(f => f.field === 'portOfLoading' || f.field === 'portOfDischarge').length).toBe(2);
    });

    it('should remove spaces from port codes', () => {
      const data = createMockData({ portOfLoading: 'US NYC' });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.portOfLoading).toBe('USNYC');
      expect(fixes.some(f => f.field === 'portOfLoading')).toBe(true);
    });

    it('should truncate port codes to 5 characters', () => {
      const data = createMockData({ portOfLoading: 'USNYCEXTRA' });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.portOfLoading).toBe('USNYC');
    });
  });

  describe('Date Format Auto-fix', () => {
    it('should convert MM/DD/YYYY to YYYY-MM-DD', () => {
      const data = createMockData({ cargoReadyDate: '12/25/2025' });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.cargoReadyDate).toBe('2025-12-25');
      expect(fixes.some(f => f.field === 'cargoReadyDate')).toBe(true);
    });

    it('should convert DD-MM-YYYY to YYYY-MM-DD', () => {
      const data = createMockData({ requestedShipDate: '25-12-2025' });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.requestedShipDate).toBe('2025-12-25');
      expect(fixes.some(f => f.field === 'requestedShipDate')).toBe(true);
    });

    it('should pad single-digit months and days', () => {
      const data = createMockData({ cargoReadyDate: '2025-1-5' });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.cargoReadyDate).toBe('2025-01-05');
      expect(fixes.some(f => f.field === 'cargoReadyDate')).toBe(true);
    });

    it('should not modify already correct dates', () => {
      const data = createMockData({ cargoReadyDate: '2025-12-25' });
      const { fixes } = autoFixer.fix(data);
      
      expect(fixes.some(f => f.field === 'cargoReadyDate')).toBe(false);
    });
  });

  describe('Phone Number Auto-fix', () => {
    it('should remove invalid characters', () => {
      const data = createMockData({ shipperContact: '+1-555-123-4567@ext123' });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.shipperContact).not.toContain('@');
      expect(fixes.some(f => f.field === 'shipperContact')).toBe(true);
    });

    it('should preserve valid phone characters', () => {
      const data = createMockData({ shipperContact: '+1 (555) 123-4567' });
      const { data: fixed } = autoFixer.fix(data);
      
      expect(fixed.shipperContact).toContain('+');
      expect(fixed.shipperContact).toContain('(');
      expect(fixed.shipperContact).toContain(')');
      expect(fixed.shipperContact).toContain('-');
    });
  });

  describe('Whitespace Trimming', () => {
    it('should trim leading and trailing whitespace', () => {
      const data = createMockData({ 
        shipperName: '  Acme Corporation  ',
        consigneeName: '  Global Logistics Inc  ',
      });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.shipperName).toBe('Acme Corporation');
      expect(fixed.consigneeName).toBe('Global Logistics Inc');
      expect(fixes.filter(f => 
        f.field === 'shipperName' || f.field === 'consigneeName'
      ).length).toBe(2);
    });

    it('should trim all string fields', () => {
      const data = createMockData({ 
        cargoDescription: '  Electronics  ',
        vesselName: '  Ocean Voyager  ',
      });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.cargoDescription).toBe('Electronics');
      expect(fixed.vesselName).toBe('Ocean Voyager');
      expect(fixes.length).toBeGreaterThan(0);
    });
  });

  describe('Multiple Fixes', () => {
    it('should apply multiple fixes to same record', () => {
      const data = createMockData({
        containerNumber: 'abcd 123 4567',
        bookingNumber: 'book 123456',
        portOfLoading: 'usnyc',
        shipperName: '  Acme Corp  ',
      });
      const { data: fixed, fixes } = autoFixer.fix(data);
      
      expect(fixed.containerNumber).toBe('ABCD1234567');
      expect(fixed.bookingNumber).toBe('BOOK123456');
      expect(fixed.portOfLoading).toBe('USNYC');
      expect(fixed.shipperName).toBe('Acme Corp');
      expect(fixes.length).toBeGreaterThan(3);
    });

    it('should track all fixes with reasons', () => {
      const data = createMockData({
        containerNumber: 'abcd1234567',
        bookingNumber: 'book123456',
      });
      const { fixes } = autoFixer.fix(data);
      
      fixes.forEach(fix => {
        expect(fix.field).toBeDefined();
        expect(fix.originalValue).toBeDefined();
        expect(fix.fixedValue).toBeDefined();
        expect(fix.reason).toBeDefined();
      });
    });
  });

  describe('No Changes Scenario', () => {
    it('should return empty fixes array when no changes needed', () => {
      const data = createMockData();
      const { fixes } = autoFixer.fix(data);
      
      // With properly formatted data, there should be no fixes
      expect(fixes.length).toBe(0);
    });

    it('should not modify data when no fixes needed', () => {
      const data = createMockData();
      const { data: fixed } = autoFixer.fix(data);
      
      expect(fixed.containerNumber).toBe(data.containerNumber);
      expect(fixed.bookingNumber).toBe(data.bookingNumber);
      expect(fixed.portOfLoading).toBe(data.portOfLoading);
    });
  });
});
