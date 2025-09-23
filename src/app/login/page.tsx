
'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/app/(app)/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { serverSignIn } from '@/app/actions/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('onz@live.fr');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const router = useRouter();

    React.useEffect(() => {
        const urlError = searchParams.get('error');
        if (urlError) {
            let errorMessage = '';
             switch (urlError) {
                case 'missing-credentials':
                    errorMessage = 'Email et mot de passe requis.';
                    break;
                case 'no-user-found':
                    errorMessage = 'Aucun utilisateur trouvé.';
                    break;
                case 'server-error':
                    errorMessage = 'Erreur du serveur de connexion.';
                    break;
                default:
                    errorMessage = decodeURIComponent(urlError);
            }
            setError(errorMessage);
        }
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        startTransition(() => {
            serverSignIn(formData).catch(err => {
                // This will likely not be hit as server actions redirect,
                // but it's good practice for error handling.
                setError('Une erreur inattendue est survenue.');
            });
        });
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

                {error && (
                    <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded mb-6">
                        <div className="flex items-center">
                            <span className="mr-2">⚠️</span>
                            <span className="font-medium">Erreur de connexion</span>
                        </div>
                        <div className="text-sm mt-1 text-red-300">{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input
                            type="email"
                            name="email"
                            placeholder="onz@live.fr"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isPending}
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
                            disabled={isPending}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 disabled:opacity-50"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        {isPending ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin mr-2"/>
                                Connexion...
                            </div>
                        ) : (
                            'Se connecter'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
