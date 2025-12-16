/**
 * IRIS API Types
 * Types for interacting with the IRIS shipping system API
 */

export interface IrisShippingInstruction {
  bookingNumber: string;
  shipper: IrisParty;
  consignee: IrisParty;
  cargo: IrisCargo;
  shipping: IrisShippingDetails;
  dates: IrisDates;
}

export interface IrisParty {
  name: string;
  address: string;
  contact: string;
}

export interface IrisCargo {
  description: string;
  containerNumber: string;
  weight: {
    value: number;
    unit: 'KG' | 'LBS';
  };
  volume: {
    value: number;
    unit: 'CBM' | 'CFT';
  };
}

export interface IrisShippingDetails {
  portOfLoading: string;
  portOfDischarge: string;
  vesselName?: string;
  voyageNumber?: string;
}

export interface IrisDates {
  cargoReady: string;
  requestedShipDate: string;
}

export interface IrisSubmissionRequest {
  shippingInstruction: IrisShippingInstruction;
  submittedBy: string;
  timestamp: string;
}

export interface IrisSubmissionResponse {
  success: boolean;
  referenceNumber: string;
  status: 'accepted' | 'rejected' | 'pending';
  message: string;
  timestamp: string;
  errors?: IrisError[];
}

export interface IrisError {
  code: string;
  field?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface IrisValidationResult {
  isValid: boolean;
  errors: IrisError[];
  warnings: IrisError[];
}
