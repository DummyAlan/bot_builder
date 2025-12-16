import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SIUploadZone } from './SIUploadZone';

describe('SIUploadZone', () => {
  const mockOnUploadComplete = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload zone with instructions', () => {
    render(
      <SIUploadZone
        onUploadComplete={mockOnUploadComplete}
        onError={mockOnError}
      />
    );

    expect(screen.getByTestId('si-upload-zone')).toBeInTheDocument();
    expect(screen.getByText(/drag.*drop/i)).toBeInTheDocument();
  });

  it('shows file requirements', () => {
    render(
      <SIUploadZone
        onUploadComplete={mockOnUploadComplete}
        onError={mockOnError}
      />
    );

    expect(screen.getByText(/accepted format.*pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/maximum file size.*10mb/i)).toBeInTheDocument();
  });

  it('handles valid PDF file upload', async () => {
    render(
      <SIUploadZone
        onUploadComplete={mockOnUploadComplete}
        onError={mockOnError}
      />
    );

    const file = new File(['pdf content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText('File upload input') as HTMLInputElement;

    await userEvent.upload(input, file);

    await waitFor(
      () => {
        expect(mockOnUploadComplete).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('rejects non-PDF files', async () => {
    render(
      <SIUploadZone
        onUploadComplete={mockOnUploadComplete}
        onError={mockOnError}
      />
    );

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('File upload input') as HTMLInputElement;

    // Use fireEvent instead of userEvent as it more accurately simulates file input changes
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });
    fireEvent.change(input);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(
        expect.stringContaining('Invalid file type')
      );
    });
    expect(mockOnUploadComplete).not.toHaveBeenCalled();
  });

  it('rejects files larger than 10MB', async () => {
    render(
      <SIUploadZone
        onUploadComplete={mockOnUploadComplete}
        onError={mockOnError}
      />
    );

    // Create a file larger than 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText('File upload input') as HTMLInputElement;

    await userEvent.upload(input, largeFile);

    expect(mockOnError).toHaveBeenCalledWith(
      expect.stringContaining('File size exceeds 10MB')
    );
    expect(mockOnUploadComplete).not.toHaveBeenCalled();
  });

  it('displays progress during upload', async () => {
    render(
      <SIUploadZone
        onUploadComplete={mockOnUploadComplete}
        onError={mockOnError}
      />
    );

    const file = new File(['pdf content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText('File upload input') as HTMLInputElement;

    await userEvent.upload(input, file);

    // Progress indicator should appear
    await waitFor(() => {
      expect(screen.getByTestId('si-upload-progress')).toBeInTheDocument();
    });
  });

  it('passes correct data to onUploadComplete', async () => {
    render(
      <SIUploadZone
        onUploadComplete={mockOnUploadComplete}
        onError={mockOnError}
      />
    );

    const fileName = 'shipping-instruction.pdf';
    const file = new File(['pdf content'], fileName, {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText('File upload input') as HTMLInputElement;

    await userEvent.upload(input, file);

    await waitFor(
      () => {
        expect(mockOnUploadComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            fileName,
            status: 'extracted',
            shipperName: expect.any(String),
            consigneeName: expect.any(String),
          })
        );
      },
      { timeout: 3000 }
    );
  });

  it('disables upload during processing', async () => {
    render(
      <SIUploadZone
        onUploadComplete={mockOnUploadComplete}
        onError={mockOnError}
      />
    );

    const file = new File(['pdf content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByLabelText('File upload input') as HTMLInputElement;

    await userEvent.upload(input, file);

    // Upload zone should be disabled during processing
    await waitFor(() => {
      const uploadZone = screen.getByTestId('si-upload-zone');
      expect(uploadZone).toHaveClass('cursor-not-allowed');
    });
  });
});
