
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: 'Email et mot de passe requis' },
      { status: 400 }
    );
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error.message);
      
      let errorMessage = 'Erreur de connexion';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Veuillez confirmer votre email.';
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { success: false, error: 'Aucune donnée utilisateur reçue après la connexion.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      }
    });

  } catch (error: any) {
    console.error('API Route signin error:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur inattendue du serveur lors de l\'authentification.'
      },
      { status: 500 }
    );
  }
}
