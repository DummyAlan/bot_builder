'use client';

import React, { useState } from 'react';
import { SIUploadZone } from '@/components/features/si-upload/SIUploadZone';
import { SIDataForm } from '@/components/features/si-upload/SIDataForm';
import { ExtractedSIData } from '@/types/si-data';

export default function SIUploadPage() {
  const [extractedData, setExtractedData] = useState<ExtractedSIData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = (data: ExtractedSIData) => {
    setExtractedData(data);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setExtractedData(null);
  };

  const handleReset = () => {
    setExtractedData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#000000] py-12 px-4 sm:px-6" data-testid="si-upload-page">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 
            className="text-3xl font-bold text-[#22d3ee] mb-2"
            style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}
            data-testid="si-upload-title"
          >
            Shipping Instruction Upload
          </h1>
          <p className="text-lg text-[#a1a1aa]">
            Upload your SI PDF to automatically extract and process shipping data
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 p-4 bg-[#18181b] border border-[#ef4444]/50 rounded-lg"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <svg 
                className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              <div>
                <h3 className="font-semibold text-[#ef4444] mb-1">Upload Failed</h3>
                <p className="text-sm text-[#fafafa]">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!extractedData ? (
          <SIUploadZone 
            onUploadComplete={handleUploadComplete} 
            onError={handleError} 
          />
        ) : (
          <div className="space-y-6">
            <SIDataForm data={extractedData} readOnly />
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-transparent border-2 border-[#a1a1aa] text-[#a1a1aa] rounded-lg font-semibold transition-all hover:border-[#fafafa] hover:text-[#fafafa]"
              >
                Upload Another File
              </button>
              
              <div className="flex gap-3">
                <button
                  className="px-6 py-3 bg-[#a855f7] text-[#fafafa] rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#a855f7]/50"
                >
                  Edit Data
                </button>
                <button
                  className="px-6 py-3 bg-[#22d3ee] text-[#000000] rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#22d3ee]/50"
                >
                  Proceed to Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 p-6 bg-[#18181b] border border-[#3f3f46] rounded-lg">
          <h3 className="text-sm font-semibold text-[#22d3ee] mb-2">Need Help?</h3>
          <ul className="text-sm text-[#a1a1aa] space-y-1">
            <li>• Ensure your PDF contains a valid Shipping Instruction format</li>
            <li>• The system supports standard SI templates from major carriers</li>
            <li>• You can edit the extracted data after upload if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
