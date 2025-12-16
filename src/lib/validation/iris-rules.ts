import { ExtractedSIData } from '@/types/si-data';
import { ValidationResult } from '@/types/validation';
import { SIValidator } from './si-validators';
import { AutoFixer } from './auto-fix';

/**
 * IRIS API validation requirements
 * These are additional rules specific to IRIS API submission
 */
export class IRISValidator {
  private validator = new SIValidator();
  private autoFixer = new AutoFixer();
  
  /**
   * Validate SI data against IRIS API requirements and apply auto-fixes
   */
  async validateForIRIS(data: ExtractedSIData): Promise<ValidationResult> {
    // Step 1: Apply auto-fixes
    const { data: fixedData, fixes } = this.autoFixer.fix(data);
    
    // Step 2: Validate the fixed data
    const issues = this.validator.validate(fixedData);
    
    // Step 3: Calculate metadata
    const totalFields = this.getTotalFieldCount(fixedData);
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const autoFixedCount = fixes.length;
    
    const validFields = totalFields - errorCount;
    const invalidFields = errorCount;
    const warningFields = warningCount;
    
    const isValid = errorCount === 0;
    
    return {
      isValid,
      issues,
      autoFixes: fixes,
      metadata: {
        totalFields,
        validFields,
        invalidFields,
        warningFields,
        autoFixedFields: autoFixedCount,
      },
    };
  }
  
  private getTotalFieldCount(data: ExtractedSIData): number {
    // Count non-null fields
    const fields: Array<keyof ExtractedSIData> = [
      'shipperName', 'shipperAddress', 'shipperContact',
      'consigneeName', 'consigneeAddress', 'consigneeContact',
      'cargoDescription', 'containerNumber', 'bookingNumber',
      'portOfLoading', 'portOfDischarge', 'vesselName', 'voyageNumber',
      'cargoReadyDate', 'requestedShipDate',
      'weight', 'volume',
    ];
    
    return fields.filter(field => {
      const value = data[field];
      return value !== undefined && value !== null && value !== '';
    }).length;
  }
}

export const irisValidator = new IRISValidator();
