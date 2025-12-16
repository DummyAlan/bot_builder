/**
 * Submission Success Page
 * Displays confirmation after successful submission
 */

'use client';

import { SubmissionSuccessCard } from '@/components/features/submission/SubmissionSuccessCard';
import { useSubmissionStore } from '@/stores/submission';
import { mockSIData } from '@/mocks/si-mock-data';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SubmissionProgressTracker } from '@/components/features/submission/SubmissionProgressTracker';

interface PageProps {
  params: {
    submissionId: string;
  };
}

export default function SuccessPage({ params }: PageProps) {
  const { submissionId } = params;
  const router = useRouter();
  const { currentSubmission, submissionResult, isSubmitting, progress } =
    useSubmissionStore();

  useEffect(() => {
    // If no submission result, redirect to upload
    if (!isSubmitting && !submissionResult) {
      router.push('/si/upload');
    }
  }, [isSubmitting, submissionResult, router]);

  // Show progress tracker while submitting
  if (isSubmitting && progress) {
    const steps = [
      {
        id: 'preparing',
        label: 'Preparing Data',
        status:
          progress.stepIndex > 0
            ? ('completed' as const)
            : progress.currentStep === 'preparing'
            ? ('active' as const)
            : ('pending' as const),
      },
      {
        id: 'validating',
        label: 'Validating',
        status:
          progress.stepIndex > 1
            ? ('completed' as const)
            : progress.currentStep === 'validating'
            ? ('active' as const)
            : ('pending' as const),
      },
      {
        id: 'submitting',
        label: 'Submitting to IRIS',
        status:
          progress.stepIndex > 2
            ? ('completed' as const)
            : progress.currentStep === 'submitting'
            ? ('active' as const)
            : ('pending' as const),
      },
      {
        id: 'confirming',
        label: 'Confirming',
        status:
          progress.stepIndex > 3
            ? ('completed' as const)
            : progress.currentStep === 'confirming'
            ? ('active' as const)
            : ('pending' as const),
      },
    ];

    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6">
        <div className="max-w-3xl w-full">
          <div className="bg-[#18181B] rounded-lg p-8 border border-[#52525B]">
            <h1 className="text-2xl font-bold text-[#FFFFFF] text-center mb-2">
              Submitting to IRIS
            </h1>
            <p className="text-[#A1A1AA] text-center mb-8">
              {progress.message}
            </p>
            <SubmissionProgressTracker
              steps={steps}
              currentStep={progress.stepIndex}
              status="in-progress"
            />
          </div>
        </div>
      </div>
    );
  }

  // Show success card if submission completed
  if (submissionResult && submissionResult.success) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6">
        <SubmissionSuccessCard
          submissionId={submissionId}
          referenceNumber={
            submissionResult.referenceNumber || 'IRIS-2025-12-16-UNKNOWN'
          }
          submittedAt={submissionResult.timestamp}
          siData={mockSIData}
        />
      </div>
    );
  }

  // Show error state
  if (submissionResult && !submissionResult.success) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-[#18181B] rounded-lg p-8 border border-[#EF4444]">
            <div className="flex justify-center mb-6">
              <div className="bg-[#EF4444] rounded-full p-6">
                <svg
                  className="w-16 h-16 text-[#FFFFFF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#FFFFFF] text-center mb-2">
              Submission Failed
            </h1>
            <p className="text-lg text-[#A1A1AA] text-center mb-6">
              {submissionResult.error?.message ||
                'An error occurred during submission'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push(`/si/review/${mockSIData.id}`)}
                className="px-6 py-3 bg-[#22D3EE] text-[#FFFFFF] rounded-lg font-semibold hover:bg-[#22D3EE]/90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/si/upload')}
                className="px-6 py-3 bg-[#27272A] text-[#FFFFFF] rounded-lg font-semibold hover:bg-[#3F3F46] transition-colors"
              >
                Back to Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22D3EE] mx-auto mb-4" />
        <p className="text-[#A1A1AA]">Loading...</p>
      </div>
    </div>
  );
}
