import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100';
    
    const variantStyles = {
      primary: 'bg-[#22d3ee] text-[#000000] hover:scale-105 hover:shadow-lg hover:shadow-[#22d3ee]/50',
      secondary: 'bg-[#a855f7] text-[#fafafa] hover:scale-105 hover:shadow-lg hover:shadow-[#a855f7]/50',
      outline: 'bg-transparent border-2 border-[#22d3ee] text-[#22d3ee] hover:bg-[#22d3ee]/10',
    };
    
    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const glowStyles: Record<typeof variant, React.CSSProperties> = {
      primary: { textShadow: props.disabled ? 'none' : '0 0 20px rgba(34, 211, 238, 0.5)' },
      secondary: { textShadow: props.disabled ? 'none' : '0 0 20px rgba(168, 85, 247, 0.5)' },
      outline: { textShadow: props.disabled ? 'none' : '0 0 15px rgba(34, 211, 238, 0.4)' },
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        style={glowStyles[variant]}
        data-testid="ui-button"
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
