
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function debugSignIn(formData: FormData): Promise<never> {
  console.log('🚀 DEBUG: Starting sign in process');
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Debug: Vérification des données reçues
  console.log('📧 Email received:', email ? 'YES' : 'NO');
  console.log('🔒 Password received:', password ? 'YES' : 'NO');

  if (!email || !password) {
    console.log('❌ Missing credentials');
    redirect('/login?error=missing-credentials');
  }

  // Debug: Vérification des variables d'environnement
  console.log('🔧 ENV Check:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING');

  try {
    console.log('🔄 Creating Supabase client...');
    const supabase = createServerActionClient({ cookies });
    
    console.log('✅ Supabase client created successfully');
    
    console.log('🔐 Attempting sign in...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    // Debug détaillé de la réponse
    console.log('📤 Supabase Response:');
    console.log('- User:', data?.user ? 'YES' : 'NO');
    console.log('- Session:', data?.session ? 'YES' : 'NO');
    console.log('- Error:', error ? error.message : 'NONE');

    if (error) {
      console.log('❌ Auth error:', error.message);
      console.log('❌ Error details:', JSON.stringify(error, null, 2));
      
      // Messages d'erreur plus spécifiques
      let errorParam = 'unknown-error';
      if (error.message.includes('Invalid login credentials')) {
        errorParam = 'invalid-credentials';
      } else if (error.message.includes('Email not confirmed')) {
        errorParam = 'email-not-confirmed';
      } else if (error.message.includes('Too many requests')) {
        errorParam = 'too-many-requests';
      } else {
        errorParam = encodeURIComponent(error.message);
      }
      
      redirect(`/login?error=${errorParam}`);
    }

    if (!data.user) {
      console.log('❌ No user in response');
      redirect('/login?error=no-user-data');
    }

    console.log('✅ Sign in successful!');
    console.log('👤 User ID:', data.user.id);
    console.log('📧 User Email:', data.user.email);

    // Revalidation et redirection
    revalidatePath('/', 'layout');
    console.log('🔄 Revalidated paths');
    
    redirect('/');

  } catch (error: any) {
    console.error('💥 Server sign in error:', error);
    console.error('💥 Error stack:', error.stack);
    console.error('💥 Error details:', JSON.stringify(error, null, 2));
    
    redirect(`/login?error=server-exception&details=${encodeURIComponent(error.message)}`);
  }
}

export async function serverSignOut(): Promise<void> {
  const supabase = createServerActionClient({ cookies });
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}


// Version pour tester la connexion Supabase
export async function testSupabaseConnection(): Promise<{success: boolean, message: string}> {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    const supabase = createServerActionClient({ cookies });
    
    // Test simple : récupérer la session actuelle
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Supabase connection test failed:', error.message);
      return { success: false, message: `Connection failed: ${error.message}` };
    }
    
    console.log('✅ Supabase connection test passed');
    return { success: true, message: 'Connection successful' };
    
  } catch (error: any) {
    console.log('💥 Supabase connection test exception:', error.message);
    return { success: false, message: `Exception: ${error.message}` };
  }
}
