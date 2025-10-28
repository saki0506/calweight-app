// src/components/ui/auth-card.tsx
import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-lg p-8 w-full max-w-md ${className}`}>
      {children}
    </div>
  );
};