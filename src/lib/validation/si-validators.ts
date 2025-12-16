import { ExtractedSIData } from '@/types/si-data';
import { ValidationIssue, ValidationSeverity } from '@/types/validation';
import { VALIDATION_RULES, ERROR_MESSAGES } from '@/lib/constants/validation-rules';
import { isValid as isDateValid, isFuture, parse } from 'date-fns';

/**
 * Field-level validators for Shipping Instruction data
 */
export class SIValidator {
  private issues: ValidationIssue[] = [];

  validate(data: ExtractedSIData): ValidationIssue[] {
    this.issues = [];
    
    // Validate required fields
    this.validateRequired(data);
    
    // Validate formats
    this.validateContainerNumber(data.containerNumber);
    this.validateBookingNumber(data.bookingNumber);
    this.validatePortCodes(data.portOfLoading, data.portOfDischarge);
    this.validateDates(data.cargoReadyDate, data.requestedShipDate);
    this.validateContacts(data.shipperContact, data.consigneeContact);
    this.validateWeightAndVolume(data.weight, data.volume);
    this.validateNames(data.shipperName, data.consigneeName);
    this.validateAddresses(data.shipperAddress, data.consigneeAddress);
    this.validateDescription(data.cargoDescription);
    
    return this.issues;
  }
  
  private addIssue(
    field: string,
    severity: ValidationSeverity,
    message: string,
    code: string,
    suggestion?: string
  ): void {
    this.issues.push({ field, severity, message, code, suggestion });
  }
  
  private validateRequired(data: ExtractedSIData): void {
    const requiredFields: Array<keyof ExtractedSIData> = [
      'shipperName', 'shipperAddress', 'shipperContact',
      'consigneeName', 'consigneeAddress', 'consigneeContact',
      'cargoDescription', 'containerNumber', 'bookingNumber',
      'portOfLoading', 'portOfDischarge',
      'cargoReadyDate', 'requestedShipDate',
      'weight', 'volume',
    ];
    
    for (const field of requiredFields) {
      const value = data[field];
      if (value === undefined || value === null || value === '') {
        this.addIssue(
          field,
          'error',
          ERROR_MESSAGES.required(this.formatFieldName(field)),
          'REQUIRED_FIELD'
        );
      }
    }
  }
  
  private validateContainerNumber(value: string): void {
    if (!value) return;
    
    const { pattern } = VALIDATION_RULES.containerNumber;
    if (!pattern.test(value)) {
      this.addIssue(
        'containerNumber',
        'error',
        ERROR_MESSAGES.invalidContainer,
        'INVALID_FORMAT',
        'Example: ABCD1234567 (4 letters + 7 digits)'
      );
    }
  }
  
  private validateBookingNumber(value: string): void {
    if (!value) return;
    
    const { pattern, minLength, maxLength } = VALIDATION_RULES.bookingNumber;
    
    if (value.length < minLength || value.length > maxLength) {
      this.addIssue(
        'bookingNumber',
        'error',
        `Booking number must be between ${minLength} and ${maxLength} characters`,
        'INVALID_LENGTH'
      );
    }
    
    if (!pattern.test(value)) {
      this.addIssue(
        'bookingNumber',
        'error',
        'Booking number must contain only letters and numbers',
        'INVALID_FORMAT'
      );
    }
  }
  
  private validatePortCodes(loading: string, discharge: string): void {
    const { pattern } = VALIDATION_RULES.port;
    
    if (loading && !pattern.test(loading)) {
      this.addIssue(
        'portOfLoading',
        'error',
        ERROR_MESSAGES.invalidPort,
        'INVALID_FORMAT',
        'Example: USNYC (5-letter code)'
      );
    }
    
    if (discharge && !pattern.test(discharge)) {
      this.addIssue(
        'portOfDischarge',
        'error',
        ERROR_MESSAGES.invalidPort,
        'INVALID_FORMAT',
        'Example: CNSHA (5-letter code)'
      );
    }
    
    if (loading && discharge && loading === discharge) {
      this.addIssue(
        'portOfDischarge',
        'warning',
        'Port of loading and discharge are the same',
        'SAME_PORTS',
        'Verify this is correct'
      );
    }
  }
  
  private validateDates(cargoReady: string, shipDate: string): void {
    if (!cargoReady && !shipDate) return;
    
    // Validate cargo ready date
    if (cargoReady) {
      const cargoDate = this.parseDate(cargoReady);
      if (!cargoDate) {
        this.addIssue(
          'cargoReadyDate',
          'error',
          ERROR_MESSAGES.invalidDate,
          'INVALID_DATE',
          'Use format: YYYY-MM-DD'
        );
      } else if (!isFuture(cargoDate)) {
        this.addIssue(
          'cargoReadyDate',
          'warning',
          ERROR_MESSAGES.pastDate,
          'PAST_DATE',
          'Verify the date is correct'
        );
      }
    }
    
    // Validate ship date
    if (shipDate) {
      const ship = this.parseDate(shipDate);
      if (!ship) {
        this.addIssue(
          'requestedShipDate',
          'error',
          ERROR_MESSAGES.invalidDate,
          'INVALID_DATE',
          'Use format: YYYY-MM-DD'
        );
      } else if (!isFuture(ship)) {
        this.addIssue(
          'requestedShipDate',
          'warning',
          ERROR_MESSAGES.pastDate,
          'PAST_DATE',
          'Verify the date is correct'
        );
      }
    }
    
    // Compare dates
    if (cargoReady && shipDate) {
      const cargoDate = this.parseDate(cargoReady);
      const ship = this.parseDate(shipDate);
      if (cargoDate && ship && ship < cargoDate) {
        this.addIssue(
          'requestedShipDate',
          'error',
          'Requested ship date must be after cargo ready date',
          'INVALID_DATE_ORDER'
        );
      }
    }
  }
  
