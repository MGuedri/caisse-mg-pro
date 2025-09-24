// src/app/login/page.tsx - SOLUTION SIMPLIFIÉE SANS API ROUTE
'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('onz@live.fr');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Simulation d'authentification pour test
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setSuccess(false);

    console.log('🚀 Début de la connexion');

    try {
      // Validation côté client d'abord
      if (!email.trim() || !password) {
        throw new Error('Veuillez remplir tous les champs');
      }

      if (!email.includes('@')) {
        throw new Error('Format d\'email invalide');
      }

      console.log('📧 Tentative de connexion pour:', email);

      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulation de vérification des credentials
      // En production, ceci serait remplacé par l'appel à votre API
      if (email === 'onz@live.fr' && password === 'test123') {
        console.log('✅ Credentials valides (simulation)');
        
        setSuccess(true);
        setError(null);
        
        // Simulation d'un utilisateur connecté
        const mockUser = {
          id: '12345',
          email: email,
          name: 'Utilisateur Test'
        };

        console.log('👤 Utilisateur simulé:', mockUser);

        setTimeout(() => {
          alert(`🎉 Connexion simulée réussie !\nBienvenue ${mockUser.email}\n\nEn production, ceci ferait appel à Supabase.`);
        }, 500);

      } else {
        console.log('❌ Credentials invalides (simulation)');
        throw new Error('Email ou mot de passe incorrect (utilisez onz@live.fr / test123 pour tester)');
      }

    } catch (err: any) {
      console.error('❌ Erreur:', err.message);
      setError(err.message);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">MG</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Caisse MG Pro</h1>
        </div>

        {/* Succès */}
        {success && (
          <div className="bg-green-600/20 border border-green-600 text-green-400 px-4 py-3 rounded mb-6 animate-pulse">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              <span className="font-medium">Connexion simulée réussie !</span>
            </div>
            <div className="text-sm mt-1 text-green-300">
              Test d'interface réussi
            </div>
          </div>
        )}

        {/* Erreurs */}
        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span className="font-medium">Erreur</span>
            </div>
            <div className="text-sm mt-1 text-red-300">{error}</div>
          </div>
        )}

        {/* Instructions de test */}
        <div className="mb-6 p-4 rounded-lg bg-yellow-600/20 border border-yellow-600 text-yellow-300 text-sm">
          <div className="font-medium mb-2">🧪 Mode Test (Simulation)</div>
          <div className="space-y-1">
            <div><strong>Email:</strong> onz@live.fr</div>
            <div><strong>Mot de passe:</strong> test123</div>
            <div className="text-xs mt-2 text-yellow-400">
              Cette version simule l'authentification sans appels réseau pour tester l'interface.
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Test en cours...
              </div>
            ) : success ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">✅</span>
                Test réussi
              </div>
            ) : (
              'Tester la connexion'
            )}
          </button>
        </form>

        {/* Informations de développement */}
        <div className="mt-6 p-3 rounded-lg bg-gray-700/50 text-xs text-gray-400">
          <div className="font-medium mb-2">💡 Étapes suivantes :</div>
          <div className="space-y-1">
            <div>1. ✅ Interface fonctionnelle</div>
            <div>2. 🔄 Intégrer l'authentification Supabase</div>
            <div>3. 🔄 Créer les Server Actions</div>
            <div>4. 🔄 Tester en production</div>
          </div>
        </div>
      </div>
    </div>
  );
}
