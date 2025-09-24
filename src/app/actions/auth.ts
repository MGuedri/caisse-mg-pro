
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const supabase = createServerActionClient({ cookies });

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign-in error:', error.message);
    if (error.message.includes('Invalid login credentials')) {
        return { error: 'Email ou mot de passe incorrect.' };
    }
    return { error: 'Une erreur est survenue lors de la connexion.' };
  }

  return { error: null };
}

export async function signOut() {
    const supabase = createServerActionClient({ cookies });
    await supabase.auth.signOut();
}
