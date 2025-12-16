/**
 * ConfirmationDialog Component
 * Modal dialog for final submission confirmation
 */

'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ExtractedSIData } from '@/types/si-data';
import { DataSummaryTable } from './DataSummaryTable';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  siData: ExtractedSIData | null;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ConfirmationDialog = ({
  isOpen,
  siData,
  onConfirm,
  onCancel,
  isSubmitting,
}: ConfirmationDialogProps) => {
  if (!siData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Confirm Submission"
      size="xl"
    >
      <div data-testid="confirmation-dialog">
        {/* Warning message */}
        <div className="mb-6 p-4 bg-[#F97316]/10 border border-[#F97316]/30 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-[#F97316] mb-1">
                Final Review Required
              </h4>
              <p className="text-sm text-[#A1A1AA]">
                Please review all information carefully. Once submitted, changes
                cannot be made. This data will be sent to the IRIS system for
                processing.
              </p>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-[#27272A] rounded-lg">
            <div className="text-2xl font-bold text-[#22D3EE]">
              {siData.bookingNumber}
            </div>
            <div className="text-xs text-[#A1A1AA] mt-1">Booking Number</div>
          </div>
          <div className="p-4 bg-[#27272A] rounded-lg">
            <div className="text-2xl font-bold text-[#10B981]">17</div>
            <div className="text-xs text-[#A1A1AA] mt-1">Fields</div>
          </div>
          <div className="p-4 bg-[#27272A] rounded-lg">
            <div className="text-2xl font-bold text-[#10B981]">
              {siData.validationResult?.isValid ? 'Valid' : 'Warning'}
            </div>
            <div className="text-xs text-[#A1A1AA] mt-1">Status</div>
          </div>
        </div>

        {/* Data preview */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[#FFFFFF] mb-3">
            Submission Data Preview
          </h4>
          <div className="max-h-[400px] overflow-y-auto">
            <DataSummaryTable data={siData} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            data-testid="cancel-button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isSubmitting}
            data-testid="confirm-button"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              'Confirm & Submit to IRIS'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
