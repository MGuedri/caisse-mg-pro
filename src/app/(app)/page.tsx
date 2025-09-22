'use client';

import { AppProvider, useApp } from '@/app/(app)/app-provider';
import { LoginScreen } from '@/app/(app)/login';
import { POSScreen } from '@/app/(app)/pos/pos-screen';
import { DashboardScreen } from '@/app/(app)/dashboard/dashboard-screen';
import { InventoryScreen } from '@/app/(app)/inventory/inventory-screen';
import { ManagementScreen } from '@/app/(app)/management/management-screen';
import {
  ShoppingCart,
  LayoutGrid,
  Package,
  Users,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SyncStatus } from '@/components/sync-status';
import { useEffect } from 'react';
import Image from 'next/image'

// --- NAVIGATION PRINCIPALE ---
const MainApp: React.FC = () => {
  const { user, setUser, currentView, setCurrentView } = useApp();

  const navigation = [
    { id: 'pos', label: 'Caisse', icon: ShoppingCart, allowedRoles: ['SuperAdmin', 'Owner', 'Caissier'] },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, allowedRoles: ['SuperAdmin', 'Owner'] },
    { id: 'products', label: 'Inventaire', icon: Package, allowedRoles: ['SuperAdmin', 'Owner'] },
    { id: 'management', label: 'Gestion', icon: Users, allowedRoles: ['SuperAdmin', 'Owner'] },
  ];

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  useEffect(() => {
    if (!user) {
      setCurrentView('login');
    }
  }, [user, setCurrentView]);

  if (currentView === 'login' || !user) {
    return <LoginScreen />;
  }
  
  const visibleNav = navigation.filter(item => item.allowedRoles.includes(user.role));

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-orange-500">MP</div>
            <nav className="flex gap-1">
              {visibleNav.map(item => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => setCurrentView(item.id)}
                  className={`
                    ${currentView === item.id 
                      ? "bg-orange-500 hover:bg-orange-600 text-white" 
                      : "text-gray-300 hover:bg-gray-700"}
                    flex items-center gap-2
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <SyncStatus />
            <div className="hidden sm:flex items-center gap-2">
              <Image src="https://i.pravatar.cc/150?u=issam" alt={user.name} width={32} height={32} className="rounded-full"/>
              <div>
                 <span className="font-medium text-sm">{user.name}</span>
                 <Badge className="ml-2 bg-blue-600 text-white text-xs">{user.role}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-300 hover:bg-gray-700">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {currentView === 'pos' && <POSScreen />}
        {currentView === 'dashboard' && <DashboardScreen />}
        {currentView === 'products' && <InventoryScreen />}
        {currentView === 'management' && <ManagementScreen />}
      </main>

    </div>
  );
};

// ======================
// EXPORT FINAL
// ======================
export default function HomePage() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
