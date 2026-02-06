'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryState } from 'nuqs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthCard } from '@/components/ui/auth-card';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { DateDisplay } from './date-display';
import { NumberPad } from './number-pad';
import { BottomNavigation, type TabId } from '@/components/ui/bottom-navigation';
import { weightInputSchema, type WeightInputFormData } from './schema';
import { useSaveWeightRecord } from '@/hooks/useWeight';

type ActiveField = 'weight' | 'bodyFat';

export function WeightInputContent() {
  const [activeField, setActiveField] = useState<ActiveField>('weight');
  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: 'edit' as TabId,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { mutate, isPending, error } = useSaveWeightRecord();

  const form = useForm<WeightInputFormData>({
    resolver: zodResolver(weightInputSchema),
    defaultValues: {
      weight: '',
      bodyFat: '',
    },
    mode: 'onChange',
    shouldFocusError: false,
  });

  const weight = form.watch('weight');
  const bodyFat = form.watch('bodyFat') || '';
  const currentValue = activeField === 'weight' ? weight : bodyFat;
  const errors = form.formState.errors;

  // 数字と小数点のみ許可するフィルター
  const filterNumericInput = (value: string): string => {
    let filtered = value.replace(/[^0-9.]/g, '');
    const parts = filtered.split('.');
    if (parts.length > 2) {
      filtered = parts[0] + '.' + parts.slice(1).join('');
    }
    if (filtered.length > 5) {
      filtered = filtered.slice(0, 5);
    }
    return filtered;
  };

  // setValue + trigger をまとめた関数
  const setFieldValue = (field: ActiveField, value: string) => {
    form.setValue(field, value);
    form.trigger(field);
  };

  // キーボード入力のハンドラ
  const handleKeyboardInput = (field: ActiveField, value: string) => {
    const filtered = filterNumericInput(value);
    setFieldValue(field, filtered);
  };

  const handleInput = (digit: string) => {
    const newValue = currentValue + digit;
    if (newValue.length > 5) return;
    if (isNaN(Number(newValue))) return;
    setFieldValue(activeField, newValue);
  };

  const handleDelete = () => {
    setFieldValue(activeField, currentValue.slice(0, -1));
  };

  const handleDecimal = () => {
    if (currentValue.includes('.')) return;
    if (currentValue === '') {
      setFieldValue(activeField, '0.');
    } else {
      setFieldValue(activeField, currentValue + '.');
    }
  };

  const onSubmit = (data: WeightInputFormData) => {
    mutate(
      {
        weight: Number(data.weight),
        fat: data.bodyFat ? Number(data.bodyFat) : null,
        date: selectedDate.toISOString(),
      },
      {
        onSuccess: () => {
          form.reset();
          setActiveField('weight');
        },
        onError: (err) => {
          console.error('保存エラー:', err);
        },
      }
    );
  };

  const onValidationError = () => {
    // 何もしない - 現在の選択を維持
  };

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24 md:pb-28">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onValidationError)}
            className="w-full max-w-sm md:max-w-md flex flex-col gap-3 md:gap-4"
          >
            {/* 上部カード：日付と入力フィールド */}
            <AuthCard>
              <div className="flex flex-col gap-3 md:gap-4">
                <DateDisplay date={selectedDate} onDateChange={setSelectedDate} />

                <div className="flex flex-col gap-2 md:gap-3">
                  {/* 体重入力 */}
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="体重"
                            inputMode="decimal"
                            onClick={() => setActiveField('weight')}
                            onChange={(e) => {
                              handleKeyboardInput('weight', e.target.value);
                              setActiveField('weight');
                            }}
                            className={`pr-12 ${
                              errors.weight
                                ? 'ring-2 ring-red-400 border-red-400'
                                : activeField === 'weight'
                                  ? 'ring-2 ring-pink-400 border-pink-400'
                                  : ''
                            }`}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                            kg
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 体脂肪率入力 */}
                  <FormField
                    control={form.control}
                    name="bodyFat"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="体脂肪率"
                            inputMode="decimal"
                            onClick={() => setActiveField('bodyFat')}
                            onChange={(e) => {
                              handleKeyboardInput('bodyFat', e.target.value);
                              setActiveField('bodyFat');
                            }}
                            className={`pr-12 ${
                              errors.bodyFat
                                ? 'ring-2 ring-red-400 border-red-400'
                                : activeField === 'bodyFat'
                                  ? 'ring-2 ring-pink-400 border-pink-400'
                                  : ''
                            }`}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                            %
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* エラーメッセージ */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error.message}</p>
                  </div>
                )}
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
                  type="submit"
                  className="w-full bg-[#FF9BAA] hover:bg-[#FF6B8A] text-gray-800 rounded-lg"
                  disabled={isPending}
                >
                  {isPending ? '保存中...' : 'OK'}
                </Button>
              </div>
            </AuthCard>
          </form>
        </Form>
      </main>

      <BottomNavigation activeTab={activeTab as TabId} onTabChange={handleTabChange} />
    </div>
  );
}