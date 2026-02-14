import { z } from 'zod';

export const goalWeightSchema = z.object({
  targetWeight: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      '目標体重は正の数値で入力してください'
    )
    .refine(
      (val) => Number(val) >= 20 && Number(val) <= 300,
      '目標体重は20kg〜300kgの範囲で入力してください'
    ),
});

export type GoalWeightFormData = z.infer<typeof goalWeightSchema>;