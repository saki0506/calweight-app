'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthCard } from '@/components/ui/auth-card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { goalWeightSchema, type GoalWeightFormData } from './schema';
import { updateTargetWeight } from '@/lib/user';
import { toast } from 'sonner';

export function GoalWeightContent() {
  const router = useRouter();

  const form = useForm<GoalWeightFormData>({
    resolver: zodResolver(goalWeightSchema),
    defaultValues: {
      targetWeight: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: GoalWeightFormData) => updateTargetWeight(data),
    onSuccess: () => {
      toast.success('目標体重を設定しました');
      router.push('/weight-input');
    },
  });

  const onSubmit = (data: GoalWeightFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthCard>
        <div className="flex flex-col items-center gap-8 w-full py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <div className="space-y-8">
                <FormLabel>目標体重を入力してください。</FormLabel>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="targetWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>目標体重</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="65.0"
                            step="0.1"
                            disabled={mutation.isPending}
                            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {mutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    {mutation.error instanceof Error
                      ? mutation.error.message
                      : 'エラーが発生しました'}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-[#FF9BAA] hover:bg-[#FF6B8A] text-gray-800 rounded-lg"
              >
                {mutation.isPending ? '保存中...' : 'OK'}
              </Button>
            </form>
          </Form>
        </div>
      </AuthCard>
    </div>
  );
}