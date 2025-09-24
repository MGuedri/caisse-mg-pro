
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  // Garde de vérification des variables d'environnement
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('SERVER ACTION ERROR: Missing Supabase environment variables.');
      return { error: 'Erreur de configuration serveur : Clés Supabase manquantes.' };
  }

  const supabase = createServerActionClient({ cookies });

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Supabase Sign-in error:', error.message);
    if (error.message.includes('Invalid login credentials')) {
        return { error: 'Email ou mot de passe incorrect.' };
    }
    // Retourner le message d'erreur réel de Supabase pour les autres cas
    return { error: error.message };
  }

  return { error: null };
}

export async function signOut() {
    const supabase = createServerActionClient({ cookies });
    await supabase.auth.signOut();
}
