'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ExtractedSIData, ExtractionProgress } from '@/types/si-data';
import { mockSIData } from '@/mocks/si-data-mock';
import { UploadProgress } from './UploadProgress';

export interface SIUploadZoneProps {
  onUploadComplete: (data: ExtractedSIData) => void;
  onError: (error: string) => void;
}

export const SIUploadZone: React.FC<SIUploadZoneProps> = ({ onUploadComplete, onError }) => {
  const [progress, setProgress] = useState<ExtractionProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const simulateExtraction = useCallback(
    async (file: File) => {
      setIsUploading(true);

      try {
        // Stage 1: Uploading
        setProgress({
          stage: 'uploading',
          progress: 0,
          message: `Uploading ${file.name}...`,
        });
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProgress((prev) => prev && { ...prev, progress: 25 });

        // Stage 2: Parsing
        setProgress({
          stage: 'parsing',
          progress: 25,
          message: 'Reading PDF content...',
        });
        await new Promise((resolve) => setTimeout(resolve, 400));
        setProgress((prev) => prev && { ...prev, progress: 50 });

        // Stage 3: Extracting
        setProgress({
          stage: 'extracting',
          progress: 50,
          message: 'Extracting shipping instruction data...',
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProgress((prev) => prev && { ...prev, progress: 75 });

        // Stage 4: Validating
        setProgress({
          stage: 'validating',
          progress: 75,
          message: 'Validating extracted information...',
        });
        await new Promise((resolve) => setTimeout(resolve, 400));
        setProgress((prev) => prev && { ...prev, progress: 90 });

        // Stage 5: Complete
        setProgress({
          stage: 'complete',
          progress: 100,
          message: 'Successfully extracted all data!',
        });
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Return mock data with actual file name
        onUploadComplete({
          ...mockSIData,
          fileName: file.name,
          uploadedAt: new Date(),
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to extract data from PDF';
        onError(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadComplete, onError]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        onError('Please select a valid PDF file');
        return;
      }

      const file = acceptedFiles[0];

      // Validate file type
      if (file.type !== 'application/pdf') {
        onError('Invalid file type. Please upload a PDF file.');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        onError('File size exceeds 10MB limit. Please upload a smaller file.');
        return;
      }

      simulateExtraction(file);
    },
    [onError, simulateExtraction]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isUploading,
    onDropRejected: (fileRejections) => {
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const error = rejection.errors[0];
        
        // Provide user-friendly error messages based on error codes
        if (error.code === 'file-invalid-type') {
          onError('Invalid file type. Please upload a PDF file.');
        } else if (error.code === 'file-too-large') {
          onError('File size exceeds 10MB limit. Please upload a smaller file.');
        } else if (error.code === 'too-many-files') {
          onError('Please upload only one file at a time.');
        } else {
          onError(error.message || 'File upload rejected');
        }
      }
    },
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
          ${
            isDragActive
              ? 'border-[#22d3ee] bg-[#22d3ee]/5 shadow-lg shadow-[#22d3ee]/20'
              : 'border-[#22d3ee]/30 bg-[#18181b]'
          }
          ${
            !isUploading
              ? 'hover:border-[#22d3ee]/60 hover:bg-[#18181b]/80 hover:shadow-lg hover:shadow-[#22d3ee]/20'
              : 'opacity-60 cursor-not-allowed'
          }
        `}
        data-testid="si-upload-zone"
      >
        <input {...getInputProps()} aria-label="File upload input" />

        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="flex justify-center">
            <svg
              className="w-16 h-16 text-[#22d3ee]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Upload Instructions */}
          <div>
            <p className="text-lg font-semibold text-[#fafafa] mb-2" data-testid="si-upload-description">
              {isDragActive ? 'Drop your PDF here' : 'Drag & drop your SI PDF here'}
            </p>
            <p className="text-sm text-[#a1a1aa]">or click to browse files</p>
          </div>

          {/* File Requirements */}
          <div className="text-xs text-[#a1a1aa] space-y-1">
            <p>Accepted format: PDF</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {progress && <UploadProgress progress={progress} />}
    </div>
  );
};
