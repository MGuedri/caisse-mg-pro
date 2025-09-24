
'use client'
import { useSearchParams } from 'next/navigation';
import { serverSignIn } from '@/app/actions/auth';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
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
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    let errorMessage = '';
    if (error) {
        if (error.includes('Invalid login credentials')) {
            errorMessage = 'Email ou mot de passe incorrect.';
        } else if (error.includes('Email not confirmed')) {
            errorMessage = 'Veuillez confirmer votre adresse e-mail.';
        } else if (error === 'missing-credentials') {
            errorMessage = 'Veuillez saisir votre email et votre mot de passe.';
        }
        else {
            errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center mx-auto mb-4">
                <Logo />
              </div>
              <h1 className="text-2xl font-bold text-white">Caisse MG Pro</h1>
            </div>
    
            {errorMessage && (
              <div className="bg-red-600/20 border border-red-600 text-red-300 px-4 py-3 rounded mb-6 text-sm">
                {errorMessage}
              </div>
            )}
    
            <form action={serverSignIn} className="space-y-6">
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
    
              <SubmitButton />

            </form>
          </div>
        </div>
      );
}
