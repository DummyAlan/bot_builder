'use client';

import React, { useState } from 'react';
import { ValidationResult } from '@/types/validation';
import { Card } from '@/components/ui/Card';
import { ValidationBadge } from './ValidationBadge';

export interface ValidationSummaryCardProps {
  result: ValidationResult;
  onIssueClick?: (fieldName: string) => void;
  className?: string;
}

export const ValidationSummaryCard: React.FC<ValidationSummaryCardProps> = ({
  result,
  onIssueClick,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isValid, issues, metadata } = result;

  const errorIssues = issues.filter(i => i.severity === 'error');
  const warningIssues = issues.filter(i => i.severity === 'warning');
  const infoIssues = issues.filter(i => i.severity === 'info');

  return (
    <Card
      className={`bg-[#18181B] border ${
        isValid ? 'border-[#10B981]/30' : 'border-[#EF4444]/30'
      } ${className}`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isValid ? 'bg-[#10B981]' : 'bg-[#EF4444]'
              } shadow-lg ${
                isValid ? 'shadow-[#10B981]/50' : 'shadow-[#EF4444]/50'
              }`}
            />
            <h3 className="text-lg font-semibold text-[#FFFFFF]">
              Validation {isValid ? 'Passed' : 'Failed'}
            </h3>
          </div>
          {issues.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#22D3EE] hover:text-[#22D3EE]/80 transition-colors"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse issues' : 'Expand issues'}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
        </div>

        {/* Badge Summary */}
        <div className="flex flex-wrap gap-2">
          {metadata.validFields > 0 && (
            <ValidationBadge
              status="valid"
              count={metadata.validFields}
              label="Valid"
            />
          )}
          {metadata.invalidFields > 0 && (
            <ValidationBadge
              status="invalid"
              count={metadata.invalidFields}
              label="Errors"
            />
          )}
          {metadata.warningFields > 0 && (
            <ValidationBadge
              status="warning"
              count={metadata.warningFields}
              label="Warnings"
            />
          )}
          {metadata.autoFixedFields > 0 && (
            <ValidationBadge
              status="auto-fixed"
              count={metadata.autoFixedFields}
              label="Auto-fixed"
            />
          )}
        </div>

        {/* Issues List (Expandable) */}
        {isExpanded && issues.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#27272A]">
            {/* Errors */}
            {errorIssues.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#EF4444]">
                  Errors ({errorIssues.length})
                </h4>
                {errorIssues.map((issue, index) => (
                  <button
                    key={`error-${index}`}
                    onClick={() => onIssueClick?.(issue.field)}
                    className="w-full text-left p-3 rounded bg-[#EF4444]/10 border border-[#EF4444]/20 hover:bg-[#EF4444]/15 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-[#EF4444] text-xs mt-0.5">✗</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#FFFFFF]">
                          {formatFieldName(issue.field)}
                        </p>
                        <p className="text-xs text-[#A1A1AA] mt-1">{issue.message}</p>
                        {issue.suggestion && (
                          <p className="text-xs text-[#22D3EE] mt-1">
                            💡 {issue.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Warnings */}
            {warningIssues.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#F97316]">
                  Warnings ({warningIssues.length})
                </h4>
                {warningIssues.map((issue, index) => (
                  <button
                    key={`warning-${index}`}
                    onClick={() => onIssueClick?.(issue.field)}
                    className="w-full text-left p-3 rounded bg-[#F97316]/10 border border-[#F97316]/20 hover:bg-[#F97316]/15 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-[#F97316] text-xs mt-0.5">⚠</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#FFFFFF]">
                          {formatFieldName(issue.field)}
                        </p>
                        <p className="text-xs text-[#A1A1AA] mt-1">{issue.message}</p>
                        {issue.suggestion && (
                          <p className="text-xs text-[#22D3EE] mt-1">
                            💡 {issue.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Info */}
            {infoIssues.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#A855F7]">
                  Info ({infoIssues.length})
                </h4>
                {infoIssues.map((issue, index) => (
                  <button
                    key={`info-${index}`}
                    onClick={() => onIssueClick?.(issue.field)}
                    className="w-full text-left p-3 rounded bg-[#A855F7]/10 border border-[#A855F7]/20 hover:bg-[#A855F7]/15 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-[#A855F7] text-xs mt-0.5">ℹ</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#FFFFFF]">
                          {formatFieldName(issue.field)}
                        </p>
                        <p className="text-xs text-[#A1A1AA] mt-1">{issue.message}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
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
