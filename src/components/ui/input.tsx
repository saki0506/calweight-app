import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // 基本スタイル - グレー背景、丸角
        "flex h-12 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-sm shadow-xs transition-shadow outline-none",
        // プレースホルダー
        "placeholder:text-gray-400",
        // フォーカス時 - ピンクのリング
        "focus-visible:ring-[3px] focus-visible:ring-pink-400/50 focus-visible:border-pink-400",
        // 無効時
        "disabled:cursor-not-allowed disabled:opacity-50",
        // エラー時
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        // ファイル入力
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // ダークモード
        "dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }