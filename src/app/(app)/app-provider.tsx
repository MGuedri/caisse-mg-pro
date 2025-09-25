
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
export const AppProvider: React.FC<{ user: AppUser | null, children: ReactNode, initialData?: any }> = ({ user: initialUser, children, initialData }) => {
  const [user, setUser] = useState<AppUser | null>(initialUser);
  
  const [products, setProducts] = useState<Product[]>(initialData?.products || []);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [clients, setClients] = useState<Client[]>(initialData?.clients || []);
  const [employees, setEmployees] = useState<Employee[]>(initialData?.employees || []);
  const [orders, setOrders] = useState<Order[]>(initialData?.orders || []);
  const [expenses, setExpenses] = useState<Expense[]>(initialData?.expenses || []);
  const [invoices, setInvoices] = useState<Invoice[]>(initialData?.invoices || []);
  const [commerces, setCommerces] = useState<Commerce[]>(initialData?.commerces || []);

  const [currentView, setCurrentView] = useState<string>(initialUser?.isSuperAdmin ? 'superadmin' : 'pos');
  const [includeVAT, setIncludeVAT] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'offline' | 'syncing' | 'synced' | 'error'>('synced');
  const [lastSync, setLastSync] = useState<Date | null>(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [viewedCommerceId, setViewedCommerceId] = useState<string | null>(null);

  const clearCommerceData = useCallback(() => {
    setProducts([]);
    setClients([]);
    setEmployees([]);
    setOrders([]);
    setExpenses([]);
  }, []);

  const refreshData = useCallback(async () => {
    if (!user) return;
    setSyncStatus('syncing');

    try {
        let result;
        if (user.isSuperAdmin) {
            // SuperAdmin always re-fetches the list of commerces and invoices
            const adminResult = await fetchAllDataForAdmin();
            setCommerces(adminResult.data?.commerces || []);
            setInvoices(adminResult.data?.invoices || []);

            if (viewedCommerceId) {
                // If a specific commerce is being viewed, fetch its data
                result = await fetchDataForCommerce(viewedCommerceId);
            } else {
                 // If no commerce is selected, ensure all commerce-specific data is cleared
                clearCommerceData();
                setSyncStatus('synced');
                setLastSync(new Date());
                return; // Stop here if no commerce is selected
            }
        } else if (user.commerceId) {
            // Owner or Caissier fetches data for their own commerce
            result = await fetchDataForCommerce(user.commerceId);
        } else {
          // This case should not happen for a logged-in non-admin user
          result = { data: null, error: "User is not a SuperAdmin and has no commerceId." };
        }

        if (result.error || !result.data) {
          throw new Error(result.error || 'Failed to fetch commerce-specific data');
        }
        
        // Set the fetched data for the selected commerce
        const data = result.data;
        setProducts(data.products || []);
        setClients(data.clients || []);
        setEmployees(data.employees || []);
        setOrders(data.orders || []);
        setExpenses(data.expenses || []);
        
        setSyncStatus('synced');
        setLastSync(new Date());
    } catch (error: any) {
        console.error("Failed to refresh data:", error.message);
        setSyncStatus('error');
    }
  }, [user, viewedCommerceId, clearCommerceData]);

  useEffect(() => {
    if (initialUser) {
        setUser(initialUser);
        if (initialUser.isSuperAdmin) {
            if(initialData?.commerces) {
              setCommerces(initialData.commerces);
            }
            if(initialData?.invoices) {
              setInvoices(initialData.invoices || []);
            }
            // Initially, no commerce is viewed, so we clear the data.
            // This is the failsafe to prevent crashes.
            clearCommerceData();
        }
    }
  }, [initialUser, initialData, clearCommerceData]);

  // This effect triggers a data refresh whenever the viewedCommerceId changes for a SuperAdmin.
  useEffect(() => {
    // We only run this if the user is a super admin.
    // The refreshData function already handles the logic of what to fetch.
    if (user?.isSuperAdmin) {
        refreshData();
    }
    // The dependency on refreshData is correct here, as it's memoized by useCallback
    // and will only change if its own dependencies change.
  }, [user?.isSuperAdmin, viewedCommerceId, refreshData]);

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
