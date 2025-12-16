/**
 * SubmissionReviewPanel Component
 * Comprehensive review interface before submission
 */

'use client';

import { ExtractedSIData } from '@/types/si-data';
import { ValidationResult } from '@/types/validation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ValidationSummaryCard } from '@/components/features/validation/ValidationSummaryCard';
import { DataSummaryTable } from './DataSummaryTable';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useSubmissionStore } from '@/stores/submission';
import { useRouter } from 'next/navigation';

export interface SubmissionReviewPanelProps {
  siData: ExtractedSIData;
  validationResult: ValidationResult;
  showEditButton?: boolean;
}

export const SubmissionReviewPanel = ({
  siData,
  validationResult,
  showEditButton = true,
}: SubmissionReviewPanelProps) => {
  const router = useRouter();
  const {
    isConfirmationOpen,
    isSubmitting,
    openConfirmation,
    closeConfirmation,
    submitToIRIS,
  } = useSubmissionStore();

  const handleEditClick = () => {
    router.push(`/si/edit/${siData.id}`);
  };

  const handleSubmitClick = () => {
    openConfirmation(siData.id, 17); // Total fields count
  };

  const handleConfirmSubmit = async () => {
    const result = await submitToIRIS(siData.id, 'user_001'); // Mock user ID
    
    if (result.success) {
      // Navigate to success page
      router.push(`/si/success/${result.submissionId}`);
    }
  };

  const canSubmit = validationResult.isValid || validationResult.issues.every(
    (issue) => issue.severity !== 'error'
  );

  return (
    <div
      className="max-w-4xl mx-auto p-6 space-y-8"
      data-testid="submission-review-panel"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2">
          Review Shipping Instruction
        </h1>
        <p className="text-[#A1A1AA]">
          Please review all information carefully before submitting to IRIS.
        </p>
      </div>

      {/* Validation Summary */}
      <section>
        <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4">
          Validation Status
        </h2>
        <ValidationSummaryCard result={validationResult} />
      </section>

      {/* Data Summary */}
      <section>
        <h2 className="text-xl font-semibold text-[#FFFFFF] mb-4">
          Shipping Instruction Details
        </h2>
        <DataSummaryTable data={siData} />
      </section>

      {/* Info Card */}
      <Card className="border-[#22D3EE]/30 bg-[#22D3EE]/5">
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
          <div>
            <h4 className="text-sm font-semibold text-[#22D3EE] mb-1">
              Before You Submit
            </h4>
            <ul className="text-sm text-[#A1A1AA] space-y-1 list-disc list-inside">
              <li>Double-check all shipping addresses and contact information</li>
              <li>Verify cargo weight and volume measurements are accurate</li>
              <li>Confirm port codes and vessel information are correct</li>
              <li>Ensure all dates are in the correct format</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end pt-4 border-t border-[#52525B]">
        {showEditButton && (
          <Button
            variant="secondary"
            onClick={handleEditClick}
            disabled={isSubmitting}
            data-testid="edit-button"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Data
          </Button>
        )}
        
        <Button
          variant="primary"
          onClick={handleSubmitClick}
          disabled={!canSubmit || isSubmitting}
          data-testid="submit-button"
          className="bg-[#22D3EE] hover:bg-[#22D3EE]/90 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all"
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Submit to IRIS
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        siData={siData}
        onConfirm={handleConfirmSubmit}
        onCancel={closeConfirmation}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
