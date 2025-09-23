
'use client';

// ======================
// DEPENDENCIES & IMPORTS
// ======================
import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { initialProducts, initialClients, initialEmployees, initialOrders, initialExpenses } from '@/lib/initial-data';
import { initialCommerces } from '@/lib/commerces';
import type { Commerce } from '@/lib/commerces';

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
  commerceId?: string;
  commerceName?: string;
  ownerEmail?: string;
}

// ======================
// CONTEXTES
// ======================
type AppContextType = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  
  // All data for SuperAdmin
  allProducts: Product[];
  allClients: Client[];
  allEmployees: Employee[];
  allOrders: Order[];
  allExpenses: Expense[];

  // Filtered/scoped data for views
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
  commerces: Commerce[];
  setCommerces: React.Dispatch<React.SetStateAction<Commerce[]>>;
  
  viewedCommerceId: string | null;
  setViewedCommerceId: (id: string | null) => void;

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
  
  // Hold ALL data in memory
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [allClients, setAllClients] = useState<Client[]>(initialClients);
  const [allEmployees, setAllEmployees] = useState<Employee[]>(initialEmployees);
  const [allOrders, setAllOrders] = useState<Order[]>(initialOrders);
  const [allExpenses, setAllExpenses] = useState<Expense[]>(initialExpenses);
  const [commerces, setCommerces] = useState<Commerce[]>(initialCommerces);
  
  // Data scoped to the current commerce view
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

  const [viewedCommerceId, setViewedCommerceId] = useState<string | null>(null);

  // Load data based on user role and selected commerce
  useEffect(() => {
    if (!user) {
      setProducts([]);
      setClients([]);
      setEmployees([]);
      setOrders([]);
      setExpenses([]);
      setViewedCommerceId(null);
      return;
    }

    const commerceId = user.isSuperAdmin ? viewedCommerceId : user.commerceId;

    if (user.isSuperAdmin) {
       // Super Admin can see all commerces, but dashboard view is scoped
      if (!viewedCommerceId && commerces.length > 0) {
        setViewedCommerceId(commerces[0].id);
      }
    } else {
       setViewedCommerceId(user.commerceId || null);
    }
    
    if (!commerceId) {
      // If superadmin has no commerces to view, clear data
      if(user.isSuperAdmin) {
        setProducts([]);
        setClients([]);
        setEmployees([]);
        setOrders([]);
        setExpenses([]);
      }
      return;
    }

    const storageKey = `caisse_mp_data_${commerceId}`;
    const savedData = localStorage.getItem(storageKey);
    let data;
    try {
        data = savedData ? JSON.parse(savedData) : {};
    } catch(e) {
        console.error("Error parsing localStorage", e);
        data = {};
    }

    const filterByCommerce = <T extends { commerce_id: string }>(items: T[]) => items.filter(item => item.commerce_id === commerceId);

    setProducts(data.products || filterByCommerce(allProducts));
    setClients(data.clients || filterByCommerce(allClients));
    setEmployees(data.employees || filterByCommerce(allEmployees));
    setOrders(data.orders || filterByCommerce(allOrders));
    setExpenses(data.expenses || filterByCommerce(allExpenses));

  }, [user, viewedCommerceId, commerces]);


  // Save data to localStorage when it changes for the specific commerce
  useEffect(() => {
    if (!viewedCommerceId || !user) return;
    
    // Determine which global dataset to update
    const updateGlobalState = <T extends {commerce_id: string}>(
      globalState: T[], 
      localState: T[],
      setGlobalState: React.Dispatch<React.SetStateAction<T[]>>
    ) => {
      // Remove old data for the current commerce
      const otherCommercesData = globalState.filter(item => item.commerce_id !== viewedCommerceId);
      // Add new data for the current commerce
      setGlobalState([...otherCommercesData, ...localState]);
    };

    updateGlobalState(allProducts, products, setAllProducts);
    updateGlobalState(allClients, clients, setAllClients);
    updateGlobalState(allEmployees, employees, setAllEmployees);
    updateGlobalState(allOrders, orders, setAllOrders);
    updateGlobalState(allExpenses, expenses, setAllExpenses);

    const storageKey = `caisse_mp_data_${viewedCommerceId}`;
    const dataToSave = {
        products,
        clients,
        employees,
        orders,
        expenses,
        timestamp: new Date().toISOString()
    };
    if (products.length > 0 || clients.length > 0 || employees.length > 0 || orders.length > 0 || expenses.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    }
  }, [products, clients, employees, orders, expenses, viewedCommerceId, user]);


  // Network status detection
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

  // Sync simulation
  const syncNow = useCallback(async () => {
    if (!isOnline || !user) return;
    setSyncStatus('syncing');
    try {
      await new Promise(res => setTimeout(res, 1500));
      setSyncStatus('synced');
      setLastSync(new Date());
    } catch (error) {
      console.error('Erreur sync:', error);
      setSyncStatus('error');
    }
  }, [isOnline, user]);

  // Auto and periodic sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && user) syncNow();
    }, 60000);
    if(isOnline && user) syncNow();
    return () => clearInterval(interval);
  }, [isOnline, user, syncNow]);


  const value: AppContextType = {
    user, setUser,
    allProducts, allClients, allEmployees, allOrders, allExpenses,
    products, setProducts,
    cart, setCart,
    clients, setClients,
    employees, setEmployees,
    orders, setOrders,
    expenses, setExpenses,
    commerces, setCommerces,
    viewedCommerceId, setViewedCommerceId,
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
