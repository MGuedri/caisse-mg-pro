
'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const cookieStore = cookies();

  // Étape 1 : Vérification des variables d'environnement
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
      console.error('SERVER ACTION ERROR: Missing Supabase environment variables.');
      return { error: 'Erreur de configuration serveur : Clés Supabase manquantes.' };
  }

  try {
    // Utilisation du client JS standard pour l'authentification
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase Sign-in error:', error.message);
      if (error.message.includes('Invalid login credentials')) {
          return { error: 'Email ou mot de passe incorrect.' };
      }
      return { error: `Erreur Supabase: ${error.message}` };
    }
    
    // Si l'authentification réussit, nous devons définir la session dans les cookies manuellement.
    if(authData.session){
        const cookieClient = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options) {
                        cookieStore.set({ name, value: '', ...options })
                    }
                }
            }
        )
        await cookieClient.auth.setSession(authData.session)
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
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options) {
                    cookieStore.set({ name, value: '', ...options })
                }
            }
        }
    )
    await supabase.auth.signOut();
}
