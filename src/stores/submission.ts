/**
 * Submission Store
 * Zustand store for managing submission state
 */

import { create } from 'zustand';
import {
  Submission,
  SubmissionProgress,
  SubmissionResult,
  SubmissionStep,
} from '@/types/submission';
import { simulateIrisSubmission } from '@/mocks/iris-mock-data';

interface SubmissionState {
  // Current submission
  currentSubmission: Submission | null;
  submissionResult: SubmissionResult | null;
  
  // Progress tracking
  isSubmitting: boolean;
  progress: SubmissionProgress | null;
  
  // Confirmation dialog
  isConfirmationOpen: boolean;
  confirmationData: {
    siDataId: string;
    totalFields: number;
  } | null;
  
  // Error state
  error: string | null;
  
  // Actions
  openConfirmation: (siDataId: string, totalFields: number) => void;
  closeConfirmation: () => void;
  submitToIRIS: (siDataId: string, userId: string) => Promise<SubmissionResult>;
  updateProgress: (step: SubmissionStep, message: string) => void;
  clearSubmission: () => void;
  setError: (error: string | null) => void;
}

const submissionSteps: SubmissionStep[] = [
  'preparing',
  'validating',
  'submitting',
  'confirming',
];

export const useSubmissionStore = create<SubmissionState>((set, get) => ({
  // Initial state
  currentSubmission: null,
  submissionResult: null,
  isSubmitting: false,
  progress: null,
  isConfirmationOpen: false,
  confirmationData: null,
  error: null,

  // Open confirmation dialog
  openConfirmation: (siDataId: string, totalFields: number) => {
    set({
      isConfirmationOpen: true,
      confirmationData: { siDataId, totalFields },
      error: null,
    });
  },

  // Close confirmation dialog
  closeConfirmation: () => {
    set({
      isConfirmationOpen: false,
      confirmationData: null,
    });
  },

  // Submit to IRIS API (mock implementation)
  submitToIRIS: async (siDataId: string, userId: string) => {
    set({ isSubmitting: true, error: null });

    try {
      // Step 1: Preparing
      get().updateProgress('preparing', 'Preparing data for submission...');
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 2: Validating
      get().updateProgress('validating', 'Running final validation checks...');
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 3: Submitting
      get().updateProgress('submitting', 'Submitting to IRIS API...');
      const result = await simulateIrisSubmission(siDataId);

      if (!result.success) {
        throw new Error(result.error?.message || 'Submission failed');
      }

      // Step 4: Confirming
      get().updateProgress('confirming', 'Confirming submission...');
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create submission record
      const submission: Submission = {
        id: result.submissionId,
        siDataId,
        userId,
        status: 'submitted',
        referenceNumber: result.referenceNumber,
        submittedAt: result.timestamp,
        createdAt: new Date(),
        updatedAt: new Date(),
        retryCount: 0,
      };

      set({
        currentSubmission: submission,
        submissionResult: result,
        isSubmitting: false,
        isConfirmationOpen: false,
        progress: null,
      });

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      
      const failedResult: SubmissionResult = {
        success: false,
        submissionId: `sub_${Date.now()}`,
        timestamp: new Date(),
        error: {
          code: 'SUBMISSION_FAILED',
          message: errorMessage,
        },
      };

      set({
        error: errorMessage,
        isSubmitting: false,
        submissionResult: failedResult,
        progress: null,
      });

      return failedResult;
    }
  },

  // Update progress
  updateProgress: (step: SubmissionStep, message: string) => {
    const stepIndex = submissionSteps.indexOf(step);
    set({
      progress: {
        currentStep: step,
        stepIndex,
        totalSteps: submissionSteps.length,
        message,
      },
    });
  },

  // Clear submission state
  clearSubmission: () => {
    set({
      currentSubmission: null,
      submissionResult: null,
      isSubmitting: false,
      progress: null,
      error: null,
    });
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },
}));
