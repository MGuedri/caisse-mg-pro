
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function serverSignIn(formData: FormData): Promise<never> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    redirect('/login?error=missing-credentials');
  }

  const supabase = createServerActionClient({ cookies });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error('Sign in error:', error.message);
      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    if (!data.user) {
      redirect('/login?error=no-user-found');
    }

  } catch (error: any) {
    console.error('Server sign in error:', error);
    redirect('/login?error=server-error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function serverSignOut(): Promise<void> {
  const supabase = createServerActionClient({ cookies });
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
