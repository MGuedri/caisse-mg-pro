
'use client';

import { useState } from 'react';
import { useApp, AppUser } from '@/app/(app)/app-provider';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

    const trimmedEmail = email.trim();

    // =======================================================
    // HARDCODED SUPERADMIN LOGIN 
    // =======================================================
    if (trimmedEmail === 'onz@live.fr') {
        setUser({
            id: 'super-admin-id',
            name: 'Super Admin',
            email: 'onz@live.fr',
            role: 'SuperAdmin',
            isSuperAdmin: true,
        });
        setCurrentView('superadmin');
        setIsLoading(false);
        return;
    }
    
    // =======================================================
    // Standard Owner Login
    // =======================================================
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', trimmedEmail);

    if (userError || !users || users.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Utilisateur non trouvé ou erreur réseau.",
      });
      setIsLoading(false);
      return;
    }

    const userData = users[0];

    // Direct password comparison (insecure, for prototyping only)
    if (userData.password !== password) {
       toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "Email ou mot de passe incorrect.",
        });
        setIsLoading(false);
        return;
    }

    // --- User authenticated, proceed with role check ---

    if (userData.role === 'Owner') {
        if (!userData.commerce_id) {
             toast({
                variant: "destructive",
                title: "Erreur de connexion",
                description: "Aucun commerce n'est associé à ce compte.",
            });
            setIsLoading(false);
            return;
        }

        const { data: commerceData, error: commerceError } = await supabase
            .from('commerces')
            .select('*')
            .eq('id', userData.commerce_id)
            .single();
        
        if (commerceError || !commerceData) {
             toast({
                variant: "destructive",
                title: "Erreur de Commerce",
                description: "Le commerce associé à ce compte est introuvable.",
            });
            setIsLoading(false);
            return;
        }

        if (commerceData.subscription === 'Inactive') {
            toast({
                variant: "destructive",
                title: "Accès refusé",
                description: "Votre abonnement est inactif. Veuillez contacter l'administrateur.",
            });
            setIsLoading(false);
            return;
        }

        setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: 'Owner',
            isSuperAdmin: false,
            commerceId: commerceData.id,
            commerceName: commerceData.name,
            owneremail: commerceData.owneremail,
        });
        setCurrentView('pos');
        setIsLoading(false);
        return;
    }
    
    toast({
        variant: "destructive",
        title: "Erreur de rôle",
        description: "Seuls les propriétaires de commerces peuvent se connecter ici.",
    });
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
