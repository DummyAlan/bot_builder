'use client';

import React, { useEffect, useState } from 'react';
import { ExtractedSIData } from '@/types/si-data';
import { ValidationResult, ValidationIssue } from '@/types/validation';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ValidationSummaryCard } from '@/components/features/validation/ValidationSummaryCard';
import { AutoFixNotification } from '@/components/features/validation/AutoFixNotification';
import { InlineFieldError } from '@/components/features/validation/InlineFieldError';
import { ToastContainer, ToastType } from '@/components/ui/Toast';

export interface SIDataFormProps {
  data: ExtractedSIData;
  readOnly?: boolean;
  enableValidation?: boolean;
  onValidationComplete?: (result: ValidationResult) => void;
}

export const SIDataForm: React.FC<SIDataFormProps> = ({ 
  data, 
  readOnly = true,
  enableValidation = false,
  onValidationComplete,
}) => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showAutoFixNotification, setShowAutoFixNotification] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; message: string }>>([]);
  
  useEffect(() => {
    if (enableValidation) {
      validateData();
    }
  }, [enableValidation, data]);
  
  const validateData = async () => {
    try {
      const response = await fetch('/api/si/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, applyAutoFix: true }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setValidationResult(result.result);
        onValidationComplete?.(result.result);
        
        if (result.result.autoFixes.length > 0) {
          setShowAutoFixNotification(true);
          addToast('success', `${result.result.autoFixes.length} fields auto-corrected`);
        }
        
        if (result.result.isValid) {
          addToast('success', 'All fields validated successfully');
        } else {
          addToast('warning', `${result.result.metadata.invalidFields} validation errors found`);
        }
      }
    } catch (error) {
      console.error('Validation failed:', error);
      addToast('error', 'Validation failed. Please try again.');
    }
  };
  
  const addToast = (type: ToastType, message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, message }]);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  
  const getFieldValidation = (fieldName: string) => {
    if (!validationResult) return null;
    
    const fieldIssues = validationResult.issues.filter((issue: ValidationIssue) => issue.field === fieldName);
    const error = fieldIssues.find((i: ValidationIssue) => i.severity === 'error');
    const warning = fieldIssues.find((i: ValidationIssue) => i.severity === 'warning');
    const isAutoFixed = validationResult.autoFixes.some((f) => f.field === fieldName);
    
    return {
      error: error?.message,
      warning: !error ? warning?.message : undefined,
      isAutoFixed,
      isValid: !error && !warning,
    };
  };
  
  const handleIssueClick = (fieldName: string) => {
    const element = document.querySelector(`[data-testid="si-form-field-${fieldName}"]`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (element as HTMLInputElement)?.focus();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div data-testid="si-data-form" className="space-y-6">
      {/* Validation Summary */}
      {enableValidation && validationResult && (
        <ValidationSummaryCard 
          result={validationResult} 
          onIssueClick={handleIssueClick}
        />
      )}
      
      {/* Auto-fix Notification */}
      {enableValidation && showAutoFixNotification && validationResult && (
        <AutoFixNotification
          fixes={validationResult.autoFixes}
          onDismiss={() => setShowAutoFixNotification(false)}
          onViewDetails={handleIssueClick}
        />
      )}
      
      <Card className="space-y-6" glowColor="cyan">
      {/* Header */}
      <div className="border-b border-[#3f3f46] pb-4">
        <h2 className="text-xl font-semibold text-[#fafafa] mb-2">
          Extracted Shipping Instruction
        </h2>
        <div className="flex items-center gap-4 text-sm text-[#a1a1aa]">
          <span>File: <span className="text-[#22d3ee] font-mono">{data.fileName}</span></span>
          <span>•</span>
          <span>Uploaded: {data.uploadedAt.toLocaleString()}</span>
        </div>
      </div>

      {/* Shipper Information */}
      <section>
        <h3 className="text-lg font-semibold text-[#22d3ee] mb-4">Shipper Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Shipper Name"
              value={data.shipperName}
              readOnly={readOnly}
              data-testid="si-form-field-shipperName"
              error={getFieldValidation('shipperName')?.error}
              warning={getFieldValidation('shipperName')?.warning}
              isValid={getFieldValidation('shipperName')?.isValid}
            />
            {enableValidation && getFieldValidation('shipperName') && (
              <InlineFieldError 
                error={getFieldValidation('shipperName')?.error}
                warning={getFieldValidation('shipperName')?.warning}
              />
            )}
          </div>
          <div>
            <Input
              label="Contact Information"
              value={data.shipperContact}
              readOnly={readOnly}
              data-testid="si-form-field-shipperContact"
              error={getFieldValidation('shipperContact')?.error}
              warning={getFieldValidation('shipperContact')?.warning}
              isValid={getFieldValidation('shipperContact')?.isValid}
            />
            {enableValidation && getFieldValidation('shipperContact') && (
              <InlineFieldError 
                error={getFieldValidation('shipperContact')?.error}
                warning={getFieldValidation('shipperContact')?.warning}
              />
            )}
          </div>
          <div className="md:col-span-2">
            <Input
              label="Address"
              value={data.shipperAddress}
              readOnly={readOnly}
              data-testid="si-form-field-shipperAddress"
              error={getFieldValidation('shipperAddress')?.error}
              warning={getFieldValidation('shipperAddress')?.warning}
              isValid={getFieldValidation('shipperAddress')?.isValid}
            />
            {enableValidation && getFieldValidation('shipperAddress') && (
              <InlineFieldError 
                error={getFieldValidation('shipperAddress')?.error}
                warning={getFieldValidation('shipperAddress')?.warning}
              />
            )}
          </div>
        </div>
      </section>

      {/* Consignee Information */}
      <section>
        <h3 className="text-lg font-semibold text-[#22d3ee] mb-4">Consignee Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Consignee Name"
              value={data.consigneeName}
              readOnly={readOnly}
              data-testid="si-form-field-consigneeName"
              error={getFieldValidation('consigneeName')?.error}
              warning={getFieldValidation('consigneeName')?.warning}
              isValid={getFieldValidation('consigneeName')?.isValid}
            />
            {enableValidation && getFieldValidation('consigneeName') && (
              <InlineFieldError 
                error={getFieldValidation('consigneeName')?.error}
                warning={getFieldValidation('consigneeName')?.warning}
              />
            )}
          </div>
          <div>
            <Input
              label="Contact Information"
              value={data.consigneeContact}
              readOnly={readOnly}
              data-testid="si-form-field-consigneeContact"
              error={getFieldValidation('consigneeContact')?.error}
              warning={getFieldValidation('consigneeContact')?.warning}
              isValid={getFieldValidation('consigneeContact')?.isValid}
            />
            {enableValidation && getFieldValidation('consigneeContact') && (
              <InlineFieldError 
                error={getFieldValidation('consigneeContact')?.error}
                warning={getFieldValidation('consigneeContact')?.warning}
              />
            )}
          </div>
          <div className="md:col-span-2">
            <Input
              label="Address"
              value={data.consigneeAddress}
              readOnly={readOnly}
              data-testid="si-form-field-consigneeAddress"
              error={getFieldValidation('consigneeAddress')?.error}
              warning={getFieldValidation('consigneeAddress')?.warning}
              isValid={getFieldValidation('consigneeAddress')?.isValid}
            />
            {enableValidation && getFieldValidation('consigneeAddress') && (
              <InlineFieldError 
                error={getFieldValidation('consigneeAddress')?.error}
                warning={getFieldValidation('consigneeAddress')?.warning}
              />
            )}
          </div>
        </div>
      </section>

      {/* Cargo Details */}
      <section>
        <h3 className="text-lg font-semibold text-[#22d3ee] mb-4">Cargo Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Cargo Description"
              value={data.cargoDescription}
              readOnly={readOnly}
              data-testid="si-form-field-cargoDescription"
              error={getFieldValidation('cargoDescription')?.error}
              warning={getFieldValidation('cargoDescription')?.warning}
              isValid={getFieldValidation('cargoDescription')?.isValid}
            />
            {enableValidation && getFieldValidation('cargoDescription') && (
              <InlineFieldError 
                error={getFieldValidation('cargoDescription')?.error}
                warning={getFieldValidation('cargoDescription')?.warning}
              />
            )}
          </div>
          <div>
            <Input
              label="Container Number"
              value={data.containerNumber}
              readOnly={readOnly}
              data-testid="si-form-field-containerNumber"
              error={getFieldValidation('containerNumber')?.error}
              warning={getFieldValidation('containerNumber')?.warning}
              isValid={getFieldValidation('containerNumber')?.isValid}
            />
            {enableValidation && getFieldValidation('containerNumber') && (
              <InlineFieldError 
                error={getFieldValidation('containerNumber')?.error}
                warning={getFieldValidation('containerNumber')?.warning}
              />
            )}
          </div>
          <div>
            <Input
              label="Booking Number"
              value={data.bookingNumber}
              readOnly={readOnly}
              data-testid="si-form-field-bookingNumber"
              error={getFieldValidation('bookingNumber')?.error}
              warning={getFieldValidation('bookingNumber')?.warning}
              isValid={getFieldValidation('bookingNumber')?.isValid}
            />
            {enableValidation && getFieldValidation('bookingNumber') && (
              <InlineFieldError 
                error={getFieldValidation('bookingNumber')?.error}
                warning={getFieldValidation('bookingNumber')?.warning}
              />
            )}
          </div>
          <div>
            <Input
              label="Weight"
              value={`${data.weight} ${data.weightUnit}`}
              readOnly={readOnly}
              data-testid="si-form-field-weight"
              error={getFieldValidation('weight')?.error}
              warning={getFieldValidation('weight')?.warning}
              isValid={getFieldValidation('weight')?.isValid}
            />
            {enableValidation && getFieldValidation('weight') && (
              <InlineFieldError 
                error={getFieldValidation('weight')?.error}
                warning={getFieldValidation('weight')?.warning}
              />
            )}
          </div>
          <div>
            <Input
              label="Volume"
              value={`${data.volume} ${data.volumeUnit}`}
              readOnly={readOnly}
              data-testid="si-form-field-volume"
              error={getFieldValidation('volume')?.error}
              warning={getFieldValidation('volume')?.warning}
              isValid={getFieldValidation('volume')?.isValid}
            />
            {enableValidation && getFieldValidation('volume') && (
              <InlineFieldError 
                error={getFieldValidation('volume')?.error}
                warning={getFieldValidation('volume')?.warning}
              />
            )}
          </div>
        </div>
      </section>

      {/* Shipping Details */}
      <section>
        <h3 className="text-lg font-semibold text-[#22d3ee] mb-4">Shipping Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Port of Loading"
              value={data.portOfLoading}
              readOnly={readOnly}
              data-testid="si-form-field-portOfLoading"
              error={getFieldValidation('portOfLoading')?.error}
              warning={getFieldValidation('portOfLoading')?.warning}
              isValid={getFieldValidation('portOfLoading')?.isValid}
            />
            {enableValidation && getFieldValidation('portOfLoading') && (
              <InlineFieldError 
                error={getFieldValidation('portOfLoading')?.error}
                warning={getFieldValidation('portOfLoading')?.warning}
              />
            )}
          </div>
          <div>
            <Input
              label="Port of Discharge"
              value={data.portOfDischarge}
              readOnly={readOnly}
              data-testid="si-form-field-portOfDischarge"
              error={getFieldValidation('portOfDischarge')?.error}
              warning={getFieldValidation('portOfDischarge')?.warning}
              isValid={getFieldValidation('portOfDischarge')?.isValid}
            />
            {enableValidation && getFieldValidation('portOfDischarge') && (
              <InlineFieldError 
                error={getFieldValidation('portOfDischarge')?.error}
                warning={getFieldValidation('portOfDischarge')?.warning}
              />
            )}
          </div>
          <Input
            label="Vessel Name"
            value={data.vesselName || 'N/A'}
            readOnly={readOnly}
            data-testid="si-form-field-vesselName"
          />
          <Input
            label="Voyage Number"
            value={data.voyageNumber || 'N/A'}
            readOnly={readOnly}
            data-testid="si-form-field-voyageNumber"
          />
        </div>
      </section>

      {/* Dates */}
      <section>
        <h3 className="text-lg font-semibold text-[#22d3ee] mb-4">Important Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Cargo Ready Date"
              value={formatDate(data.cargoReadyDate)}
              readOnly={readOnly}
              data-testid="si-form-field-cargoReadyDate"
              error={getFieldValidation('cargoReadyDate')?.error}
              warning={getFieldValidation('cargoReadyDate')?.warning}
              isValid={getFieldValidation('cargoReadyDate')?.isValid}
            />
            {enableValidation && getFieldValidation('cargoReadyDate') && (
              <InlineFieldError 
                error={getFieldValidation('cargoReadyDate')?.error}
                warning={getFieldValidation('cargoReadyDate')?.warning}
              />
            )}
          </div>
          <div>
            <Input
              label="Requested Ship Date"
              value={formatDate(data.requestedShipDate)}
              readOnly={readOnly}
              data-testid="si-form-field-requestedShipDate"
              error={getFieldValidation('requestedShipDate')?.error}
              warning={getFieldValidation('requestedShipDate')?.warning}
              isValid={getFieldValidation('requestedShipDate')?.isValid}
            />
            {enableValidation && getFieldValidation('requestedShipDate') && (
              <InlineFieldError 
                error={getFieldValidation('requestedShipDate')?.error}
                warning={getFieldValidation('requestedShipDate')?.warning}
              />
            )}
          </div>
        </div>
      </section>
    </Card>
    
    {/* Toast Notifications */}
    <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};
