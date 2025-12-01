'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthCard } from '@/components/ui/auth-card';
import { FormLabel } from '@/components/ui/form-label';
import { profileSetupSchema, type ProfileSetupFormData } from './schema';

export function ProfileSetupContent() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
  });

  // TanStack Query mutation
  const mutation = useMutation({
    mutationFn: async (data: ProfileSetupFormData) => {
      const response = await fetch('/api/profile/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('プロフィール更新に失敗しました');
      }

      return response.json();
    },
    onSuccess: () => {
      // 保存成功後、ダッシュボードへ遷移
      router.push('/dashboard');
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'エラーが発生しました');
    },
  });

  const onSubmit = async (data: ProfileSetupFormData) => {
    setError(null);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthCard>
        <div className="flex flex-col items-center gap-8 w-full">
          <h1 className="text-xl font-semibold text-gray-800">
            名前、目標体重設定画面
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="space-y-2">
              <FormLabel htmlFor="name">名前と目標体重を入力してください。</FormLabel>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    名前
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="山田太郎"
                    {...register('name')}
                    disabled={mutation.isPending}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目標体重
                  </label>
                  <Input
                    id="targetWeight"
                    type="number"
                    placeholder="65.0"
                    step="0.1"
                    {...register('targetWeight')}
                    disabled={mutation.isPending}
                    className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {errors.targetWeight && (
                    <p className="text-sm text-red-500 mt-1">{errors.targetWeight.message}</p>
                  )}
                </div>
              </div>
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
              disabled={mutation.isPending}
            >
              {mutation.isPending ? '保存中...' : 'OK'}
            </Button>
          </form>
        </div>
      </AuthCard>
    </div>
  );
}