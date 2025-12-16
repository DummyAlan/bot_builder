import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'green';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  animated?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'cyan',
  size = 'md',
  interactive = false,
  animated = false,
  onClick 
}) => {
  const glowColors = {
    cyan: 'border-[#22d3ee]/20 shadow-[#22d3ee]/10',
    purple: 'border-[#a855f7]/20 shadow-[#a855f7]/10',
    green: 'border-[#22c55e]/20 shadow-[#22c55e]/10',
  };

  const sizeStyles = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12',
  };

  const animationClasses = animated ? {
    cyan: 'border-pulse',
    purple: 'border-pulse-purple',
    green: 'border-pulse-green',
  }[glowColor] : '';

  const getShadowColor = () => {
    if (glowColor === 'cyan') return '[#22d3ee]';
    if (glowColor === 'purple') return '[#a855f7]';
    return '[#22c55e]';
  };

  const interactiveClasses = interactive || onClick 
    ? `cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-${getShadowColor()}/20` 
    : '';

  const Component = onClick ? 'button' : 'div';
  const componentProps = onClick ? {
    onClick,
    type: 'button' as const,
  } : {};
  
  return (
    <Component
      className={`bg-[#18181b] border rounded-xl shadow-lg ${glowColors[glowColor]} ${sizeStyles[size]} ${interactiveClasses} ${animationClasses} ${className}`}
      data-testid="ui-card"
      {...componentProps}
    >
      {children}
    </Component>
  );
};
