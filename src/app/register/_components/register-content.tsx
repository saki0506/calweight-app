// src/app/register/_components/register-content.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AuthCard } from '@/components/ui/auth-card';
import { FormLabel } from '@/components/ui/form-label';
import { Label } from '@/components/ui/label';
import { useSignUp } from '@/hooks/useAuth';
import { type RegisterFormData, registerSchema } from './schema';

export function RegisterContent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isLoading, error } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data);
      // 登録成功後、プロフィール設定ページへ遷移
      router.push('/profile-setup');
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthCard>
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-xl font-semibold text-gray-800">ユーザー登録</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <div className="space-y-2">
              <FormLabel htmlFor="email">Email or Gmail</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                defaultValue={process.env.NODE_ENV === 'development' ? 'test@example.com' : ''}
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <FormLabel htmlFor="password">パスワード</FormLabel>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                defaultValue={process.env.NODE_ENV === 'development' ? 'password123' : ''}
                {...register('password')}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="showPassword"
                checked={showPassword}
                onCheckedChange={(checked) => setShowPassword(checked as boolean)}
              />
              <Label
                htmlFor="showPassword"
                className="text-sm text-gray-700 cursor-pointer"
              >
                パスワードを表示する
              </Label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="default"
              className="w-full bg-[#FF9BAA] hover:bg-[#FF6B8A] text-gray-800 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? '登録中...' : 'ユーザー登録'}
            </Button>
          </form>
        </div>
      </AuthCard>
    </div>
  );
}