
'use client';

import React from 'react';
import { useApp } from '@/app/(app)/app-provider';
import { LoginScreen } from '@/app/(app)/login';
import { MainApp } from '@/app/(app)/app-shell';

export default function HomePage() {
  const { user, setCurrentView } = useApp();
  
  React.useEffect(() => {
    if (user) {
        if (user.isSuperAdmin) {
            // L'écran SuperAdmin est géré directement par MainApp.
        } else if (user.role === 'Owner') {
            setCurrentView('dashboard');
        } else {
            setCurrentView('pos');
        }
    }
  }, [user, setCurrentView]);

  if (!user) {
    return <LoginScreen />;
  }
  
  return <MainApp />;
}
