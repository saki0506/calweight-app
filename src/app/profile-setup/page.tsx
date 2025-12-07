import { redirect } from 'next/navigation';
import { checkProfileSetup } from '@/lib/profile';
import { createClient } from '@/lib/supabase/server';
import { ProfileSetupContent } from './_components/profile-setup-content';

export default async function ProfileSetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const isComplete = await checkProfileSetup(user.id);
  if (isComplete) {
    redirect('/dashboard');
  }

  return <ProfileSetupContent />;
}