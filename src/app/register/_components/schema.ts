// src/app/register/_components/schema.ts
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください').max(255, 'パスワードは255文字以下で入力してください'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

const registerResolver = zodResolver(registerSchema);