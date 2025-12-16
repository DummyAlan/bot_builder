'use client';

import React from 'react';

export interface InlineFieldErrorProps {
  error?: string;
  warning?: string;
  className?: string;
}

export const InlineFieldError: React.FC<InlineFieldErrorProps> = ({
  error,
  warning,
  className = '',
}) => {
  if (!error && !warning) return null;

  const isError = !!error;
  const message = error || warning;
  const color = isError ? '#EF4444' : '#F97316';
  const icon = isError ? '✗' : '⚠';

  return (
    <div
      className={`flex items-center gap-2 mt-2 text-sm ${className}`}
      style={{ color }}
      role="alert"
      data-testid={isError ? 'inline-error' : 'inline-warning'}
    >
      <span className="text-xs leading-none">{icon}</span>
      <span>{message}</span>
    </div>
  );
};
