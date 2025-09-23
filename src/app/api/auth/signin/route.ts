'use server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  console.log('🚀 API Route: Starting authentication for', email);

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: 'Email et mot de passe requis' },
      { status: 400 }
    );
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });

    console.log('🔐 Attempting authentication...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error('❌ Supabase auth error:', error.message);
      
      let errorMessage = 'Erreur de connexion';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Veuillez confirmer votre email';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Trop de tentatives. Patientez quelques minutes.';
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 }
      );
    }

    if (!data.user) {
      console.error('❌ No user data returned');
      return NextResponse.json(
        { success: false, error: 'Aucune donnée utilisateur' },
        { status: 401 }
      );
    }

    console.log('✅ Authentication successful for:', data.user.email);

    // Retourner le succès sans redirection
    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        // Ajoutez d'autres champs si nécessaire
      }
    });

  } catch (error: any) {
    console.error('💥 API Route error:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur lors de l\'authentification' 
      },
      { status: 500 }
    );
  }
}
