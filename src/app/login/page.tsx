'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { Logo } from '@/app/(app)/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

// Types
type AuthResult = {
  success: boolean;
  error?: string;
  user?: any;
};

export default function LoginPage() {
  const [email, setEmail] = useState('onz@live.fr');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Fonction d'authentification côté client qui appelle la Server Action
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Appel de la Server Action
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const result: AuthResult = await response.json();

      if (result.success) {
        setSuccess(true);
        setError(null);
        console.log('✅ Connexion réussie:', result.user?.email);
        
        // On rafraîchit la page pour que le layout serveur puisse récupérer la nouvelle session
        router.refresh();

      } else {
        setError(result.error || 'Erreur de connexion');
        setSuccess(false);
      }
    } catch (err: any) {
      console.error('Erreur lors de la connexion:', err);
      setError('Erreur de communication avec le serveur');
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center mx-auto mb-4">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-white">Caisse MG Pro</h1>
        </div>

        {/* Succès */}
        {success && (
          <div className="bg-green-600/20 border border-green-600 text-green-400 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              <span className="font-medium">Connexion réussie !</span>
            </div>
            <div className="text-sm mt-1 text-green-300">Redirection en cours...</div>
          </div>
        )}

        {/* Erreurs */}
        {error && !success && (
          <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span className="font-medium">Erreur de connexion</span>
            </div>
            <div className="text-sm mt-1 text-red-300">{error}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              type="email"
              name="email"
              placeholder="onz@live.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 disabled:opacity-50"
            />
          </div>

          <div>
            <Input
              type="password"
              name="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 disabled:opacity-50"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2"/>
                Connexion...
              </div>
            ) : success ? (
              '✅ Connecté'
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
