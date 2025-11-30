'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthCard } from '@/components/ui/auth-card';
import { FormLabel } from '@/components/ui/form-label';

export function ProfileSetupContent() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !targetWeight) {
      alert('名前と目標体重を入力してください');
      return;
    }

    setIsLoading(true);
    try {
      // 後で保存処理を実装
      console.log('Name:', name);
      console.log('Target Weight:', targetWeight);

      // 保存成功後、ダッシュボードへ遷移
      router.push('/dashboard');
    } catch (err) {
      console.error('Save error:', err);
      alert('保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthCard>
        <div className="flex flex-col items-center gap-8 w-full">
          <h1 className="text-xl font-semibold text-gray-800">
            名前、目標体重設定画面
          </h1>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
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
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    disabled={isLoading}
                    className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              className="w-full bg-[#FF9BAA] hover:bg-[#FF6B8A] text-gray-800 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? '保存中...' : 'OK'}
            </Button>
          </form>
        </div>
      </AuthCard>
    </div>
  );
}