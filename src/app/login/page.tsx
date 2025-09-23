
import { debugSignIn, testSupabaseConnection } from '@/app/actions/debug-auth';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Logo } from '../(app)/logo';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; details?: string };
}) {
  const supabase = createServerActionClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/');
  }

  const error = searchParams.error;
  const details = searchParams.details;
  
  // Test de connexion Supabase au chargement de la page
  const connectionTest = await testSupabaseConnection();
  
  let errorMessage = '';
  
  if (error) {
    switch (error) {
      case 'missing-credentials':
        errorMessage = 'Email et mot de passe requis';
        break;
      case 'invalid-credentials':
        errorMessage = 'Email ou mot de passe incorrect';
        break;
      case 'email-not-confirmed':
        errorMessage = 'Email non confirmé. Vérifiez votre boîte de réception.';
        break;
      case 'too-many-requests':
        errorMessage = 'Trop de tentatives. Attendez quelques minutes.';
        break;
      case 'no-user-data':
        errorMessage = 'Aucune donnée utilisateur reçue';
        break;
      case 'server-exception':
        errorMessage = `Erreur serveur: ${decodeURIComponent(details || 'Inconnue')}`;
        break;
      default:
        errorMessage = decodeURIComponent(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
            <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center mx-auto mb-4">
                <Logo />
            </div>
          <h1 className="text-2xl font-bold text-white">Caisse MG Pro</h1>
        </div>

        {/* Status de connexion Supabase */}
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          connectionTest.success 
            ? 'bg-green-600/20 border border-green-600 text-green-400'
            : 'bg-red-600/20 border border-red-600 text-red-400'
        }`}>
          <div className="font-medium">
            {connectionTest.success ? '✅ Connexion Supabase OK' : '❌ Problème Supabase'}
          </div>
          <div className="text-xs mt-1">{connectionTest.message}</div>
        </div>

        {/* Erreurs d'authentification */}
        {errorMessage && (
          <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span className="font-medium">Erreur de connexion</span>
            </div>
            <div className="text-sm mt-1 text-red-300">{errorMessage}</div>
          </div>
        )}

        {/* Variables d'environnement (debug) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 rounded-lg bg-blue-600/20 border border-blue-600 text-blue-400 text-xs">
            <div className="font-medium mb-1">🔧 Debug Info:</div>
            <div>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}</div>
            <div>SERVICE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌'}</div>
            <div>Environment: {process.env.NODE_ENV}</div>
          </div>
        )}

        <form action={debugSignIn} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue="onz@live.fr"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={!connectionTest.success}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {connectionTest.success ? 'Se connecter' : 'Connexion Supabase impossible'}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-400 text-sm">
          🔍 Mode debug activé - Vérifiez les logs serveur
        </div>
      </div>
    </div>
  );
}
