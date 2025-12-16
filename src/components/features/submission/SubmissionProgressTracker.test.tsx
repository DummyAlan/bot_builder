/**
 * SubmissionProgressTracker Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  SubmissionProgressTracker,
  SubmissionStep,
} from './SubmissionProgressTracker';

const mockSteps: SubmissionStep[] = [
  { id: 'preparing', label: 'Preparing Data', status: 'completed' },
  { id: 'validating', label: 'Validating', status: 'completed' },
  { id: 'submitting', label: 'Submitting to IRIS', status: 'active' },
  { id: 'confirming', label: 'Confirming', status: 'pending' },
];

describe('SubmissionProgressTracker', () => {
  it('renders all steps', () => {
    render(
      <SubmissionProgressTracker
        steps={mockSteps}
        currentStep={2}
        status="in-progress"
      />
    );

    mockSteps.forEach((step) => {
      expect(screen.getByText(step.label)).toBeInTheDocument();
    });
  });

  it('shows completed steps with checkmarks', () => {
    render(
      <SubmissionProgressTracker
        steps={mockSteps}
        currentStep={2}
        status="in-progress"
      />
    );

    const preparingStep = screen.getByTestId('progress-step-preparing');
    const validatingStep = screen.getByTestId('progress-step-validating');

    expect(preparingStep.getAttribute('data-status')).toBe('completed');
    expect(validatingStep.getAttribute('data-status')).toBe('completed');
  });

  it('shows active step with spinner', () => {
    render(
      <SubmissionProgressTracker
        steps={mockSteps}
        currentStep={2}
        status="in-progress"
      />
    );

    const submittingStep = screen.getByTestId('progress-step-submitting');
    expect(submittingStep.getAttribute('data-status')).toBe('active');
  });

  it('shows pending steps with step numbers', () => {
    render(
      <SubmissionProgressTracker
        steps={mockSteps}
        currentStep={2}
        status="in-progress"
      />
    );

    const confirmingStep = screen.getByTestId('progress-step-confirming');
    expect(confirmingStep.getAttribute('data-status')).toBe('pending');
  });

  it('shows error status when status is error', () => {
    render(
      <SubmissionProgressTracker
        steps={mockSteps}
        currentStep={2}
        status="error"
      />
    );

    const submittingStep = screen.getByTestId('progress-step-submitting');
    expect(submittingStep.getAttribute('data-status')).toBe('error');
  });

  it('renders with correct ARIA attributes', () => {
    render(
      <SubmissionProgressTracker
        steps={mockSteps}
        currentStep={2}
        status="in-progress"
      />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '2');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '3');
  });

  it('renders with correct test ID', () => {
    render(
      <SubmissionProgressTracker
        steps={mockSteps}
        currentStep={2}
        status="in-progress"
      />
    );

    expect(screen.getByTestId('progress-tracker')).toBeInTheDocument();
  });

  it('handles single step', () => {
    const singleStep: SubmissionStep[] = [
      { id: 'only', label: 'Only Step', status: 'active' },
    ];

    render(
      <SubmissionProgressTracker
        steps={singleStep}
        currentStep={0}
        status="in-progress"
      />
    );

    expect(screen.getByText('Only Step')).toBeInTheDocument();
  });

  it('handles all steps completed', () => {
    const completedSteps: SubmissionStep[] = mockSteps.map((step) => ({
      ...step,
      status: 'completed' as const,
    }));

    render(
      <SubmissionProgressTracker
        steps={completedSteps}
        currentStep={3}
        status="completed"
      />
    );

    completedSteps.forEach((step) => {
      const stepElement = screen.getByTestId(`progress-step-${step.id}`);
      expect(stepElement.getAttribute('data-status')).toBe('completed');
    });
  });
});
