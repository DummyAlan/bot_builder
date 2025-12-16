'use client';

import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300); // Wait for animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-[#10B981]/10',
          border: 'border-[#10B981]',
          text: 'text-[#10B981]',
          icon: '✓',
        };
      case 'error':
        return {
          bg: 'bg-[#EF4444]/10',
          border: 'border-[#EF4444]',
          text: 'text-[#EF4444]',
          icon: '✗',
        };
      case 'warning':
        return {
          bg: 'bg-[#F97316]/10',
          border: 'border-[#F97316]',
          text: 'text-[#F97316]',
          icon: '⚠',
        };
      case 'info':
        return {
          bg: 'bg-[#22D3EE]/10',
          border: 'border-[#22D3EE]',
          text: 'text-[#22D3EE]',
          icon: 'ℹ',
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`
        ${styles.bg} ${styles.border} border
        rounded-lg p-4 shadow-lg
        flex items-center gap-3
        min-w-[300px] max-w-md
        transition-all duration-300
        ${isVisible ? 'animate-in slide-in-from-top-5' : 'animate-out slide-out-to-top-5 opacity-0'}
      `}
      role="alert"
      data-testid={`toast-${type}`}
    >
      <span className={`${styles.text} text-xl leading-none`}>
        {styles.icon}
      </span>
      <p className="flex-1 text-sm text-[#FFFFFF]">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className="text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

export interface ToastContainerProps {
  toasts: Array<Omit<ToastProps, 'onClose'>>;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = 'top-right',
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed ${getPositionClasses()} z-50 space-y-3`}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};
