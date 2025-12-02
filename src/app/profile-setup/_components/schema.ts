//src/app/profile-setup/_components/schema.ts
import { z } from 'zod';

export const profileSetupSchema = z.object({
  name: z
    .string()
    .min(1, '名前は必須です')
    .min(2, '名前は2文字以上で入力してください')
    .max(50, '名前は50文字以下で入力してください'),
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

export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;