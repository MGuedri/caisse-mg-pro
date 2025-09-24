
'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function signIn(formData: FormData) {
  try {
    // 🔍 Vérification explicite des variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Variables Supabase manquantes dans process.env');
      return { error: 'Erreur de configuration serveur : Clés Supabase manquantes.' };
    }

    // 🔍 Tentative d'initialisation
    let supabase;
    const cookieStore = cookies();
    try {
        supabase = createServerClient(
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
        );
    } catch (initError: any) {
      console.error('❌ Échec initialisation Supabase:', initError);
      return { error: `Erreur serveur inattendue: ${initError.message}` };
    }

    // 🔍 Extraction des données
    const email = String(formData.get('email')).trim();
    const password = String(formData.get('password'));

    if (!email || !password) {
      return { error: 'Veuillez remplir tous les champs.' };
    }

    // 🔍 Appel d'authentification
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.warn('⚠️ Erreur Supabase:', error.message);
      // Retourne le message d'erreur brut de Supabase
      return { error: `Erreur Supabase: ${error.message}` };
    }

    return { error: null };

  } catch (unexpectedError: any) {
    // 🔥 Ce bloc attrape TOUTE exception non gérée
    console.error('💥 Erreur critique dans Server Action:', unexpectedError);
    return { error: `Erreur serveur inattendue: ${unexpectedError.message}` };
  }
};


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
