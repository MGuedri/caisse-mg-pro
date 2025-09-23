'use client';

import { useState } from 'react';
import { useApp } from '@/app/(app)/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NewLogo = ({ size = 'lg' }: { size?: 'sm' | 'lg' }) => {
  const containerSize = size === 'lg' ? 'w-48 h-48' : 'w-12 h-12';
  const mgSize = size === 'lg' ? 'text-7xl' : 'text-2xl';
  const textSize = size === 'lg' ? 'text-xs' : 'text-[5px]';
  const cafeText = size === 'lg' ? 'Café' : 'C';
  const plaisirText = size === 'lg' ? 'Mon Plaisir' : 'MP';

  return (
    <div className={`relative ${containerSize} flex items-center justify-center font-bold font-headline`}>
      {/* Background shapes */}
      <div className="absolute inset-0 bg-gray-900 rounded-full"></div>
      
      {/* Top Arch */}
      <div className={`absolute top-0 w-[80%] h-[40%] rounded-b-full bg-orange-500`}></div>
      
      {/* Bottom Arch */}
      <div className={`absolute bottom-0 w-full h-[35%] rounded-t-full bg-orange-500`}></div>

      {/* Blue Banners */}
      <div className={`absolute top-[20%] w-[60%] h-[8%] bg-cyan-400 transform -skew-y-6`}></div>
       <div className={`absolute bottom-[22%] w-[70%] h-[8%] bg-cyan-400`}></div>

      {/* Main Text "MG" */}
      <div className="relative flex items-center justify-center">
        <span className={`${mgSize} text-cyan-400 transform translate-x-0.5 translate-y-0.5`}>MG</span>
        <span className={`absolute ${mgSize} text-white`}>MG</span>
      </div>

       {/* Decorative Texts */}
       <span className={`absolute top-[21%] transform -skew-y-6 ${textSize} text-gray-900 tracking-wider`}>{cafeText}</span>
       <span className={`absolute bottom-[23%] ${textSize} text-gray-900 tracking-wider`}>{plaisirText}</span>

      {/* Sparkles */}
      <div className={`absolute top-[30%] left-[10%] ${size === 'lg' ? 'w-3 h-3' : 'w-1 h-1'} bg-white transform rotate-45`}>
        <div className="absolute w-full h-[2px] top-1/2 -translate-y-1/2 bg-gray-900"></div>
        <div className="absolute h-full w-[2px] left-1/2 -translate-x-1/2 bg-gray-900"></div>
      </div>
      <div className={`absolute top-[30%] right-[10%] ${size === 'lg' ? 'w-3 h-3' : 'w-1 h-1'} bg-white transform rotate-45`}>
         <div className="absolute w-full h-[2px] top-1/2 -translate-y-1/2 bg-gray-900"></div>
        <div className="absolute h-full w-[2px] left-1/2 -translate-x-1/2 bg-gray-900"></div>
      </div>
       <div className={`absolute bottom-[10%] left-[20%] ${size === 'lg' ? 'w-2 h-2' : 'w-1 h-1'} bg-white transform rotate-45`}>
        <div className="absolute w-full h-[1px] top-1/2 -translate-y-1/2 bg-gray-900"></div>
        <div className="absolute h-full w-[1px] left-1/2 -translate-x-1/2 bg-gray-900"></div>
      </div>
        <div className={`absolute bottom-[10%] right-[20%] ${size === 'lg' ? 'w-2 h-2' : 'w-1 h-1'} bg-white transform rotate-45`}>
        <div className="absolute w-full h-[1px] top-1/2 -translate-y-1/2 bg-gray-900"></div>
        <div className="absolute h-full w-[1px] left-1/2 -translate-x-1/2 bg-gray-900"></div>
      </div>
    </div>
  );
};


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
        <CardHeader className="text-center flex flex-col items-center">
            <NewLogo />
          <CardTitle className="text-white text-2xl font-headline tracking-tight mt-4">Café Mon Plaisir</CardTitle>
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
