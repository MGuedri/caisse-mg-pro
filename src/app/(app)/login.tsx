
'use client';

import { useState } from 'react';
import { useApp } from '@/app/(app)/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/app/(app)/logo';
import { initialCommerces } from '@/lib/commerces';


export const LoginScreen: React.FC = () => {
  const { setUser, setCurrentView } = useApp();
  const [email, setEmail] = useState('onz@live.fr');
  const [password, setPassword] = useState('06034434mg');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'onz@live.fr' && password === '06034434mg') {
      setUser({ 
        id: 'sa1', 
        name: 'Super Admin', 
        email, 
        role: 'SuperAdmin',
        isSuperAdmin: true,
      });
      setCurrentView('superadmin');
      return;
    }

    const commerceUser = initialCommerces.find(c => c.ownerEmail === email && c.password === password);

    if (commerceUser) {
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
    } else {
      alert('Email ou mot de passe incorrect');
    }
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
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
