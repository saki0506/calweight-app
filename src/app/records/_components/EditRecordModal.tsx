// src/app/records/_components/EditRecordModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { NumberPad } from "@/app/weight-input/_components/number-pad";
import { WeightRecordDto } from "../_types";
import { editRecordSchema, EditRecordFormValues } from "./schema";

const defaultValues: EditRecordFormValues = {
  weight: "",
  fat: "",
};

type Props = {
  record: WeightRecordDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ActiveField = "weight" | "fat";

export function EditRecordModal({ record, open, onOpenChange }: Props) {
  const [activeField, setActiveField] = useState<ActiveField>("weight");

  const form = useForm<EditRecordFormValues>({
    resolver: zodResolver(editRecordSchema),
    defaultValues,
    mode: "onChange",
  });

  const weight = form.watch("weight");
  const fat = form.watch("fat");
  const currentValue = activeField === "weight" ? weight : fat;
  const errors = form.formState.errors;

  useEffect(() => {
    if (record && open) {
      form.reset({
        weight: String(record.weight),
        fat: record.fat != null ? String(record.fat) : "",
      });
      setActiveField("weight");
    }
  }, [record, open, form]);

  // 数字と小数点のみ許可するフィルター
  const filterNumericInput = (value: string): string => {
    let filtered = value.replace(/[^0-9.]/g, "");
    const parts = filtered.split(".");
    if (parts.length > 2) {
      filtered = parts[0] + "." + parts.slice(1).join("");
    }
    if (filtered.length > 5) {
      filtered = filtered.slice(0, 5);
    }
    return filtered;
  };

  const setFieldValue = (field: ActiveField, value: string) => {
    form.setValue(field, value);
    form.trigger(field);
  };

  // PC/スマホキーボードからの入力
  const handleKeyboardInput = (field: ActiveField, value: string) => {
    const filtered = filterNumericInput(value);
    setFieldValue(field, filtered);
  };

  // テンキーからの入力
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
    if (currentValue.includes(".")) return;
    if (currentValue === "") {
      setFieldValue(activeField, "0.");
    } else {
      setFieldValue(activeField, currentValue + ".");
    }
  };

  const onSubmit = (data: EditRecordFormValues) => {
    // TODO: PR2で更新APIを実装する
    console.log("更新データ:", {
      id: record?.id,
      weight: Number(data.weight),
      fat: data.fat ? Number(data.fat) : null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>記録を編集</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="px-4 pb-4 flex flex-col gap-3">
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
                        onClick={() => setActiveField("weight")}
                        onFocus={() => setActiveField("weight")}
                        onChange={(e) => {
                          handleKeyboardInput("weight", e.target.value);
                        }}
                        className={`pr-12 ${
                          errors.weight
                            ? "ring-2 ring-red-400 border-red-400"
                            : activeField === "weight"
                              ? "ring-2 ring-pink-400 border-pink-400"
                              : ""
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

              <FormField
                control={form.control}
                name="fat"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="体脂肪率"
                        inputMode="decimal"
                        onClick={() => setActiveField("fat")}
                        onFocus={() => setActiveField("fat")}
                        onChange={(e) => {
                          handleKeyboardInput("fat", e.target.value);
                        }}
                        className={`pr-12 ${
                          errors.fat
                            ? "ring-2 ring-red-400 border-red-400"
                            : activeField === "fat"
                              ? "ring-2 ring-pink-400 border-pink-400"
                              : ""
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

            <div className="px-4 pb-4">
              <NumberPad
                onInput={handleInput}
                onDelete={handleDelete}
                onDecimal={handleDecimal}
              />
            </div>

            <div className="flex gap-2 p-4 pt-0">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#FF9BAA] hover:bg-[#FF6B8A] text-gray-800"
              >
                保存
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}