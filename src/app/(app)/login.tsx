'use client';

import { useState } from 'react';
import { useApp } from '@/app/(app)/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const LoginScreen: React.FC = () => {
  const { setUser, setCurrentView } = useApp();
  const [email, setEmail] = useState('mg.06sbz@gmail.com');
  const [password, setPassword] = useState('06034434mg');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'mg.06sbz@gmail.com' && password === '06034434mg') {
      setUser({ 
        id: '1', 
        name: 'Issam Bayaoui', 
        email, 
        role: 'SuperAdmin',
        isSuperAdmin: true,
        commerceId: 'default'
      });
      setCurrentView('pos');
    }
    // You can add more users here, e.g. for Mourad
    else {
      alert('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-900 flex items-center justify-center">
              <div className="relative h-full w-full">
                <div className="absolute left-0 top-0 h-full w-1/2 bg-orange-500" />
                <div className="absolute right-0 top-0 h-full w-1/2 bg-gray-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-bold text-5xl text-white mix-blend-overlay">MG</span>
                </div>
              </div>
            </div>
          <CardTitle className="text-white text-2xl font-headline tracking-tight">Café Mon Plaisir</CardTitle>
          <p className="text-gray-400">Connectez-vous à votre espace</p>
        </CardHeader>
        <CardContent className="pt-6">
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