  private validateContacts(shipper: string, consignee: string): void {
    if (shipper && !this.isValidContact(shipper)) {
      this.addIssue(
        'shipperContact',
        'warning',
        'Contact format may be invalid',
        'INVALID_CONTACT',
        'Should be phone number or email'
      );
    }
    
    if (consignee && !this.isValidContact(consignee)) {
      this.addIssue(
        'consigneeContact',
        'warning',
        'Contact format may be invalid',
        'INVALID_CONTACT',
        'Should be phone number or email'
      );
    }
  }
  
  private validateWeightAndVolume(weight: number, volume: number): void {
    const { min: weightMin, max: weightMax } = VALIDATION_RULES.weight;
    const { min: volumeMin, max: volumeMax } = VALIDATION_RULES.volume;
    
    if (weight !== undefined && weight !== null) {
      if (weight < weightMin) {
        this.addIssue('weight', 'error', ERROR_MESSAGES.minValue('Weight', weightMin), 'OUT_OF_RANGE');
      }
      if (weight > weightMax) {
        this.addIssue('weight', 'warning', 'Weight seems unusually high', 'OUT_OF_RANGE', 'Verify the weight value');
      }
    }
    
    if (volume !== undefined && volume !== null) {
      if (volume < volumeMin) {
        this.addIssue('volume', 'error', ERROR_MESSAGES.minValue('Volume', volumeMin), 'OUT_OF_RANGE');
      }
      if (volume > volumeMax) {
        this.addIssue('volume', 'warning', 'Volume seems unusually high', 'OUT_OF_RANGE', 'Verify the volume value');
      }
    }
  }
  
  private validateNames(shipper: string, consignee: string): void {
    const { minLength, maxLength } = VALIDATION_RULES.name;
    
    if (shipper && shipper.length < minLength) {
      this.addIssue('shipperName', 'error', ERROR_MESSAGES.minLength('Shipper name', minLength), 'TOO_SHORT');
    }
    if (shipper && shipper.length > maxLength) {
      this.addIssue('shipperName', 'error', ERROR_MESSAGES.maxLength('Shipper name', maxLength), 'TOO_LONG');
    }
    
    if (consignee && consignee.length < minLength) {
      this.addIssue('consigneeName', 'error', ERROR_MESSAGES.minLength('Consignee name', minLength), 'TOO_SHORT');
    }
    if (consignee && consignee.length > maxLength) {
      this.addIssue('consigneeName', 'error', ERROR_MESSAGES.maxLength('Consignee name', maxLength), 'TOO_LONG');
    }
  }
  
  private validateAddresses(shipper: string, consignee: string): void {
    const { minLength, maxLength } = VALIDATION_RULES.address;
    
    if (shipper && shipper.length < minLength) {
      this.addIssue('shipperAddress', 'error', ERROR_MESSAGES.minLength('Shipper address', minLength), 'TOO_SHORT');
    }
    if (shipper && shipper.length > maxLength) {
      this.addIssue('shipperAddress', 'error', ERROR_MESSAGES.maxLength('Shipper address', maxLength), 'TOO_LONG');
    }
    
    if (consignee && consignee.length < minLength) {
      this.addIssue('consigneeAddress', 'error', ERROR_MESSAGES.minLength('Consignee address', minLength), 'TOO_SHORT');
    }
    if (consignee && consignee.length > maxLength) {
      this.addIssue('consigneeAddress', 'error', ERROR_MESSAGES.maxLength('Consignee address', maxLength), 'TOO_LONG');
    }
  }
  
  private validateDescription(value: string): void {
    if (!value) return;
    
    const { minLength, maxLength } = VALIDATION_RULES.description;
    
    if (value.length < minLength) {
      this.addIssue('cargoDescription', 'error', ERROR_MESSAGES.minLength('Cargo description', minLength), 'TOO_SHORT');
    }
    if (value.length > maxLength) {
      this.addIssue('cargoDescription', 'error', ERROR_MESSAGES.maxLength('Cargo description', maxLength), 'TOO_LONG');
    }
  }
  
  private isValidContact(value: string): boolean {
    const { pattern: phonePattern } = VALIDATION_RULES.phone;
    const { pattern: emailPattern } = VALIDATION_RULES.email;
    
    return phonePattern.test(value) || emailPattern.test(value);
  }
  
  private parseDate(dateString: string): Date | null {
    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      return isDateValid(date) ? date : null;
    } catch {
      return null;
    }
  }
  
  private formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
}

export const siValidator = new SIValidator();
