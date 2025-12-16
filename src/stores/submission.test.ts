/**
 * Submission Store Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSubmissionStore } from './submission';
import { act, renderHook } from '@testing-library/react';

// Mock the IRIS simulation
vi.mock('@/mocks/iris-mock-data', () => ({
  simulateIrisSubmission: vi.fn(),
}));

import { simulateIrisSubmission } from '@/mocks/iris-mock-data';

describe('useSubmissionStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useSubmissionStore());
    act(() => {
      result.current.clearSubmission();
    });
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useSubmissionStore());

    expect(result.current.currentSubmission).toBeNull();
    expect(result.current.submissionResult).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.progress).toBeNull();
    expect(result.current.isConfirmationOpen).toBe(false);
    expect(result.current.confirmationData).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('opens confirmation dialog', () => {
    const { result } = renderHook(() => useSubmissionStore());

    act(() => {
      result.current.openConfirmation('si_123', 17);
    });

    expect(result.current.isConfirmationOpen).toBe(true);
    expect(result.current.confirmationData).toEqual({
      siDataId: 'si_123',
      totalFields: 17,
    });
    expect(result.current.error).toBeNull();
  });

  it('closes confirmation dialog', () => {
    const { result } = renderHook(() => useSubmissionStore());

    act(() => {
      result.current.openConfirmation('si_123', 17);
    });

    expect(result.current.isConfirmationOpen).toBe(true);

    act(() => {
      result.current.closeConfirmation();
    });

    expect(result.current.isConfirmationOpen).toBe(false);
    expect(result.current.confirmationData).toBeNull();
  });

  it('submits to IRIS successfully', async () => {
    vi.mocked(simulateIrisSubmission).mockResolvedValue({
      success: true,
      submissionId: 'sub_123',
      referenceNumber: 'IRIS-2025-12-16-ABC123',
      timestamp: new Date(),
    });

    const { result } = renderHook(() => useSubmissionStore());

    await act(async () => {
      const submissionResult = await result.current.submitToIRIS('si_123', 'user_001');
      expect(submissionResult.success).toBe(true);
    });

    expect(result.current.currentSubmission).not.toBeNull();
    expect(result.current.currentSubmission?.status).toBe('submitted');
    expect(result.current.currentSubmission?.referenceNumber).toBe('IRIS-2025-12-16-ABC123');
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isConfirmationOpen).toBe(false);
  });

  it('handles submission failure', async () => {
    vi.mocked(simulateIrisSubmission).mockResolvedValue({
      success: false,
      submissionId: 'sub_123',
      timestamp: new Date(),
      error: {
        code: 'IRIS_API_ERROR',
        message: 'Service temporarily unavailable',
      },
    });

    const { result } = renderHook(() => useSubmissionStore());

    await act(async () => {
      const submissionResult = await result.current.submitToIRIS('si_123', 'user_001');
      expect(submissionResult.success).toBe(false);
    });

    expect(result.current.error).toBe('Service temporarily unavailable');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('updates progress during submission', () => {
    const { result } = renderHook(() => useSubmissionStore());

    act(() => {
      result.current.updateProgress('preparing', 'Preparing data...');
    });

    expect(result.current.progress).toEqual({
      currentStep: 'preparing',
      stepIndex: 0,
      totalSteps: 4,
      message: 'Preparing data...',
    });

    act(() => {
      result.current.updateProgress('validating', 'Validating...');
    });

    expect(result.current.progress).toEqual({
      currentStep: 'validating',
      stepIndex: 1,
      totalSteps: 4,
      message: 'Validating...',
    });
  });

  it('clears submission state', async () => {
    vi.mocked(simulateIrisSubmission).mockResolvedValue({
      success: true,
      submissionId: 'sub_123',
      referenceNumber: 'IRIS-2025-12-16-ABC123',
      timestamp: new Date(),
    });

    const { result } = renderHook(() => useSubmissionStore());

    await act(async () => {
      await result.current.submitToIRIS('si_123', 'user_001');
    });

    expect(result.current.currentSubmission).not.toBeNull();

    act(() => {
      result.current.clearSubmission();
    });

    expect(result.current.currentSubmission).toBeNull();
    expect(result.current.submissionResult).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.progress).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('sets error message', () => {
    const { result } = renderHook(() => useSubmissionStore());

    act(() => {
      result.current.setError('Test error message');
    });

    expect(result.current.error).toBe('Test error message');

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBeNull();
  });
});
