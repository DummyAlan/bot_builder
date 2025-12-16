/**
 * SubmissionProgressTracker Component
 * Displays multi-step submission progress with visual indicators
 */

'use client';

export interface SubmissionStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

export interface SubmissionProgressTrackerProps {
  steps: SubmissionStep[];
  currentStep: number;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

export const SubmissionProgressTracker = ({
  steps,
  currentStep,
  status,
}: SubmissionProgressTrackerProps) => {
  const getStepStatus = (index: number): SubmissionStep['status'] => {
    if (status === 'error' && index === currentStep) return 'error';
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getStepColor = (stepStatus: SubmissionStep['status']) => {
    switch (stepStatus) {
      case 'completed':
        return 'bg-[#10B981] border-[#10B981] text-[#10B981]';
      case 'active':
        return 'bg-[#22D3EE] border-[#22D3EE] text-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.5)]';
      case 'error':
        return 'bg-[#EF4444] border-[#EF4444] text-[#EF4444]';
      default:
        return 'bg-transparent border-[#52525B] text-[#52525B]';
    }
  };

  const getIconColor = (stepStatus: SubmissionStep['status']) => {
    switch (stepStatus) {
      case 'completed':
        return 'text-[#FFFFFF]';
      case 'active':
        return 'text-[#FFFFFF]';
      case 'error':
        return 'text-[#FFFFFF]';
      default:
        return 'text-[#52525B]';
    }
  };

  const getConnectorColor = (index: number) => {
    if (index < currentStep) {
      return 'bg-[#10B981]';
    }
    return 'bg-[#52525B]';
  };

  return (
    <div
      className="w-full py-8"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={0}
      aria-valuemax={steps.length - 1}
      data-testid="progress-tracker"
    >
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStepColor(stepStatus)}`}
                  data-testid={`progress-step-${step.id}`}
                  data-status={stepStatus}
                >
                  {stepStatus === 'completed' ? (
                    // Checkmark
                    <svg
                      className={`w-6 h-6 ${getIconColor(stepStatus)}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : stepStatus === 'error' ? (
                    // X mark
                    <svg
                      className={`w-6 h-6 ${getIconColor(stepStatus)}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : stepStatus === 'active' ? (
                    // Spinner
                    <svg
                      className={`w-6 h-6 ${getIconColor(stepStatus)} animate-spin`}
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
                  ) : (
                    // Step number
                    <span className={`text-sm font-semibold ${getIconColor(stepStatus)}`}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div
                  className={`mt-2 text-xs font-medium text-center max-w-[100px] ${
                    stepStatus === 'active'
                      ? 'text-[#22D3EE]'
                      : stepStatus === 'completed'
                      ? 'text-[#10B981]'
                      : stepStatus === 'error'
                      ? 'text-[#EF4444]'
                      : 'text-[#A1A1AA]'
                  }`}
                >
                  {step.label}
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 relative">
                  <div
                    className={`absolute inset-0 transition-all duration-500 ${getConnectorColor(index)}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
