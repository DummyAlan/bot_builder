import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  warning?: string;
  isValid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, warning, isValid, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replaceAll(/\s+/g, '-');

    const getAriaDescribedBy = () => {
      if (error) return `${inputId}-error`;
      if (warning) return `${inputId}-warning`;
      return undefined;
    };
    
    const getBorderClass = () => {
      if (error) {
        return 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/20 shadow-lg shadow-[#ef4444]/30';
      }
      if (warning) {
        return 'border-[#f97316] focus:border-[#f97316] focus:ring-[#f97316]/20 shadow-[#f97316]/20';
      }
      if (isValid) {
        return 'border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981]/20 shadow-[#10b981]/20';
      }
      return 'border-[#3f3f46] focus:border-[#22d3ee] focus:ring-[#22d3ee]/20 focus:shadow-lg focus:shadow-[#22d3ee]/20';
    };
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#a1a1aa] mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full
            bg-[#18181b]
            border
            text-[#fafafa]
            px-4 py-3
            rounded-lg
            font-mono text-sm
            transition-all
            focus:outline-none
            focus:ring-2
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${getBorderClass()}
            ${className}
          `}
          data-testid="ui-input"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={getAriaDescribedBy()}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-[#ef4444] flex items-center gap-1"
            role="alert"
          >
            <span className="text-xs">✗</span>
            {error}
          </p>
        )}
        {!error && warning && (
          <p
            id={`${inputId}-warning`}
            className="mt-1 text-sm text-[#f97316] flex items-center gap-1"
            role="alert"
          >
            <span className="text-xs">⚠</span>
            {warning}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
