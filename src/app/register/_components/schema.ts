// src/app/register/_components/schema.ts
import * as z from 'zod';

export const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;