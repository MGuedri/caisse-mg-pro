
'use client';

// ======================
// DEPENDENCIES & IMPORTS
// ======================
import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { initialProducts, initialClients, initialEmployees, initialOrders, initialExpenses } from '@/lib/initial-data';

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
  commerce_id: string;
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
  commerce_id: string;
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
  commerce_id: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  clientName: string;
  timestamp: string;
  cashierId: string;
  commerce_id: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  commerce_id: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'Owner' | 'Caissier';
  isSuperAdmin: boolean;
  commerceId: string;
  commerceName: string;
  ownerEmail?: string;
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
  const [includeVAT, setIncludeVAT] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'offline' | 'syncing' | 'synced' | 'error'>('offline');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : false);

  const getLocalStorageKey = (commerceId: string) => `caisse_mp_data_${commerceId}`;

  // Load data when user logs in
  useEffect(() => {
    if (!user) {
      setProducts([]);
      setClients([]);
      setEmployees([]);
      setOrders([]);
      setExpenses([]);
      return;
    };
    
    const commerceId = user.commerceId;
    const storageKey = getLocalStorageKey(commerceId);
    const saved = localStorage.getItem(storageKey);

    const filterByCommerce = <T extends { commerce_id: string }>(data: T[]) => data.filter(item => item.commerce_id === commerceId);
    
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setProducts(data.products || filterByCommerce(initialProducts));
        setClients(data.clients || filterByCommerce(initialClients));
        setEmployees(data.employees || filterByCommerce(initialEmployees));
        setOrders(data.orders || filterByCommerce(initialOrders));
        setExpenses(data.expenses || filterByCommerce(initialExpenses));
      } catch (e) {
        console.error("Erreur chargement localStorage", e);
        setProducts(filterByCommerce(initialProducts));
        setClients(filterByCommerce(initialClients));
        setEmployees(filterByCommerce(initialEmployees));
        setOrders(filterByCommerce(initialOrders));
        setExpenses(filterByCommerce(initialExpenses));
      }
    } else {
      setProducts(filterByCommerce(initialProducts));
      setClients(filterByCommerce(initialClients));
      setEmployees(filterByCommerce(initialEmployees));
      setOrders(filterByCommerce(initialOrders));
      setExpenses(filterByCommerce(initialExpenses));
    }
  }, [user]);

  // Sauvegarde auto dans localStorage quand les données changent
  useEffect(() => {
    if (!user) return;
    const storageKey = getLocalStorageKey(user.commerceId);
    const data = {
      products,
      clients,
      employees,
      orders,
      expenses,
      timestamp: new Date().toISOString()
    };
    // Only save if there's data to save, to avoid overwriting on logout
    if (products.length > 0 || clients.length > 0 || employees.length > 0 || orders.length > 0 || expenses.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [products, clients, employees, orders, expenses, user]);

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

  // Synchroniser avec service externe (simulation)
  const syncNow = useCallback(async () => {
    if (!isOnline || !user) return;

    setSyncStatus('syncing');

    try {
      console.log(`Simulating Sync for ${user.commerceName}... Products:`, products.length, "Orders:", orders.length);
      
      await new Promise(res => setTimeout(res, 1500));

      setSyncStatus('synced');
      setLastSync(new Date());
    } catch (error) {
      console.error('Erreur sync:', error);
      setSyncStatus('error');
    }
  }, [products, orders, isOnline, user]);

  // Auto-sync
  useEffect(() => {
    if (isOnline && user) {
      syncNow();
    }
  }, [isOnline, user, syncNow]);

  // Sync périodique
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && user) syncNow();
    }, 60000); // Sync every 60 seconds
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
