'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthCard } from '@/components/ui/auth-card';
import { DateDisplay } from './date-display';
import { NumberPad } from './number-pad';
import { BottomNavigation, type TabId } from '@/components/ui/bottom-navigation';

type ActiveField = 'weight' | 'bodyFat';

export function WeightInputContent() {
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [activeField, setActiveField] = useState<ActiveField>('weight');
  const [activeTab, setActiveTab] = useState<TabId>('edit');
  const [selectedDate] = useState(new Date());

  const currentValue = activeField === 'weight' ? weight : bodyFat;
  const setCurrentValue = activeField === 'weight' ? setWeight : setBodyFat;

  const handleInput = (digit: string) => {
    const newValue = currentValue + digit;
    if (newValue.length > 5) return;
    if (isNaN(Number(newValue))) return;
    setCurrentValue(newValue);
  };

  const handleDelete = () => {
    setCurrentValue(currentValue.slice(0, -1));
  };

  const handleDecimal = () => {
    if (currentValue.includes('.')) return;
    if (currentValue === '') {
      setCurrentValue('0.');
    } else {
      setCurrentValue(currentValue + '.');
    }
  };

  const handleSubmit = () => {
    console.log('Submit:', { weight, bodyFat, date: selectedDate });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24 md:pb-28">
        <div className="w-full max-w-sm md:max-w-md flex flex-col gap-3 md:gap-4">
          {/* 上部カード：日付と入力フィールド */}
          <AuthCard>
            <div className="flex flex-col gap-3 md:gap-4">
              <DateDisplay date={selectedDate} />

              <div className="flex flex-col gap-2 md:gap-3">
                {/* 体重入力 */}
                <div className="relative">
                  <Input
                    value={weight}
                    readOnly
                    placeholder="体重"
                    onClick={() => setActiveField('weight')}
                    className={`pr-12 cursor-pointer ${
                      activeField === 'weight' ? 'ring-2 ring-pink-400 border-pink-400' : ''
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    kg
                  </span>
                </div>

                {/* 体脂肪率入力 */}
                <div className="relative">
                  <Input
                    value={bodyFat}
                    readOnly
                    placeholder="体脂肪率"
                    onClick={() => setActiveField('bodyFat')}
                    className={`pr-12 cursor-pointer ${
                      activeField === 'bodyFat' ? 'ring-2 ring-pink-400 border-pink-400' : ''
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              </div>
            </div>
          </AuthCard>

          {/* 下部カード：テンキーパッド + OKボタン */}
          <AuthCard>
            <div className="flex flex-col gap-4">
              <NumberPad
                onInput={handleInput}
                onDelete={handleDelete}
                onDecimal={handleDecimal}
              />

              {/* OKボタン */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-[#FF9BAA] hover:bg-[#FF6B8A] text-gray-800 rounded-lg"
              >
                OK
              </Button>
            </div>
          </AuthCard>
        </div>
      </main>

      {/* 下部ナビゲーション */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}