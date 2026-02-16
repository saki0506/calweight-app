import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { GoalWeightContent } from './_components/goal-weight-content';

export default async function GoalWeightPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims?.sub) {
    redirect('/login');
  }

  return <GoalWeightContent />;
}