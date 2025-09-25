
'use client';

import React from 'react';
import { useApp } from '@/app/(app)/app-provider';
import { POSScreen } from '@/app/(app)/pos/pos-screen';
import { DashboardScreen } from '@/app/(app)/dashboard/dashboard-screen';
import { InventoryScreen } from '@/app/(app)/inventory/inventory-screen';
import { ManagementScreen } from '@/app/(app)/management/management-screen';
import { SuperAdminScreen } from '@/app/(app)/superadmin/screen';
import { LoginScreen } from '@/app/(app)/login';

// This component determines which view to show based on the user's role and the current view state.
const ActiveView = () => {
  const { user, currentView, setCurrentView } = useApp();

  // Set initial view based on user role when the component mounts or user changes.
  React.useEffect(() => {
    if (user) {
        if (user.isSuperAdmin) {
            // SuperAdmin view is handled by the layout now.
            // This component won't even render for SuperAdmin.
        } else if (user.role === 'Owner') {
            setCurrentView('dashboard');
        } else {
            setCurrentView('pos');
        }
    }
  }, [user, setCurrentView]);

  if (!user) {
    // Should be handled by the layout, but as a fallback.
    return <LoginScreen />;
  }

  if (user.isSuperAdmin) {
    // This case is now handled by the layout to prevent crashes.
    // The layout renders SuperAdminScreen directly.
    return <SuperAdminScreen />;
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
      // Default to POS for cashiers, dashboard for owners.
      return user.role === 'Owner' ? <DashboardScreen /> : <POSScreen />;
  }
}


export default function HomePage() {
  // This page now simply renders the ActiveView component.
  // All the layout shell (header, nav) is handled by `layout.tsx`.
  return <ActiveView />;
}
