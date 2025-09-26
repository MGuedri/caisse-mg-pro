
'use client';

import React from 'react';
import { useApp } from '@/app/(app)/app-provider';
import { POSScreen } from '@/app/(app)/pos/pos-screen';
import { DashboardScreen } from '@/app/(app)/dashboard/dashboard-screen';
import { InventoryScreen } from '@/app/(app)/inventory/inventory-screen';
import { ManagementScreen } from '@/app/(app)/management/management-screen';
import { SuperAdminScreen } from '@/app/(app)/superadmin/screen';
import { LoginScreen } from '@/app/(app)/login';

const PageContent: React.FC = () => {
    const { user, currentView, setCurrentView } = useApp();

    React.useEffect(() => {
        if (user) {
            if (user.isSuperAdmin) {
                // Pas de vue par défaut, géré par le layout
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
    
    if (user.isSuperAdmin) {
        return <SuperAdminScreen />;
    }

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
             // Fallback view for owner or cashier if currentView is not set
            if (user.role === 'Owner') return <DashboardScreen />;
            return <POSScreen />;
    }
}

export default function AppRootPage() {
    return <PageContent />;
}
