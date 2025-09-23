'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, LogOut } from 'lucide-react';
import { Logo } from '../(app)/logo';

interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    role?: string;
    commerceId?: string;
    isSuperAdmin?: boolean;
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState('onz@live.fr');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Vérifier si déjà connecté au chargement
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const { session } = await res.json();
          if (session?.user) {
            router.push('/');
          }
        }
      } catch (err) {
        console.log('No active session or network error');
      }
    };
    checkSession();
  }, [router]);

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
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password.trim() 
        }),
      });

      let result: AuthResult;
      try {
        result = await response.json();
      } catch (jsonError) {
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }
      
      if (result.success && result.user) {
        setSuccess(true);
        setError(null);
        
        // Redirection côté client (safe)
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1500);

      } else {
        setError(result.error || 'Identifiants invalides');
        setSuccess(false);
      }
    } catch (err: any) {
      console.error('Erreur lors de la connexion:', err);
      setError(
        err.message.includes('Network error') 
          ? 'Erreur réseau — vérifiez votre connexion' 
          : err.message.includes('Invalid JSON')
            ? 'Erreur serveur — veuillez réessayer'
            : err.message || 'Erreur de connexion. Veuillez réessayer.'
      );
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="text-center space-y-4 pt-8">
          <div className="mx-auto w-20 h-20 bg-transparent rounded-full flex items-center justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Caisse MG Pro</CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Message d'erreur */}
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-600/20 border-red-600 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-medium">Erreur de connexion</AlertTitle>
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          {/* Message de succès */}
          {success && (
            <Alert className="mb-6 bg-green-600/20 border-green-600 text-green-300">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle className="font-medium">Connexion réussie !</AlertTitle>
              <AlertDescription className="text-xs">Bienvenue, redirection en cours...</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || success}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 rounded-lg py-6 px-4"
                placeholder="Email"
              />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || success}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 rounded-lg py-6 px-4"
                placeholder="Mot de passe"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-6 text-base transition-all disabled:opacity-70 rounded-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connexion...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Connecté !
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-6 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              ✅ Compatible Firebase Studio • Aucun redirect serveur
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
