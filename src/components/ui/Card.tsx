import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'green';
}

export const Card: React.FC<CardProps> = ({ children, className = '', glowColor = 'cyan' }) => {
  const glowColors = {
    cyan: 'border-[#22d3ee]/20 shadow-[#22d3ee]/10',
    purple: 'border-[#a855f7]/20 shadow-[#a855f7]/10',
    green: 'border-[#22c55e]/20 shadow-[#22c55e]/10',
  };
  
  return (
    <div
      className={`bg-[#18181b] border rounded-xl p-8 shadow-lg ${glowColors[glowColor]} ${className}`}
      data-testid="ui-card"
    >
      {children}
    </div>
  );
};
