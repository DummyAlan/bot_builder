import { ExtractedSIData } from '@/types/si-data';
import { AutoFixResult } from '@/types/validation';

/**
 * Auto-fix common data quality issues in extracted SI data
 */
export class AutoFixer {
  private fixes: AutoFixResult[] = [];

  /**
   * Apply all auto-fixes to the SI data
   */
  fix(data: ExtractedSIData): { data: ExtractedSIData; fixes: AutoFixResult[] } {
    this.fixes = [];
    
    const fixedData = { ...data };
    
    // Fix container number format
    if (fixedData.containerNumber) {
      const fixed = this.fixContainerNumber(fixedData.containerNumber);
      if (fixed !== fixedData.containerNumber) {
        this.addFix('containerNumber', fixedData.containerNumber, fixed, 
          'Converted to uppercase and removed spaces');
        fixedData.containerNumber = fixed;
      }
    }
    
    // Fix booking number format
    if (fixedData.bookingNumber) {
      const fixed = this.fixBookingNumber(fixedData.bookingNumber);
      if (fixed !== fixedData.bookingNumber) {
        this.addFix('bookingNumber', fixedData.bookingNumber, fixed,
          'Converted to uppercase and removed spaces');
        fixedData.bookingNumber = fixed;
      }
    }
    
    // Fix port codes
    if (fixedData.portOfLoading) {
      const fixed = this.fixPortCode(fixedData.portOfLoading);
      if (fixed !== fixedData.portOfLoading) {
        this.addFix('portOfLoading', fixedData.portOfLoading, fixed,
          'Converted to uppercase UN/LOCODE format');
        fixedData.portOfLoading = fixed;
      }
    }
    
    if (fixedData.portOfDischarge) {
      const fixed = this.fixPortCode(fixedData.portOfDischarge);
      if (fixed !== fixedData.portOfDischarge) {
        this.addFix('portOfDischarge', fixedData.portOfDischarge, fixed,
          'Converted to uppercase UN/LOCODE format');
        fixedData.portOfDischarge = fixed;
      }
    }
    
    // Fix date formats
    if (fixedData.cargoReadyDate) {
      const fixed = this.fixDateFormat(fixedData.cargoReadyDate);
      if (fixed !== fixedData.cargoReadyDate) {
        this.addFix('cargoReadyDate', fixedData.cargoReadyDate, fixed,
          'Standardized to YYYY-MM-DD format');
        fixedData.cargoReadyDate = fixed;
      }
    }
    
    if (fixedData.requestedShipDate) {
      const fixed = this.fixDateFormat(fixedData.requestedShipDate);
      if (fixed !== fixedData.requestedShipDate) {
        this.addFix('requestedShipDate', fixedData.requestedShipDate, fixed,
          'Standardized to YYYY-MM-DD format');
        fixedData.requestedShipDate = fixed;
      }
    }
    
    // Trim all string fields
    this.trimStringFields(fixedData);
    
    // Fix phone numbers
    if (fixedData.shipperContact) {
      const fixed = this.fixPhoneNumber(fixedData.shipperContact);
      if (fixed !== fixedData.shipperContact) {
        this.addFix('shipperContact', fixedData.shipperContact, fixed,
          'Standardized phone number format');
        fixedData.shipperContact = fixed;
      }
    }
    
    if (fixedData.consigneeContact) {
      const fixed = this.fixPhoneNumber(fixedData.consigneeContact);
      if (fixed !== fixedData.consigneeContact) {
        this.addFix('consigneeContact', fixedData.consigneeContact, fixed,
          'Standardized phone number format');
        fixedData.consigneeContact = fixed;
      }
    }
    
    return { data: fixedData, fixes: this.fixes };
  }
  
  private addFix(field: string, original: string, fixed: string, reason: string): void {
    this.fixes.push({
      field,
      originalValue: original,
      fixedValue: fixed,
      reason,
    });
  }
  
  private fixContainerNumber(value: string): string {
    // Remove spaces and convert to uppercase
    return value.replace(/\s/g, '').toUpperCase();
  }
  
  private fixBookingNumber(value: string): string {
    // Remove spaces and convert to uppercase
    return value.replace(/\s/g, '').toUpperCase();
  }
  
  private fixPortCode(value: string): string {
    // Convert to uppercase and remove spaces
    return value.replace(/\s/g, '').toUpperCase().slice(0, 5);
  }
  
  private fixDateFormat(value: string): string {
    // Try to parse various date formats and convert to YYYY-MM-DD
    const datePatterns = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY or DD/MM/YYYY
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY or MM-DD-YYYY
    ];
    
    for (const pattern of datePatterns) {
      const match = value.match(pattern);
      if (match) {
        if (pattern === datePatterns[1]) {
          // Already in correct format, just ensure padding
          const [, year, month, day] = match;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else if (pattern === datePatterns[0]) {
          // Assume MM/DD/YYYY format
          const [, month, day, year] = match;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else {
          // DD-MM-YYYY format
          const [, day, month, year] = match;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
    }
    
    return value; // Return original if no pattern matches
  }
  
  private fixPhoneNumber(value: string): string {
    // Remove all non-digit characters except + and spaces
    return value.replace(/[^\d\s+()-]/g, '').trim();
  }
  
  private trimStringFields(data: ExtractedSIData): void {
    // Trim all string fields
    const stringFields = [
      'shipperName', 'shipperAddress', 'shipperContact',
      'consigneeName', 'consigneeAddress', 'consigneeContact',
      'cargoDescription', 'containerNumber', 'bookingNumber',
      'portOfLoading', 'portOfDischarge', 'vesselName', 'voyageNumber',
    ] as const;
    
    for (const field of stringFields) {
      if (typeof data[field] === 'string') {
        const original = data[field] as string;
        const trimmed = original.trim();
        if (trimmed !== original) {
          this.addFix(field, original, trimmed, 'Removed leading/trailing whitespace');
          (data[field] as string) = trimmed;
        }
      }
    }
  }
}

export const autoFixer = new AutoFixer();
