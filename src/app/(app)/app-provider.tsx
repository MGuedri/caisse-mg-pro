
'use client';

import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { fetchAllDataForAdmin, fetchDataForCommerce } from '@/app/actions/data';

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
  owneremail?: string;
}

export interface Commerce {
  id: string;
  name: string;
  ownername: string;
  owneremail: string;
  subscription: 'Active' | 'Inactive' | 'Trial';
  creationdate: string;
  address?: string;
  owner_id?: string;
  subscription_price?: number;
  subscription_period?: 'monthly' | 'yearly';
}

export interface Invoice {
    id: string;
    commerce_id: string;
    amount: number;
    due_date: string;
    status: 'pending' | 'paid' | 'overdue';
    created_at: string;
    paid_at?: string;
    commerceName?: string; 
}


// ======================
// CONTEXT
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
  commerces: Commerce[];
  setCommerces: React.Dispatch<React.SetStateAction<Commerce[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  
  viewedCommerceId: string | null;
  setViewedCommerceId: (id: string | null) => void;

  currentView: string;
  setCurrentView: (view: string) => void;
  includeVAT: boolean;
  setIncludeVAT: (include: boolean) => void;
  syncStatus: 'offline' | 'syncing' | 'synced' | 'error';
  lastSync: Date | null;
  
  refreshData: () => Promise<void>;
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
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [commerces, setCommerces] = useState<Commerce[]>([]);

  const [currentView, setCurrentView] = useState<string>('login');
  const [includeVAT, setIncludeVAT] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'offline' | 'syncing' | 'synced' | 'error'>('synced');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [viewedCommerceId, setViewedCommerceId] = useState<string | null>(null);

  const clearData = useCallback(() => {
      setProducts([]);
      setClients([]);
      setEmployees([]);
      setOrders([]);
      setExpenses([]);
      setInvoices([]);
      setCommerces([]);
  }, []);

  const refreshData = useCallback(async () => {
    if (!user) return;
    setSyncStatus('syncing');
    try {
        let result;
        if (user.isSuperAdmin) {
            result = await fetchAllDataForAdmin();
        } else if (user.commerceId) {
            result = await fetchDataForCommerce(user.commerceId);
        } else {
          result = { data: null, error: "No commerceId found for user" };
        }

        if (result.error || !result.data) {
          throw new Error(result.error || 'Failed to fetch data');
        }

        const data = result.data;

        if (data.commerces) {
            setCommerces(data.commerces);
            if (!viewedCommerceId && data.commerces.length > 0) {
              setViewedCommerceId(data.commerces[0].id);
            }
        }
        if (data.invoices) setInvoices(data.invoices);

        // For owner, data is already filtered. For admin, we filter client-side.
        if (user.isSuperAdmin) {
            const currentId = viewedCommerceId || (data.commerces && data.commerces.length > 0 ? data.commerces[0].id : null);
             if (currentId) {
                setProducts(data.products?.filter(p => p.commerce_id === currentId) || []);
                setClients(data.clients?.filter(c => c.commerce_id === currentId) || []);
                setEmployees(data.employees?.filter(e => e.commerce_id === currentId) || []);
                setOrders(data.orders?.filter(o => o.commerce_id === currentId) || []);
                setExpenses(data.expenses?.filter(e => e.commerce_id === currentId) || []);
             } else {
                // If no commerce is viewed, clear the data
                setProducts([]);
                setClients([]);
                setEmployees([]);
                setOrders([]);
                setExpenses([]);
             }
        } else {
             setProducts(data.products || []);
             setClients(data.clients || []);
             setEmployees(data.employees || []);
             setOrders(data.orders || []);
             setExpenses(data.expenses || []);
        }
        
        setSyncStatus('synced');
        setLastSync(new Date());
    } catch (error: any) {
        console.error("Failed to fetch data:", error.message);
        setSyncStatus('error');
    }
  }, [user, viewedCommerceId]);

  useEffect(() => {
    if (user) {
        refreshData();
    } else {
        clearData();
    }
  }, [user, refreshData, clearData]);

  // Refetch data when viewed commerce changes for superadmin
  useEffect(() => {
    if (user?.isSuperAdmin && viewedCommerceId) {
        refreshData();
    }
  }, [user?.isSuperAdmin, viewedCommerceId, refreshData])

  const value: AppContextType = {
    user, setUser,
    products, setProducts,
    cart, setCart,
    clients, setClients,
    employees, setEmployees,
    orders, setOrders,
    expenses, setExpenses,
    commerces, setCommerces,
    invoices, setInvoices,
    viewedCommerceId, setViewedCommerceId,
    currentView, setCurrentView,
    includeVAT, setIncludeVAT,
    syncStatus, lastSync,
    refreshData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
