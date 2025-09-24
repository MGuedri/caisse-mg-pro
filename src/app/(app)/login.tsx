
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            disabled={pending}
        >
            {pending ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Se connecter'}
        </Button>
    )
}

export const LoginScreen = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                body: new FormData(e.currentTarget),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Erreur de connexion');
            }
            
            // On success, refresh the page. The layout will re-render and show the app.
            router.refresh();

        } catch (err: any) {
            setError(err.message || 'Erreur de connexion. Vérifiez la console pour plus de détails.');
        } finally {
            setIsPending(false);
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
                {error}
              </div>
            )}
    
            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="exemple@email.com"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
              </div>
    
              <div>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••••"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
              </div>
    
              <SubmitButton pending={isPending} />

            </form>
          </div>
        </div>
      );
}
