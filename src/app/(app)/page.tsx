
'use client';

import React from 'react';
import { useApp } from '@/app/(app)/app-provider';
import { POSScreen } from '@/app/(app)/pos/pos-screen';
import { DashboardScreen } from '@/app/(app)/dashboard/dashboard-screen';
import { InventoryScreen } from '@/app/(app)/inventory/inventory-screen';
import { ManagementScreen } from '@/app/(app)/management/management-screen';
// import { SuperAdminScreen } from '@/app/(app)/superadmin/screen'; // Temporairement désactivé
import { LoginScreen } from '@/app/(app)/login';
import {
  ShoppingCart,
  LayoutGrid,
  Package,
  Users,
  LogOut,
  User,
  Building,
  Shield,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/app/(app)/logo';
import { SyncStatusItem } from '@/components/sync-status-item';
import { useRouter } from 'next/navigation';
import { signOut } from '@/app/actions/auth';


const handleSignOut = async (router: any) => {
    await signOut();
    router.refresh();
};

// =======================================================
// PAGE DE MAINTENANCE TEMPORAIRE POUR SUPER ADMIN
// =======================================================
const SuperAdminMaintenanceScreen: React.FC = () => {
  const { user } = useApp();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="flex items-center gap-2 text-orange-400">
            <Shield className="h-5 w-5" />
            <h1 className="text-xl font-bold">Super Admin (Maintenance)</h1>
          </div>
        </div>
        <Button onClick={() => handleSignOut(router)} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Base de code en cours de fiabilisation.</h2>
        <p className="text-gray-400 max-w-md">
          Nous avons appliqué une modification majeure pour stabiliser l'application. 
          Le déploiement a réussi. La prochaine étape va restaurer l'interface de gestion complète.
        </p>
      </main>
    </div>
  );
};


// --- NAVIGATION PRINCIPALE ---
const MainApp: React.FC = () => {
  const { user, currentView, setCurrentView } = useApp();
  const router = useRouter();

  const navigation = [
    { id: 'pos', label: 'Caisse', icon: ShoppingCart, allowedRoles: ['Owner', 'Caissier'] },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, allowedRoles: ['Owner'] },
    { id: 'products', label: 'Inventaire', icon: Package, allowedRoles: ['Owner'] },
    { id: 'management', label: 'Gestion', icon: Users, allowedRoles: ['Owner'] },
  ];

  if (!user) {
    // This case should ideally not be hit if layout protects correctly, but as a fallback.
    return <LoginScreen />;
  }
  
  if (user.isSuperAdmin) {
     // AFFICHE L'ÉCRAN DE MAINTENANCE SÉCURISÉ
     return <SuperAdminMaintenanceScreen />;
  }

  const visibleNav = navigation.filter(item => item.allowedRoles.includes(user.role));

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Logo size="sm" />
            <nav className="flex gap-1">
              {visibleNav.map(item => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => setCurrentView(item.id)}
                  size="sm"
                  className={`
                    ${currentView === item.id 
                      ? "bg-orange-500 hover:bg-orange-600 text-white" 
                      : "text-gray-300 hover:bg-gray-700"}
                    flex items-center gap-2
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-gray-800 border-gray-700 text-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2 p-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400"/>
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                    </div>
                     {user.commerceName && <div className="flex items-center gap-2">
                       <Building className="h-4 w-4 text-gray-400"/>
                       <p className="text-xs leading-none text-gray-400">{user.commerceName}</p>
                    </div>}
                     <div className="flex items-center gap-2">
                       <p className="text-xs leading-none text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700"/>
                <SyncStatusItem />
                <DropdownMenuSeparator className="bg-gray-700"/>
                <DropdownMenuItem 
                  onClick={() => handleSignOut(router)} 
                  className="cursor-pointer hover:!bg-orange-500/80"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto h-[calc(100vh-65px)]">
        {currentView === 'pos' && <POSScreen />}
        {currentView === 'dashboard' && <DashboardScreen />}
        {currentView === 'products' && <InventoryScreen />}
        {currentView === 'management' && <ManagementScreen />}
      </main>

    </div>
  );
};

export default function HomePage() {
  const { user, setCurrentView } = useApp();
  
  React.useEffect(() => {
    if (user && !user.isSuperAdmin && user.role === 'Owner') {
      setCurrentView('dashboard');
    }
  }, [user, setCurrentView]);

  if (!user) {
    return <LoginScreen />;
  }
  return <MainApp />;
}
