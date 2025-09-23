
'use client';

import { useState } from 'react';
import { useApp, AppUser } from '@/app/(app)/app-provider';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/app/(app)/logo';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { signIn } from '@/app/actions/auth';

export const LoginScreen: React.FC = () => {
  const { setUser, setCurrentView } = useApp();
  const [email, setEmail] = useState('onz@live.fr');
  const [password, setPassword] = useState('06034434mg');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn(email, password);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: result.error,
      });
      setIsLoading(false);
      return;
    }

    if (result.user) {
      const appUser: AppUser = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role as 'SuperAdmin' | 'Owner',
        isSuperAdmin: result.user.isSuperAdmin,
        commerceId: result.user.commerceId,
        commerceName: result.user.commerceName,
        owneremail: result.user.email,
      };
      
      setUser(appUser);
      setCurrentView(appUser.isSuperAdmin ? 'superadmin' : 'pos');
    }

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
              autoComplete="email"
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              disabled={isLoading}
              autoComplete="current-password"
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
