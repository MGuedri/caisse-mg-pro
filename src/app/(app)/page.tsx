
'use client';

import React from 'react';
import { useApp } from '@/app/(app)/app-provider';
import { POSScreen } from '@/app/(app)/pos/pos-screen';
import { DashboardScreen } from '@/app/(app)/dashboard/dashboard-screen';
import { InventoryScreen } from '@/app/(app)/inventory/inventory-screen';
import { ManagementScreen } from '@/app/(app)/management/management-screen';
import { LoginScreen } from '@/app/(app)/login';

// This component determines which view to show based on the user's role and the current view state.
const ActiveView = () => {
  const { user, currentView, setCurrentView } = useApp();

  // Set initial view based on user role when the component mounts or user changes.
  React.useEffect(() => {
    if (user) {
        // The layout handles the SuperAdmin case. This component will only render
        // for regular users, so we can safely set their default view.
        if (user.role === 'Owner') {
            setCurrentView('dashboard');
        } else if (user.role === 'Caissier') {
            setCurrentView('pos');
        }
    }
  }, [user, setCurrentView]);

  // The AppShell in the layout handles the !user and isSuperAdmin cases.
  // We only need to render the view for a logged-in, regular user.
  if (!user || user.isSuperAdmin) {
    // This part should not be reached if the layout is working correctly.
    // SuperAdminScreen is rendered in the layout.
    // LoginScreen is also handled by the layout.
    return null;
  }
  
  // Render the current view for normal users
  switch (currentView) {
    case 'pos':
      return <POSScreen />;
    case 'dashboard':
      return <DashboardScreen />;
    case 'products':
      return <InventoryScreen />;
    case 'management':
      return <ManagementScreen />;
    default:
      // Fallback default view if `currentView` is not set.
      return user.role === 'Owner' ? <DashboardScreen /> : <POSScreen />;
  }
}


export default function HomePage() {
  const { user } = useApp();

  // The layout contains the AppProvider and the main AppShell.
  // The layout will show LoginScreen if there is no user.
  if (!user) {
      // While AppProvider is handling login state, returning null here
      // prevents trying to render client components that need the user.
      // The LoginScreen is rendered by the layout's AppShell.
      return null;
  }
  
  return <ActiveView />;
}

