// src/components/ui/auth-card.tsx
import { PropsWithChildren } from 'react';

const BaseCard: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
      {children}
    </div>
  );
};

// 認証ページ用
export const AuthCard = BaseCard;

// 汎用ページ用
export const ContentCard = BaseCard;