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
  User,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SyncStatus } from '@/components/sync-status';
import { useEffect } from 'react';
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const NewLogo = ({ size = 'lg' }: { size?: 'sm' | 'lg' }) => {
  const containerSize = size === 'lg' ? 'w-48 h-48' : 'w-10 h-10';
  const mgSize = size === 'lg' ? 'text-7xl' : 'text-xl';
  const textSize = size === 'lg' ? 'text-xs' : 'text-[4px]';
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
        <span className={`${mgSize} text-cyan-400 transform translate-x-px translate-y-px`}>MG</span>
        <span className={`absolute ${mgSize} text-white`}>MG</span>
      </div>

       {/* Decorative Texts */}
       <span className={`absolute top-[21%] transform -skew-y-6 ${textSize} text-gray-900 tracking-wider`}>{cafeText}</span>
       <span className={`absolute bottom-[23%] ${textSize} text-gray-900 tracking-wider`}>{plaisirText}</span>

        {/* Sparkles */}
       {size === 'lg' && (
         <>
            <div className={`absolute top-[30%] left-[10%] w-3 h-3 bg-white transform rotate-45`}>
              <div className="absolute w-full h-[2px] top-1/2 -translate-y-1/2 bg-gray-900"></div>
              <div className="absolute h-full w-[2px] left-1/2 -translate-x-1/2 bg-gray-900"></div>
            </div>
            <div className={`absolute top-[30%] right-[10%] w-3 h-3 bg-white transform rotate-45`}>
              <div className="absolute w-full h-[2px] top-1/2 -translate-y-1/2 bg-gray-900"></div>
              <div className="absolute h-full w-[2px] left-1/2 -translate-x-1/2 bg-gray-900"></div>
            </div>
            <div className={`absolute bottom-[10%] left-[20%] w-2 h-2 bg-white transform rotate-45`}>
              <div className="absolute w-full h-[1px] top-1/2 -translate-y-1/2 bg-gray-900"></div>
              <div className="absolute h-full w-[1px] left-1/2 -translate-x-1/2 bg-gray-900"></div>
            </div>
            <div className={`absolute bottom-[10%] right-[20%] w-2 h-2 bg-white transform rotate-45`}>
              <div className="absolute w-full h-[1px] top-1/2 -translate-y-1/2 bg-gray-900"></div>
              <div className="absolute h-full w-[1px] left-1/2 -translate-x-1/2 bg-gray-900"></div>
            </div>
         </>
       )}
    </div>
  );
};


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
            <NewLogo size="sm" />
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
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <SyncStatus />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt={user.name} />
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
                     <div className="flex items-center gap-2">
                       <Building className="h-4 w-4 text-gray-400"/>
                       <p className="text-xs leading-none text-gray-400">Café Mon Plaisir</p>
                    </div>
                     <div className="flex items-center gap-2">
                       <p className="text-xs leading-none text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700"/>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:!bg-orange-500/80">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
