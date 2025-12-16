/**
 * ProgressBar Component
 * Reusable progress bar with gaming aesthetics
 */

'use client';

export interface ProgressBarProps {
  progress: number; // 0-100
  status?: 'default' | 'success' | 'error';
  showLabel?: boolean;
  animated?: boolean;
}

const statusColors = {
  default: 'bg-[#22D3EE]',
  success: 'bg-[#10B981]',
  error: 'bg-[#EF4444]',
};

const statusGlows = {
  default: 'shadow-[0_0_10px_rgba(34,211,238,0.5)]',
  success: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]',
  error: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]',
};

export const ProgressBar = ({
  progress,
  status = 'default',
  showLabel = false,
  animated = true,
}: ProgressBarProps) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const colorClass = statusColors[status];
  const glowClass = statusGlows[status];

  return (
    <div className="w-full" data-testid="progress-bar">
      {/* Progress bar container */}
      <div className="relative w-full h-2 bg-[#27272A] rounded-full overflow-hidden">
        {/* Progress fill */}
        <div
          className={`h-full ${colorClass} ${glowClass} ${animated ? 'transition-all duration-500 ease-out' : ''} rounded-full`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          data-testid="progress-bar-fill"
        >
          {/* Animated shine effect */}
          {animated && clampedProgress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <div
          className="mt-2 text-sm text-[#A1A1AA] text-center font-medium"
          data-testid="progress-bar-label"
        >
          {clampedProgress}%
        </div>
      )}
    </div>
  );
};
