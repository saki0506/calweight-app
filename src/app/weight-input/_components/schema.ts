import { z } from 'zod';

export const weightInputSchema = z.object({
  weight: z
    .string()
    .min(1, '体重を入力してください')
    .refine((val) => !isNaN(Number(val)), '有効な数値を入力してください')
    .refine(
      (val) => Number(val) >= 30 && Number(val) <= 250,
      '体重は30kg〜250kgの範囲で入力してください'
    ),
  bodyFat: z
    .string()
    .refine(
      (val) => val === '' || !isNaN(Number(val)),
      '有効な数値を入力してください'
    )
    .refine(
      (val) => val === '' || (Number(val) >= 5 && Number(val) <= 60),
      '体脂肪率は5%〜60%の範囲で入力してください'
    )
    .optional(),
});

export type WeightInputFormData = z.infer<typeof weightInputSchema>;