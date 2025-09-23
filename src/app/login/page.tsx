'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/app/(app)/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

// Actual response type from our new API route
type AuthResult = {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
  };
};

export default function LoginPage() {
  const [email, setEmail] = useState('onz@live.fr');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const result: AuthResult = await response.json();

      if (result.success && response.ok) {
        // On success, redirect to the main application page client-side
        router.push('/');
        router.refresh(); // Force a refresh to re-run server components and layout logic
      } else {
        setError(result.error || 'Une erreur de connexion est survenue.');
      }
    } catch (err: any) {
      console.error('Erreur lors de l\'appel de l\'API de connexion:', err);
      setError('Impossible de communiquer avec le serveur d\'authentification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center mx-auto mb-4">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-white">Caisse MG Pro</h1>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-300 px-4 py-3 rounded mb-6 text-sm">
            <div className="font-bold mb-1">Erreur de connexion</div>
            {error}
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
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-orange-600/50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
