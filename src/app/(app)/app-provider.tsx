'use client';

// ======================
// DEPENDENCIES & IMPORTS
// ======================
import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';

// ======================
// TYPES
// ======================
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  icon: string;
  commerce_id?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVip: boolean;
  credit: number;
  commerce_id?: string;
  avatar?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'Caissier' | 'Manager';
  salary: number;
  evaluation: number;
  schedule: string;
  workingDays: ('L' | 'M' | 'J' | 'V' | 'S' | 'D')[];
  joinDate: string;
  advance: number;
  balance: number;
  isTopEmployee: boolean;
  avatar: string;
  commerce_id?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  clientName: string;
  timestamp: string;
  cashierId: string;
  commerce_id?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  commerce_id?: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'Owner' | 'Caissier';
  isSuperAdmin: boolean;
  commerceId: string;
}

// ======================
// CONTEXTES
// ======================
type AppContextType = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  currentView: string;
  setCurrentView: (view: string) => void;
  includeVAT: boolean;
  setIncludeVAT: (include: boolean) => void;
  syncStatus: 'offline' | 'syncing' | 'synced' | 'error';
  lastSync: Date | null;
  syncNow: () => Promise<void>;
  isOnline: boolean;
};

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// ======================
// DONNÉES INITIALES
// ======================
const initialProducts: Product[] = [
  { id: '1', name: 'Café express', price: 1.7, category: 'Caffeinated Beverages', stock: 100, icon: '☕' },
  { id: '2', name: 'Capucin', price: 2.0, category: 'Caffeinated Beverages', stock: 100, icon: '☕' },
  { id: '3', name: 'Café direct', price: 1.7, category: 'Caffeinated Beverages', stock: 100, icon: '☕' },
  { id: '4', name: 'Café lait au chocolat', price: 1.2, category: 'Caffeinated Beverages', stock: 100, icon: '🍫' },
  { id: '5', name: 'Café filtre', price: 1.2, category: 'Caffeinated Beverages', stock: 100, icon: '☕' },
  { id: '6', name: 'Thé vert', price: 1.0, category: 'Tea', stock: 100, icon: '🍵' },
  { id: '7', name: 'Thé au menthe', price: 1.2, category: 'Tea', stock: 50, icon: '🍵' },
  { id: '8', name: 'Jus citron', price: 1.0, category: 'Fresh Juices', stock: 30, icon: '🍋' },
  { id: '9', name: 'Citron + menthe', price: 1.1, category: 'Fresh Juices', stock: 100, icon: '🍋' },
  { id: '10', name: 'Gazeuz', price: 1.5, category: 'Boissons', stock: 100, icon: '🥤' },
  { id: '11', name: 'Eau minérale 1.5 litre', price: 1.5, category: 'Boissons', stock: 100, icon: '💧' },
  { id: '12', name: 'Eau minérale 0.5 litre', price: 1.0, category: 'Boissons', stock: 100, icon: '💧' },
];

const initialClients: Client[] = [
  { id: '1', name: 'Issam Bayaoui', email: 'mg.06sbz@gmail.com', phone: '+216 20 123 456', isVip: true, credit: 0, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Ahmed Ben Ali', email: 'ahmed@email.com', phone: '+216 22 987 654', isVip: false, credit: 15.5, avatar: 'https://i.pravatar.cc/150?img=2' },
];

const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'Mourad',
    role: 'Caissier',
    salary: 800,
    evaluation: 4.2,
    schedule: '16:00 - 23:00',
    workingDays: ['L', 'M', 'J', 'V', 'S', 'D'],
    joinDate: '15/01/2023',
    advance: 100,
    balance: 700,
    isTopEmployee: true,
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '2',
    name: 'Fatma',
    role: 'Manager',
    salary: 1200,
    evaluation: 4.8,
    schedule: '10:00 - 18:00',
    workingDays: ['L', 'M', 'J', 'V', 'S'],
    joinDate: '01/03/2023',
    advance: 200,
    balance: 1000,
    isTopEmployee: true,
    avatar: 'https://i.pravatar.cc/150?img=4'
  }
];

// ======================
// APP PROVIDER
// ======================
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentView, setCurrentView] = useState<string>('login');
  const [includeVAT, setIncludeVAT] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'offline' | 'syncing' | 'synced' | 'error'>('offline');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : false);

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('caisse_mp_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setProducts(data.products || initialProducts);
        setClients(data.clients || initialClients);
        setEmployees(data.employees || initialEmployees);
        setOrders(data.orders || []);
        setExpenses(data.expenses || []);
      } catch (e) {
        console.error("Erreur chargement localStorage", e);
        setProducts(initialProducts);
        setClients(initialClients);
        setEmployees(initialEmployees);
      }
    } else {
      setProducts(initialProducts);
      setClients(initialClients);
      setEmployees(initialEmployees);
    }
  }, []);

  // Sauvegarde auto dans localStorage
  useEffect(() => {
    const data = {
      products,
      clients,
      employees,
      orders,
      expenses,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('caisse_mp_data', JSON.stringify(data));
  }, [products, clients, employees, orders, expenses]);

  // Détecter état réseau
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Synchroniser avec Supabase
  const syncNow = useCallback(async () => {
    if (!isOnline || !user) return;

    setSyncStatus('syncing');

    try {
      // NOTE: Supabase client is not initialized in this file. This will throw an error.
      // The user would need to provide Supabase URL and Key and initialize the client.
      console.log("Simulating Sync... Products:", products.length, "Orders:", orders.length);

      setSyncStatus('synced');
      setLastSync(new Date());
    } catch (error) {
      console.error('Erreur sync Supabase:', error);
      setSyncStatus('error');
    }
  }, [products, clients, employees, orders, expenses, user, isOnline]);

  // Auto-sync quand online
  useEffect(() => {
    if (isOnline && user) {
      syncNow();
    }
  }, [isOnline, user, syncNow]);

  // Sync périodique
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && user) syncNow();
    }, 60000);
    return () => clearInterval(interval);
  }, [syncNow, isOnline, user]);

  const value: AppContextType = {
    user, setUser,
    products, setProducts,
    cart, setCart,
    clients, setClients,
    employees, setEmployees,
    orders, setOrders,
    expenses, setExpenses,
    currentView, setCurrentView,
    includeVAT, setIncludeVAT,
    syncStatus, lastSync, syncNow, isOnline
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
