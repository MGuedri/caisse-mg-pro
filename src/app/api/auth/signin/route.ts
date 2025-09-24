
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🚀 API Route: Début de l\'authentification');

  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('📧 Email reçu:', email ? 'OUI' : 'NON');
    console.log('🔒 Mot de passe reçu:', password ? 'OUI' : 'NON');

    // Validation des entrées
    if (!email || !password) {
      console.log('❌ Données manquantes');
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Création du client Supabase
    console.log('🔧 Création du client Supabase...');
    const supabase = createRouteHandlerClient({ cookies });

    // Tentative de connexion
    console.log('🔐 Tentative de connexion...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    // Log de la réponse Supabase
    console.log('📤 Réponse Supabase:');
    console.log('- User:', data?.user ? '✅' : '❌');
    console.log('- Session:', data?.session ? '✅' : '❌'); 
    console.log('- Error:', error ? `❌ ${error.message}` : '✅ Aucune');

    // Gestion des erreurs Supabase
    if (error) {
      console.log('❌ Erreur Supabase:', error.message);
      
      let errorMessage = 'Erreur de connexion';
      
      // Messages d'erreur spécifiques
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Veuillez confirmer votre email';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Trop de tentatives. Patientez quelques minutes.';
      } else if (error.message.includes('User not found')) {
        errorMessage = 'Aucun compte trouvé avec cet email';
      } else {
        errorMessage = error.message;
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 }
      );
    }

    // Vérification de la présence de l'utilisateur
    if (!data.user) {
      console.log('❌ Aucune donnée utilisateur retournée');
      return NextResponse.json(
        { success: false, error: 'Aucune donnée utilisateur reçue' },
        { status: 401 }
      );
    }

    // Succès !
    console.log('✅ Connexion réussie pour:', data.user.email);
    
    const userResponse = {
      id: data.user.id,
      email: data.user.email,
    };

    return NextResponse.json({
      success: true,
      user: userResponse,
      message: 'Connexion réussie'
    });

  } catch (error: any) {
    console.error('💥 Erreur API Route:', error);
    console.error('💥 Stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur lors de l\'authentification',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Pour les autres méthodes HTTP
export async function GET() {
  return NextResponse.json(
    { error: 'Méthode non autorisée' },
    { status: 405 }
  );
}
