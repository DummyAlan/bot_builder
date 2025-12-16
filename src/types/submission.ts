/**
 * Submission Types
 * Defines types for SI data submission to IRIS API
 */

export type SubmissionStatus = 
  | 'draft' 
  | 'validating' 
  | 'submitting' 
  | 'submitted' 
  | 'failed';

export type SubmissionStep = 
  | 'preparing' 
  | 'validating' 
  | 'submitting' 
  | 'confirming';

export interface Submission {
  id: string;
  siDataId: string;
  userId: string;
  status: SubmissionStatus;
  referenceNumber?: string;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  errorMessage?: string;
  retryCount: number;
  irisResponse?: IrisSubmissionResponse;
}

export interface SubmissionResult {
  success: boolean;
  submissionId: string;
  referenceNumber?: string;
  timestamp: Date;
  error?: SubmissionError;
}

export interface SubmissionError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface SubmissionProgress {
  currentStep: SubmissionStep;
  stepIndex: number;
  totalSteps: number;
  message: string;
}

export interface IrisSubmissionResponse {
  referenceNumber: string;
  status: string;
  message: string;
  timestamp: string;
}

export interface ConfirmationData {
  siDataId: string;
  totalFields: number;
  validationStatus: 'valid' | 'warning';
  estimatedProcessingTime: string;
}
