// src/app/records/_components/schema.ts
import { z } from "zod";

export const editRecordSchema = z.object({
  weight: z
    .string()
    .min(1, "体重を入力してください")
    .refine((val) => !isNaN(Number(val)), "数値を入力してください")
    .refine((val) => Number(val) >= 20, "20kg以上で入力してください")
    .refine((val) => Number(val) <= 300, "300kg以下で入力してください"),
  fat: z
    .string()
    .refine((val) => val === "" || !isNaN(Number(val)), "数値を入力してください")
    .refine((val) => val === "" || Number(val) >= 1, "1%以上で入力してください")
    .refine((val) => val === "" || Number(val) <= 60, "60%以下で入力してください"),
});

export type EditRecordFormValues = z.infer<typeof editRecordSchema>;