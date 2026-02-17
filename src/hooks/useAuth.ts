// src/hooks/useAuth.ts
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface SignUpData {
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * ユーザー登録フック
 */
export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async ({ email, password }: SignUpData) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading, error };
}

/**
 * ログインフック
 */
export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async ({ email, password }: SignInData) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, isLoading, error };
}

/**
 * ログアウトフック
 */
export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { signOut, isLoading, error };
}

/**
 * 現在のユーザー取得フック
 */
export function useGetCurrentUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;

      return user;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { getCurrentUser, isLoading, error };
}