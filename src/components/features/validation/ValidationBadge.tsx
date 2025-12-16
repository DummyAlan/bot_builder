'use client';

import React from 'react';
import { ValidationStatus } from '@/types/validation';

export interface ValidationBadgeProps {
  status: ValidationStatus;
  count?: number;
  label?: string;
  className?: string;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({
  status,
  count,
  label,
  className = '',
}) => {
  const getBadgeStyles = () => {
    switch (status) {
      case 'valid':
        return 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]';
      case 'invalid':
        return 'bg-[#EF4444]/10 border-[#EF4444] text-[#EF4444]';
      case 'warning':
        return 'bg-[#F97316]/10 border-[#F97316] text-[#F97316]';
      case 'auto-fixed':
        return 'bg-[#22D3EE]/10 border-[#22D3EE] text-[#22D3EE]';
      default:
        return 'bg-[#A1A1AA]/10 border-[#A1A1AA] text-[#A1A1AA]';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'valid':
        return '✓';
      case 'invalid':
        return '✗';
      case 'warning':
        return '⚠';
      case 'auto-fixed':
        return '⟳';
      default:
        return '';
    }
  };

  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1
        border rounded-full
        text-xs font-medium
        ${getBadgeStyles()}
        ${className}
      `}
      data-testid={`validation-badge-${status}`}
    >
      <span className="text-sm leading-none">{getIcon()}</span>
      <span>{displayLabel}</span>
      {count !== undefined && (
        <span className="ml-0.5 font-bold">({count})</span>
      )}
    </span>
  );
};
