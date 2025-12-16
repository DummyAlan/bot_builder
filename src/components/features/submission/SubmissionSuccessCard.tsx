/**
 * SubmissionSuccessCard Component
 * Display submission confirmation and reference number
 */

'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExtractedSIData } from '@/types/si-data';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export interface SubmissionSuccessCardProps {
  submissionId: string;
  referenceNumber: string;
  submittedAt: Date;
  siData: ExtractedSIData;
}

export const SubmissionSuccessCard = ({
  submissionId,
  referenceNumber,
  submittedAt,
  siData,
}: SubmissionSuccessCardProps) => {
  const router = useRouter();

  const handleNewSubmission = () => {
    router.push('/si/upload');
  };

  const handleDownload = () => {
    // Mock download functionality
    const dataStr = JSON.stringify(
      {
        submissionId,
        referenceNumber,
        submittedAt,
        siData,
      },
      null,
      2
    );
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SI-${referenceNumber}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleViewDetails = () => {
    router.push(`/si/details/${siData.id}`);
  };

  return (
    <div
      className="max-w-3xl mx-auto p-6"
      data-testid="submission-success-card"
    >
      <Card className="border-[#10B981] bg-gradient-to-br from-[#18181B] to-[#10B981]/5 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#10B981] rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-[#10B981] rounded-full p-6 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                <svg
                  className="w-16 h-16 text-[#FFFFFF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-testid="success-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div>
            <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2">
              Submission Successful!
            </h1>
            <p className="text-lg text-[#A1A1AA]">
              Your shipping instruction has been submitted to IRIS
            </p>
          </div>

          {/* Reference Number */}
          <div className="bg-[#27272A] rounded-lg p-6 border border-[#10B981]/30">
            <div className="text-sm text-[#A1A1AA] mb-2 font-medium">
              Reference Number
            </div>
            <div
              className="text-2xl font-bold text-[#10B981] font-mono tracking-wider"
              data-testid="reference-number"
            >
              {referenceNumber}
            </div>
            <div className="text-xs text-[#A1A1AA] mt-3">
              Submitted on {format(submittedAt, 'MMMM d, yyyy')} at{' '}
              {format(submittedAt, 'h:mm a')}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-[#27272A] rounded-lg p-4">
              <div className="text-xs text-[#A1A1AA] mb-1">Booking Number</div>
              <div className="text-sm font-semibold text-[#FFFFFF]">
                {siData.bookingNumber}
              </div>
            </div>
            <div className="bg-[#27272A] rounded-lg p-4">
              <div className="text-xs text-[#A1A1AA] mb-1">Container</div>
              <div className="text-sm font-semibold text-[#FFFFFF]">
                {siData.containerNumber}
              </div>
            </div>
            <div className="bg-[#27272A] rounded-lg p-4">
              <div className="text-xs text-[#A1A1AA] mb-1">Port of Loading</div>
              <div className="text-sm font-semibold text-[#FFFFFF]">
                {siData.portOfLoading}
              </div>
            </div>
            <div className="bg-[#27272A] rounded-lg p-4">
              <div className="text-xs text-[#A1A1AA] mb-1">
                Port of Discharge
              </div>
              <div className="text-sm font-semibold text-[#FFFFFF]">
                {siData.portOfDischarge}
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded-lg p-4 text-left">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-[#22D3EE] flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-[#A1A1AA]">
                Your submission is being processed by IRIS. You will receive a
                confirmation email shortly. Please save your reference number
                for tracking purposes.
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center pt-4">
            <Button
              variant="secondary"
              onClick={handleDownload}
              data-testid="download-button"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Receipt
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleViewDetails}
              data-testid="view-details-button"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View Details
            </Button>

            <Button
              variant="primary"
              onClick={handleNewSubmission}
              data-testid="new-submission-button"
              className="bg-[#22D3EE] hover:bg-[#22D3EE]/90"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Submission
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
