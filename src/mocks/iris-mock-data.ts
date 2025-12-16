/**
 * Mock IRIS API Responses
 * Simulated responses for development and testing
 */

import { IrisSubmissionResponse } from '@/types/iris';
import { Submission, SubmissionResult } from '@/types/submission';

/**
 * Mock successful IRIS API submission response
 */
export const mockIrisSuccessResponse: IrisSubmissionResponse = {
  success: true,
  referenceNumber: 'IRIS-2025-12-16-A1B2C3',
  status: 'accepted',
  message: 'Shipping instruction accepted and queued for processing',
  timestamp: new Date().toISOString(),
};

/**
 * Mock IRIS API error response
 */
export const mockIrisErrorResponse: IrisSubmissionResponse = {
  success: false,
  referenceNumber: '',
  status: 'rejected',
  message: 'Validation failed',
  timestamp: new Date().toISOString(),
  errors: [
    {
      code: 'INVALID_PORT',
      field: 'portOfLoading',
      message: 'Port code not recognized',
      severity: 'error',
    },
  ],
};

/**
 * Mock submission record
 */
export const mockSubmission: Submission = {
  id: 'sub_123456',
  siDataId: 'si_abc123',
  userId: 'user_001',
  status: 'submitted',
  referenceNumber: 'IRIS-2025-12-16-A1B2C3',
  submittedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  retryCount: 0,
  irisResponse: mockIrisSuccessResponse,
};

/**
 * Simulate IRIS API submission (with artificial delay)
 */
export const simulateIrisSubmission = async (
  siDataId: string
): Promise<SubmissionResult> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate 90% success rate
  const isSuccess = Math.random() > 0.1;

  if (isSuccess) {
    return {
      success: true,
      submissionId: `sub_${Date.now()}`,
      referenceNumber: `IRIS-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      timestamp: new Date(),
    };
  } else {
    return {
      success: false,
      submissionId: `sub_${Date.now()}`,
      timestamp: new Date(),
      error: {
        code: 'IRIS_API_ERROR',
        message: 'Unable to process submission. Please try again.',
        details: {
          reason: 'Service temporarily unavailable',
        },
      },
    };
  }
};

/**
 * Mock submission steps for progress tracking
 */
export const mockSubmissionSteps = [
  { id: 'preparing', label: 'Preparing Data', status: 'completed' as const },
  { id: 'validating', label: 'Validating', status: 'completed' as const },
  { id: 'submitting', label: 'Submitting to IRIS', status: 'active' as const },
  { id: 'confirming', label: 'Confirming', status: 'pending' as const },
];
