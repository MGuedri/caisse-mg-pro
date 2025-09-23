'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function serverSignOut(): Promise<void> {
  const supabase = createServerActionClient({ cookies });
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function serverSignIn(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createServerActionClient({ cookies });

    if (!email || !password) {
        return redirect('/login?error=Email et mot de passe requis');
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Sign-in error:', error.message);
        return redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath('/', 'layout');
    return redirect('/');
}
