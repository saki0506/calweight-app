import { redirect } from 'next/navigation';
import { checkProfileSetup } from '@/lib/profile';
import { createClient } from '@/lib/supabase/server';
import { ProfileSetupContent } from './_components/profile-setup-content';

export default async function ProfileSetupPage() {
  const supabase = await createClient();
  const { user } = await supabase.auth.getClaims();

  if (!user) {
    redirect('/login');
  }

  const isComplete = await checkProfileSetup(user.sub);
  if (isComplete) {
    redirect('/dashboard');
  }

  return <ProfileSetupContent />;
}