/**
 * SI Review Page
 * Final review before submission to IRIS
 */

import { SubmissionReviewPanel } from '@/components/features/submission/SubmissionReviewPanel';
import { mockSIData, mockValidationResult } from '@/mocks/si-mock-data';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Review Shipping Instruction | Bot Builders',
  description: 'Review and submit shipping instruction to IRIS',
};

export default async function ReviewPage({ params }: PageProps) {
  const { id } = params;

  // In real implementation, fetch SI data from database
  // For now, use mock data
  if (id !== mockSIData.id) {
    notFound();
  }

  const siData = mockSIData;
  const validationResult = mockValidationResult;

  return (
    <div className="min-h-screen bg-[#000000]">
      <SubmissionReviewPanel
        siData={siData}
        validationResult={validationResult}
        showEditButton={true}
      />
    </div>
  );
}
