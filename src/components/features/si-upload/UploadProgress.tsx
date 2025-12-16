import React from 'react';
import { ExtractionProgress } from '@/types/si-data';

export interface UploadProgressProps {
  progress: ExtractionProgress;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  const stageLabels = {
    uploading: 'Uploading file...',
    parsing: 'Parsing PDF...',
    extracting: 'Extracting data...',
    validating: 'Validating information...',
    complete: 'Extraction complete!',
  };
  
  const stageColors = {
    uploading: 'bg-[#22d3ee]',
    parsing: 'bg-[#22d3ee]',
    extracting: 'bg-[#22d3ee]',
    validating: 'bg-[#a855f7]',
    complete: 'bg-[#22c55e]',
  };
  
  return (
    <div className="w-full space-y-3" data-testid="si-upload-progress">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-[#fafafa]">
          {stageLabels[progress.stage]}
        </span>
        <span className="text-sm font-mono text-[#a1a1aa]">
          {Math.round(progress.progress)}%
        </span>
      </div>
      
      <div className="w-full h-2 bg-[#18181b] rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-out ${stageColors[progress.stage]}`}
          style={{ width: `${progress.progress}%` }}
        />
      </div>
      
      {progress.message && (
        <p className="text-xs text-[#a1a1aa] italic">
          {progress.message}
        </p>
      )}
    </div>
  );
};
