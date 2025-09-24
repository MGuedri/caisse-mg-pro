'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function signIn(formData: FormData) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Auth Error: Missing Supabase environment variables.');
      return { error: 'Erreur de configuration serveur : Clés Supabase manquantes.' };
    }

    const email = String(formData.get('email')).trim();
    const password = String(formData.get('password'));

    if (!email || !password) {
      return { error: 'Veuillez remplir tous les champs.' };
    }
    
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Directly return the raw, potentially more informative, error message.
      return { error: `Erreur Supabase: ${error.message}` };
    }

    return { error: null };

  } catch (unexpectedError: any) {
    console.error('Critical Server Action Error in signIn:', unexpectedError);
    return { error: `Erreur serveur inattendue: ${unexpectedError.message}` };
  }
};


export async function signOut() {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: '', ...options })
                },
            },
        }
    );
    await supabase.auth.signOut();
}
