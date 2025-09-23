
'use client';

import { useState } from 'react';
import { useApp, AppUser, Commerce } from '@/app/(app)/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/app/(app)/logo';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { setUser, setCurrentView } = useApp();
  const [email, setEmail] = useState('onz@live.fr');
  const [password, setPassword] = useState('06034434mg');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // SuperAdmin check first (local)
    if (email === 'onz@live.fr' && password === '06034434mg') {
      setUser({ 
        id: 'sa1', 
        name: 'Super Admin', 
        email, 
        role: 'SuperAdmin',
        isSuperAdmin: true,
      });
      setCurrentView('superadmin');
      setIsLoading(false);
      return;
    }

    // Attempt to log in with Supabase Auth (or check against commerces table)
    // For simplicity, we'll check the commerces table directly.
    // A more robust solution would use Supabase Auth.
    const { data: commerceUser, error } = await supabase
      .from('commerces')
      .select('*')
      .eq('ownerEmail', email)
      .single();

    if (error || !commerceUser || commerceUser.password !== password) {
        toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "Email ou mot de passe incorrect.",
        });
        setIsLoading(false);
        return;
    }

    if (commerceUser.subscription === 'Inactive') {
        toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Votre compte est inactif. Veuillez contacter l'administrateur de la plateforme.",
        });
        setIsLoading(false);
        return;
    }

    setUser({
        id: commerceUser.id,
        name: commerceUser.ownerName,
        email: commerceUser.ownerEmail,
        role: 'Owner',
        isSuperAdmin: false,
        commerceId: commerceUser.id,
        commerceName: commerceUser.name,
        ownerEmail: commerceUser.ownerEmail,
    });
    setCurrentView('pos');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-gray-800 border-gray-700">
        <CardHeader className="text-center flex flex-col items-center gap-6 pt-10">
            <Logo />
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              disabled={isLoading}
            />
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
