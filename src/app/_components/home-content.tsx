// src/app/_components/home-content.tsx
'use client';

import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { AuthCard } from '@/components/ui/auth-card';
import { useRouter } from 'next/navigation';

export function HomeContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthCard>
        <div className="flex flex-col items-center gap-8">
          {/* ロゴ */}
          <Logo size="lg" />

          {/* ボタン */}
          <div className="flex flex-col gap-4 w-full">
            <Button
              variant="outline"
              onClick={() => router.push('/register')}
              className="w-full"
            >
              新規登録
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/login')}
              className="w-full"
            >
              ログイン
            </Button>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}