export interface ExtractedSIData {
  id: string;
  fileName: string;
  uploadedAt: Date;
  status: 'pending' | 'extracted' | 'validated' | 'submitted';
  
  // Shipper Information
  shipperName: string;
  shipperAddress: string;
  shipperContact: string;
  
  // Consignee Information
  consigneeName: string;
  consigneeAddress: string;
  consigneeContact: string;
  
  // Cargo Details
  cargoDescription: string;
  containerNumber: string;
  weight: number;
  weightUnit: 'KG' | 'LBS';
  volume: number;
  volumeUnit: 'CBM' | 'CFT';
  
  // Shipping Details
  portOfLoading: string;
  portOfDischarge: string;
  vesselName?: string;
  voyageNumber?: string;
  bookingNumber: string;
  
  // Dates
  cargoReadyDate: string;
  requestedShipDate: string;
  
  // Validation metadata
  validationResult?: {
    isValid: boolean;
    validatedAt: string;
    autoFixesApplied: number;
  };
}

export interface UploadResponse {
  success: boolean;
  data?: ExtractedSIData;
  error?: string;
}

export interface ExtractionProgress {
  stage: 'uploading' | 'parsing' | 'extracting' | 'validating' | 'complete';
  progress: number;
  message: string;
}
