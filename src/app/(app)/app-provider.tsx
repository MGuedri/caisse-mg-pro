
'use client';

import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

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
  role: 'SuperAdmin' | 'Owner';
  isSuperAdmin: boolean;
  commerceId?: string;
  commerceName?: string;
  ownerEmail?: string; // Ajout pour le rapport
}

export interface Commerce {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  subscription: 'Active' | 'Inactive' | 'Trial';
  creationdate: string;
  address?: string;
  owner_id?: string;
}


// ======================
// CONTEXT
// ======================
type AppContextType = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  
  // Data filtered/scoped for views
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
  
  // Data fetch and mutation functions
  fetchDataForCommerce: (commerceId: string) => Promise<void>;
  fetchAllData: () => Promise<void>;
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
  
  // RAW data states - holds all data for superadmin
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  
  // Scoped data states - for single commerce view
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  const [commerces, setCommerces] = useState<Commerce[]>([]);

  // UI and Sync states
  const [currentView, setCurrentView] = useState<string>('login');
  const [includeVAT, setIncludeVAT] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'offline' | 'syncing' | 'synced' | 'error'>('offline');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : false);
  const [viewedCommerceId, setViewedCommerceId] = useState<string | null>(null);

  
  useEffect(() => {
    // This effect runs only on the client to get the last viewed commerce ID
    const savedCommerceId = localStorage.getItem('viewedCommerceId');
    if (savedCommerceId) {
      try {
        const parsedId = JSON.parse(savedCommerceId);
        if(parsedId) {
          setViewedCommerceId(parsedId);
        }
      } catch (e) {
        console.error("Failed to parse viewedCommerceId from localStorage", e);
        localStorage.removeItem('viewedCommerceId');
      }
    }
  }, []);

  useEffect(() => {
    // This effect runs only on the client to save the viewed commerce ID
    if (typeof window !== 'undefined') {
        if (viewedCommerceId) {
            localStorage.setItem('viewedCommerceId', JSON.stringify(viewedCommerceId));
        } else {
            localStorage.removeItem('viewedCommerceId');
        }
    }
  }, [viewedCommerceId]);


  // Clear all data
  const clearData = () => {
      setProducts([]);
      setClients([]);
      setEmployees([]);
      setOrders([]);
      setExpenses([]);
  };

  // Fetch all data for SuperAdmin
  const fetchAllData = useCallback(async () => {
    if (!user?.isSuperAdmin) return;
    setSyncStatus('syncing');

    try {
      const commercesRes = await supabase.from('commerces').select('*');
      if (commercesRes.error) { console.error("Error fetching commerces:", String(commercesRes.error)); throw commercesRes.error; }
      setCommerces(commercesRes.data || []);
      
      const productsRes = await supabase.from('products').select('*');
      if (productsRes.error) { console.error("Error fetching products:", String(productsRes.error)); throw productsRes.error; }
      setAllProducts(productsRes.data || []);

      const clientsRes = await supabase.from('clients').select('*');
      if (clientsRes.error) { console.error("Error fetching clients:", String(clientsRes.error)); throw clientsRes.error; }
      setAllClients(clientsRes.data || []);
      
      const employeesRes = await supabase.from('employees').select('*');
      if (employeesRes.error) { console.error("Error fetching employees:", String(employeesRes.error)); throw employeesRes.error; }
      setAllEmployees(employeesRes.data || []);
      
      const ordersRes = await supabase.from('orders').select('*');
      if (ordersRes.error) { console.error("Error fetching orders:", String(ordersRes.error)); throw ordersRes.error; }
      setAllOrders(ordersRes.data || []);
      
      const expensesRes = await supabase.from('expenses').select('*');
      if (expensesRes.error) { console.error("Error fetching expenses:", String(expensesRes.error)); throw expensesRes.error; }
      setAllExpenses(expensesRes.data || []);
      
      setSyncStatus('synced');
      setLastSync(new Date());

    } catch(error) {
        console.error("Error during fetchAllData:", String(error));
        setSyncStatus('error');
    }
  }, [user]);


  // Fetch data for a specific commerce
  const fetchDataForCommerce = useCallback(async (commerceId: string) => {
    setSyncStatus('syncing');
    clearData();
    try {
        const productsRes = await supabase.from('products').select('*').eq('commerce_id', commerceId);
        if (productsRes.error) { console.error("Error fetching products for commerce:", String(productsRes.error)); throw productsRes.error; }
        setProducts(productsRes.data || []);

        const clientsRes = await supabase.from('clients').select('*').eq('commerce_id', commerceId);
        if (clientsRes.error) { console.error("Error fetching clients for commerce:", String(clientsRes.error)); throw clientsRes.error; }
        setClients(clientsRes.data || []);
        
        const employeesRes = await supabase.from('employees').select('*').eq('commerce_id', commerceId);
        if (employeesRes.error) { console.error("Error fetching employees for commerce:", String(employeesRes.error)); throw employeesRes.error; }
        setEmployees(employeesRes.data || []);

        const ordersRes = await supabase.from('orders').select('*').eq('commerce_id', commerceId);
        if (ordersRes.error) { console.error("Error fetching orders for commerce:", String(ordersRes.error)); throw ordersRes.error; }
        setOrders(ordersRes.data || []);

        const expensesRes = await supabase.from('expenses').select('*').eq('commerce_id', commerceId);
        if (expensesRes.error) { console.error("Error fetching expenses for commerce:", String(expensesRes.error)); throw expensesRes.error; }
        setExpenses(expensesRes.data || []);

        setSyncStatus('synced');
        setLastSync(new Date());
    } catch(error) {
        console.error("Error fetching commerce data:", String(error));
        setSyncStatus('error');
    }
  }, []);

  // Main data loading effect
  useEffect(() => {
    if (!user) {
        clearData();
        setCommerces([]);
        return;
    }

    if (user.isSuperAdmin) {
        fetchAllData();
    } else if (user.commerceId) {
        fetchDataForCommerce(user.commerceId);
    }
  }, [user, fetchAllData, fetchDataForCommerce]);


  // SuperAdmin data filtering logic
  useEffect(() => {
      if (user?.isSuperAdmin) {
        if (!viewedCommerceId && commerces.length > 0) {
            setViewedCommerceId(commerces[0].id);
        }

        const filter = (items: any[]) => items.filter(i => i.commerce_id === viewedCommerceId);
        setProducts(filter(allProducts));
        setClients(filter(allClients));
        setEmployees(filter(allEmployees));
        setOrders(filter(allOrders));
        setExpenses(filter(allExpenses));
      }
  }, [user?.isSuperAdmin, viewedCommerceId, commerces, allProducts, allClients, allEmployees, allOrders, allExpenses]);


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

  // Sync logic
  const syncNow = useCallback(async () => {
    if (!isOnline || !user) return;
    
    if (user.isSuperAdmin) {
      await fetchAllData();
    } else if (user.commerceId) {
      await fetchDataForCommerce(user.commerceId);
    }
  }, [isOnline, user, fetchAllData, fetchDataForCommerce]);

  // Periodic sync
  useEffect(() => {
    const interval = setInterval(() => {
      syncNow();
    }, 60000); // Sync every minute
    return () => clearInterval(interval);
  }, [syncNow]);

  const value: AppContextType = {
    user, setUser,
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
    syncStatus, lastSync, syncNow, isOnline,
    fetchDataForCommerce,
    fetchAllData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

    

    

    