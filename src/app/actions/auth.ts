
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function serverSignIn(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const supabase = createServerActionClient({ cookies });

  if (!email || !password) {
    return redirect('/?error=missing-credentials');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign-in error:', error.message);
    // In a real app, you might want to distinguish between error types
    return redirect(`/?error=${encodeURIComponent(error.message)}`);
  }
  
  if (!data.user) {
    return redirect(`/?error=no-user-found`);
  }

  // On success, redirect to the main app page
  redirect('/');
}
