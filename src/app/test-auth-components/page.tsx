// src/app/test-auth-components/page.tsx
import { AuthCard } from '@/components/ui/auth-card';
import { Logo } from '@/components/ui/logo';
import { FormLabel } from '@/components/ui/form-label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TestAuthComponents() {
  return (
    //  背景を #FFD1D7 に統一（カード外側）
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#FFD1D7' }}
    >
      <AuthCard>
        <div className="flex flex-col items-center gap-6">
          {/* ロゴ（円＋テキスト入り） */}
          <Logo size="md" />

          <h2 className="text-xl font-bold text-center">
            認証コンポーネントテスト
          </h2>

          <div className="w-full space-y-4">
            {/* Email フィールド */}
            <div>
              <FormLabel htmlFor="email" required>
                Email or Gmail
              </FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="mt-1"
              />
            </div>

            {/* パスワードフィールド */}
            <div>
              <FormLabel htmlFor="password" required>
                パスワード
              </FormLabel>
              <Input id="password" type="password" className="mt-1" />
            </div>

            {/* ログインボタン */}
            <Button
              variant="softPink"
              className="w-full font-medium text-white rounded-full hover:opacity-90 transition-opacity"
            >
              ログイン
            </Button>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}
