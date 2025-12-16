// Validation rule definitions for Shipping Instruction fields

export const VALIDATION_RULES = {
  // Contact validation
  phone: {
    pattern: /^[\d\s\-+()]+$/,
    minLength: 10,
    maxLength: 20,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  
  // Container number validation (ISO 6346 format)
  containerNumber: {
    pattern: /^[A-Z]{4}\d{7}$/,
    examples: ['ABCD1234567'],
  },
  
  // Booking number
  bookingNumber: {
    pattern: /^[A-Z0-9]{6,20}$/,
    minLength: 6,
    maxLength: 20,
  },
  
  // Date validation
  date: {
    format: 'YYYY-MM-DD',
    futureOnly: true,
  },
  
  // Weight and volume
  weight: {
    min: 0,
    max: 100000,
  },
  volume: {
    min: 0,
    max: 10000,
  },
  
  // Text fields
  name: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-.']+$/,
  },
  address: {
    minLength: 10,
    maxLength: 500,
  },
  description: {
    minLength: 5,
    maxLength: 1000,
  },
  
  // Port codes (UN/LOCODE format)
  port: {
    pattern: /^[A-Z]{5}$/,
    examples: ['USNYC', 'CNSHA'],
  },
} as const;

export const ERROR_MESSAGES = {
  required: (field: string) => `${field} is required`,
  invalidFormat: (field: string, format: string) => `${field} must be in ${format} format`,
  minLength: (field: string, length: number) => `${field} must be at least ${length} characters`,
  maxLength: (field: string, length: number) => `${field} must not exceed ${length} characters`,
  minValue: (field: string, value: number) => `${field} must be at least ${value}`,
  maxValue: (field: string, value: number) => `${field} must not exceed ${value}`,
  invalidPhone: 'Invalid phone number format',
  invalidEmail: 'Invalid email address',
  invalidDate: 'Invalid date format (use YYYY-MM-DD)',
  pastDate: 'Date must be in the future',
  invalidContainer: 'Invalid container number (format: 4 letters + 7 digits)',
  invalidPort: 'Invalid port code (use 5-letter UN/LOCODE)',
} as const;
