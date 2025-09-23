
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function serverSignIn(formData: FormData): Promise<never> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createServerActionClient({ cookies });

    if (!email || !password) {
        return redirect('/login?error=missing-credentials');
    }
  
    const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
    });

    if (error) {
        console.error('Sign in error:', error.message);
        const errorMessage = error.message === 'Invalid login credentials' 
            ? 'Email ou mot de passe incorrect.'
            : 'Une erreur est survenue.';
        return redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
    }
    
    revalidatePath('/', 'layout');
    return redirect('/');
}


export async function serverSignOut(): Promise<void> {
  const supabase = createServerActionClient({ cookies });
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

    