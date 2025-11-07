import { PropsWithChildren } from 'react';

// AuthCardPropsとclassNameを削除
export const AuthCard: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
      {children}
    </div>
  );
};