
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  // Étape 1 : Vérification des variables d'environnement
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('SERVER ACTION ERROR: Missing Supabase environment variables.');
      return { error: 'Erreur de configuration serveur : Clés Supabase manquantes.' };
  }

  try {
    // Étape 2 : Tentative de création du client Supabase
    const supabase = createServerActionClient({ cookies });

    // Étape 3 : Tentative d'authentification
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
      return { error: `Erreur Supabase: ${error.message}` };
    }

    // Étape 4 : Succès
    return { error: null };

  } catch (e: any) {
    // Étape 5 : Capture de toute autre exception
    console.error('CRITICAL SERVER ACTION ERROR:', e.message);
    return { error: `Erreur serveur inattendue: ${e.message}` };
  }
}

export async function signOut() {
    const supabase = createServerActionClient({ cookies });
    await supabase.auth.signOut();
}
