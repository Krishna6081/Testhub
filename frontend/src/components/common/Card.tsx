import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-card ${
        hoverEffect ? 'shadow-hover transition-all duration-200 hover:border-brand-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
