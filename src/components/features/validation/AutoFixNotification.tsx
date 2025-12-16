'use client';

import React from 'react';
import { AutoFixResult } from '@/types/validation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface AutoFixNotificationProps {
  fixes: AutoFixResult[];
  onDismiss: () => void;
  onViewDetails?: (fieldName: string) => void;
  className?: string;
}

export const AutoFixNotification: React.FC<AutoFixNotificationProps> = ({
  fixes,
  onDismiss,
  onViewDetails,
  className = '',
}) => {
  if (fixes.length === 0) return null;

  return (
    <Card
      className={`
        bg-[#18181B] 
        border-2 border-[#22D3EE] 
        shadow-lg shadow-[#22D3EE]/50 
        animate-in slide-in-from-top-5 duration-300
        ${className}
      `}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#22D3EE] text-xl">⟳</span>
            <h3 className="text-lg font-semibold text-[#22D3EE]">
              Auto-corrections Applied
            </h3>
          </div>
          <button
            onClick={onDismiss}
            className="text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <p className="text-sm text-[#A1A1AA]">
          {fixes.length} {fixes.length === 1 ? 'field was' : 'fields were'} automatically
          corrected to improve data quality.
        </p>

        {/* Fix Details */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {fixes.map((fix, index) => (
            <button
              key={index}
              onClick={() => onViewDetails?.(fix.field)}
              className="w-full text-left p-3 rounded bg-[#22D3EE]/5 border border-[#22D3EE]/20 hover:bg-[#22D3EE]/10 transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#FFFFFF]">
                  {formatFieldName(fix.field)}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#EF4444] line-through">
                    {truncate(fix.originalValue, 30)}
                  </span>
                  <span className="text-[#A1A1AA]">→</span>
                  <span className="text-[#10B981]">
                    {truncate(fix.fixedValue, 30)}
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] italic">
                  {fix.reason}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 border-t border-[#27272A]">
          <Button
            onClick={onDismiss}
            variant="secondary"
            size="sm"
            className="text-sm"
          >
            Got it
          </Button>
        </div>
      </div>
    </Card>
  );
};

function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
