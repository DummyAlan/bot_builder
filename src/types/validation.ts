export type ValidationSeverity = 'error' | 'warning' | 'info';
export type ValidationStatus = 'valid' | 'invalid' | 'warning' | 'auto-fixed';

export interface ValidationIssue {
  field: string;
  severity: ValidationSeverity;
  message: string;
  code: string;
  suggestion?: string;
}

export interface AutoFixResult {
  field: string;
  originalValue: string;
  fixedValue: string;
  reason: string;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  autoFixes: AutoFixResult[];
  metadata: {
    totalFields: number;
    validFields: number;
    invalidFields: number;
    warningFields: number;
    autoFixedFields: number;
  };
}

export interface FieldValidation {
  status: ValidationStatus;
  issues: ValidationIssue[];
  suggestion?: string;
}
