"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function TestPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(to bottom, #FFD1D7, #FFD1D7)' }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 space-y-6">
        <h2 className="text-xl font-bold text-center text-gray-800">
          コンポーネントテスト
        </h2>

        {/* Input テスト */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Email or Gmail
          </label>
          <Input type="email" placeholder="example@email.com" />
        </div>

        {/* Password Input + Checkbox テスト */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            パスワード
          </label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
          />
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="show-password"
              checked={showPassword}
              onCheckedChange={(checked) => setShowPassword(checked as boolean)}
            />
            <label
              htmlFor="show-password"
              className="text-sm text-gray-600 cursor-pointer"
            >
              パスワードを表示する
            </label>
          </div>
        </div>

        {/* Button テスト */}
        <div className="space-y-3">
          <Button
            className="w-full hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FF9BAA' }}
          >
            ログイン
          </Button>
          <Button variant="outline" className="w-full">
            新規登録
          </Button>
        </div>
      </div>
    </div>
  )
}