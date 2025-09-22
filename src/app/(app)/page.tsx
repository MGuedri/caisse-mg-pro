'use client';

// ======================
// DEPENDENCIES & IMPORTS
// ======================
import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"

import {
  Coffee, ShoppingCart, Users, DollarSign, Download, Upload,
  Plus, Minus, Trash2, Edit, Search, Package, CreditCard, LogOut,
  BarChart3, User, TrendingUp, Printer, Wifi, WifiOff, RefreshCw, AlertCircle
} from 'lucide-react';

// ======================
// TYPES
// ======================
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  icon: string;
  commerce_id?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVip: boolean;
  credit: number;
  commerce_id?: string;
}

interface Employee {
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

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  clientName: string;
  timestamp: string;
  cashierId: string;
  commerce_id?: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  commerce_id?: string;
}

interface AppUser {
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
  { id: '1', name: 'Express', price: 1.7, category: 'Café', stock: 100, icon: '☕' },
  { id: '2', name: 'Cappuccino', price: 2.0, category: 'Café', stock: 100, icon: '☕' },
  { id: '3', name: 'Cappuccino Noisette', price: 3.0, category: 'Café', stock: 100, icon: '☕' },
  { id: '4', name: 'Chocolat Chaud', price: 2.5, category: 'Boissons', stock: 100, icon: '🍫' },
  { id: '5', name: 'Américain', price: 2.5, category: 'Café', stock: 100, icon: '☕' },
  { id: '6', name: 'Café Crème', price: 3.0, category: 'Café', stock: 100, icon: '☕' },
  { id: '7', name: 'Croissant', price: 1.5, category: 'Pâtisserie', stock: 50, icon: '🥐' },
  { id: '8', name: 'Pain au Chocolat', price: 2.0, category: 'Pâtisserie', stock: 30, icon: '🍫' },
];

const initialClients: Client[] = [
  { id: '1', name: 'Issam Bayaoui', email: 'issam@email.com', phone: '+216 20 123 456', isVip: true, credit: 0 },
  { id: '2', name: 'Ahmed Ben Ali', email: 'ahmed@email.com', phone: '+216 22 987 654', isVip: false, credit: 15.5 },
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
    avatar: '👨‍💼'
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
    avatar: '👩‍💼'
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
    const saved = localStorage.getItem('caisse_mg_data');
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
    localStorage.setItem('caisse_mg_data', JSON.stringify(data));
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

// ======================
// COMPOSANTS UI
// ======================

// --- SYNC STATUS BADGE ---
const SyncStatus: React.FC = () => {
  const { syncStatus, lastSync, syncNow, isOnline } = useApp();

  const getIcon = () => {
    if(!isOnline) return <WifiOff className="h-4 w-4 text-red-500" />;
    switch (syncStatus) {
      case 'syncing': return <RefreshCw className="h-4 w-4 text-orange-500 animate-spin" />;
      case 'synced': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus === 'synced' && lastSync) return `Sync: ${lastSync.toLocaleTimeString()}`;
    return syncStatus;
  }

  return (
    <div 
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-xs cursor-pointer border border-gray-700"
      onClick={syncNow}
      title="Cliquez pour synchroniser"
    >
      {getIcon()}
      <span className="text-gray-300">
       {getStatusText()}
      </span>
    </div>
  );
};

// --- LOGIN ---
const LoginScreen: React.FC = () => {
  const { setUser, setCurrentView } = useApp();
  const [email, setEmail] = useState('admin@caisse-mg.com');
  const [password, setPassword] = useState('admin123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setUser({ 
        id: '1', 
        name: 'Admin', 
        email, 
        role: 'SuperAdmin',
        isSuperAdmin: true,
        commerceId: 'default'
      });
      setCurrentView('pos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="text-3xl font-bold text-orange-500 mb-2">MG</div>
          <CardTitle className="text-white text-2xl">Caisse MG</CardTitle>
          <p className="text-gray-400">Connectez-vous à votre espace</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// --- TICKET PDF ---
const TicketPDF: React.FC<{ order: Order, commerceName?: string }> = ({ order, commerceName = "Caisse MG" }) => {
  const styles = StyleSheet.create({
    page: { padding: 20, fontFamily: 'Helvetica', fontSize: 10 },
    centerText: { textAlign: 'center' },
    header: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
    subHeader: { fontSize: 8, marginBottom: 5 },
    section: { borderTop: '1px solid black', paddingTop: 5, marginTop: 5 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
    bold: { fontWeight: 'bold' },
    footer: { fontSize: 8, marginTop: 20, color: '#666' }
  });

  return (
    <Document>
      <Page size={[80, 150]} style={styles.page}>
        <View>
          <Text style={[styles.centerText, styles.header]}>{commerceName}</Text>
          <Text style={[styles.centerText, styles.subHeader]}>Ticket n°{order.id.slice(-4)}</Text>
          <Text style={[styles.centerText, styles.subHeader, {marginBottom: 10}]}>{order.timestamp}</Text>
          <Text style={[styles.centerText, styles.subHeader, {marginBottom: 10}]}>Client: {order.clientName}</Text>

          {order.items.map((item, idx) => (
            <View key={idx} style={styles.row}>
              <Text>{item.name} x{item.quantity}</Text>
              <Text>{(item.price * item.quantity).toFixed(2)} DT</Text>
            </View>
          ))}

          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.bold}>Total:</Text>
              <Text style={styles.bold}>{order.total.toFixed(2)} DT</Text>
            </View>
          </View>

          <Text style={[styles.centerText, styles.footer]}>Merci de votre visite !</Text>
          <Text style={[styles.centerText, {fontSize: 8, color: '#666'}]}>www.caisse-mg.com</Text>
        </View>
      </Page>
    </Document>
  );
};


// --- PRINT TICKET BUTTON ---
const PrintTicketButton: React.FC<{ order: Order }> = ({ order }) => {
  const printPDF = async () => {
    try {
      const blob = await pdf(<TicketPDF order={order} />).toBlob();
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        if(!iframe.contentWindow) return;
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(iframe);
        }, 1000);
      };
    } catch (error) {
      console.error('Erreur impression:', error);
    }
  };

  return (
    <Button onClick={printPDF} variant="outline" size="sm" className="gap-1">
      <Printer className="h-4 w-4" />
      Imprimer
    </Button>
  );
};


// --- CHARTS ---
const SalesChart: React.FC = () => {
  const mockData = [
    { month: 'Jan', revenue: 4200 },
    { month: 'Fév', revenue: 3800 },
    { month: 'Mar', revenue: 5100 },
    { month: 'Avr', revenue: 4900 },
    { month: 'Mai', revenue: 6200 },
    { month: 'Jun', revenue: 5800 },
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Ventes Mensuelles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <RechartsTooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="revenue" fill="#FF9800" name="Revenus (DT)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const TopProductsChart: React.FC = () => {
  const COLORS = ['#FF9800', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const mockData = [
    { name: 'Express', value: 120 },
    { name: 'Cappuccino', value: 95 },
    { name: 'Croissant', value: 80 },
    { name: 'Chocolat Chaud', value: 65 },
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Produits Populaires</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// --- POINT DE VENTE ---
const POSScreen: React.FC = () => {
  const { products, cart, setCart, orders, setOrders, clients, includeVAT, setIncludeVAT } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedClient, setSelectedClient] = useState('Client invité');

  const categories = ['Tous', ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  }, [setCart]);

  const updateQuantity = useCallback((id: string, change: number) => {
    setCart(prev => {
      const newCart = prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean);
      return newCart as CartItem[];
    });
  }, [setCart]);
  

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vatRate = 0.19;
  const vatAmount = includeVAT ? subtotal * vatRate : 0;
  const total = subtotal + vatAmount;
  const change = paymentAmount ? Math.max(0, parseFloat(paymentAmount) - total) : 0;

  const handlePayment = () => {
    if (cart.length === 0) return;
    
    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total,
      clientName: selectedClient,
      timestamp: new Date().toLocaleString('fr-FR'),
      cashierId: 'user1'
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsPaymentOpen(false);
    setPaymentAmount('');
    setSelectedClient('Client invité');
  };

  return (
    <div className="flex h-[calc(100vh-65px)] bg-gray-900 text-white">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`${selectedCategory === category 
                  ? "bg-orange-500 hover:bg-orange-600" 
                  : "border-gray-700 text-gray-300 hover:bg-gray-800"} shrink-0`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <Card 
              key={product.id} 
              className="cursor-pointer bg-gray-800 border-gray-700 transition-transform transform hover:scale-105"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">{product.icon}</div>
                <h3 className="font-semibold text-white mb-1 truncate">{product.name}</h3>
                <p className="text-orange-500 font-bold text-lg">{product.price.toFixed(2)} DT</p>
                <p className="text-gray-400 text-sm">Stock: {product.stock}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-96 bg-gray-800 border-l border-gray-700 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Panier</h2>
          <Badge variant="secondary" className="bg-orange-500 text-white">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </Badge>
        </div>

        <div className="flex-grow space-y-3 mb-6 overflow-y-auto">
          {cart.map(item => (
            <Card key={item.id} className="bg-gray-700 border-gray-600">
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white text-sm">{item.name}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))}
                    className="text-red-400 hover:bg-red-900 p-1 h-auto"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="h-8 w-8 p-0 border-gray-600 bg-gray-800"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-white w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="h-8 w-8 p-0 border-gray-600 bg-gray-800"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-orange-500 font-bold">
                    {(item.price * item.quantity).toFixed(2)} DT
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cart.length === 0 && (
          <div className="text-center text-gray-400 py-8 m-auto">
            <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Panier vide</p>
          </div>
        )}

        {cart.length > 0 && (
          <div className="border-t border-gray-700 pt-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Sous-total:</span>
                <span className="text-white">{subtotal.toFixed(2)} DT</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="vat-toggle"
                    checked={includeVAT}
                    onChange={(e) => setIncludeVAT(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-orange-600 bg-gray-700 border-gray-600 rounded"
                  />
                  <label htmlFor="vat-toggle" className="text-gray-300 text-sm">TVA (19%)</label>
                </div>
                <span className="text-gray-300">{vatAmount.toFixed(2)} DT</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-700">
                <span className="text-lg font-bold text-white">Total:</span>
                <span className="text-2xl font-bold text-orange-500">
                  {total.toFixed(2)} DT
                </span>
              </div>
            </div>
            
            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payer
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Finaliser la commande</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Client</label>
                    <select 
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option>Client invité</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.name}>
                          {client.name} {client.isVip && '⭐'}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Total à payer: <span className="text-orange-500 font-bold">{total.toFixed(2)} DT</span>
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Montant reçu"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white text-lg"
                    />
                  </div>
                  
                  {paymentAmount && (
                    <div className="p-3 bg-gray-700 rounded">
                      <p className="text-sm">Monnaie à rendre:</p>
                      <p className="text-xl font-bold text-green-500">
                        {change.toFixed(2)} DT
                      </p>
                    </div>
                  )}
                  
                </div>
                <DialogFooter className="!justify-between">
                   <div className="flex-1">
                      <PrintTicketButton order={{ id: Date.now().toString(), items: cart, total, clientName: selectedClient, timestamp: new Date().toLocaleString('fr-FR'), cashierId: 'user1'}} />
                   </div>
                    <Button 
                      variant="outline"
                      onClick={() => setIsPaymentOpen(false)}
                      className="border-gray-600 text-gray-300"
                    >
                      Annuler
                    </Button>
                   <Button 
                      onClick={handlePayment}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!paymentAmount || parseFloat(paymentAmount) < total}
                    >
                      Confirmer
                    </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};


// --- DASHBOARD ---
const DashboardScreen: React.FC = () => {
  const { orders, employees, products, clients, expenses, syncStatus, syncNow } = useApp();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const recentOrders = orders.slice(0, 5);
  const topEmployees = employees.filter(emp => emp.isTopEmployee);

  const handleBackup = () => {
    const data = {
      products,
      clients,
      employees,
      orders,
      expenses,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caisse-mg-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          localStorage.setItem('caisse_mg_data', JSON.stringify(data));
          window.location.reload();
        } catch (error) {
          alert('Erreur lors de la restauration');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Tableau de Bord</h1>
        <SyncStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Revenus Total</p>
                <p className="text-2xl font-bold">{totalRevenue.toFixed(2)} DT</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Produits</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Employés</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <TopProductsChart />
      </div>

      <Card className="bg-orange-600 border-orange-500">
        <CardHeader>
          <CardTitle className="text-white">Maintenance et Données</CardTitle>
          <CardDescription className="text-orange-100">
            Sauvegardez ou restaurez les données de votre commerce.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 flex-wrap pt-6">
          <Button onClick={handleBackup} className="bg-orange-500 hover:bg-orange-400 text-white">
            <Download className="mr-2 h-4 w-4" /> Sauvegarder
          </Button>
          <div>
            <input type="file" accept=".json" onChange={handleRestore} style={{ display: 'none' }} id="restore-input" />
            <Button onClick={() => document.getElementById('restore-input')?.click()} variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              <Upload className="mr-2 h-4 w-4" /> Restaurer
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Ventes Récentes</CardTitle>
            <CardDescription className="text-gray-400">Les 5 dernières ventes</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{order.clientName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{order.clientName}</p>
                        <p className="text-gray-400 text-sm">{order.timestamp}</p>
                      </div>
                    </div>
                    <span className="text-orange-500 font-bold">+{order.total.toFixed(2)} DT</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Aucune vente récente</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Employés</CardTitle>
            <CardDescription className="text-gray-400">Meilleures évaluations</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {topEmployees.length > 0 ? (
              <div className="space-y-3">
                {topEmployees.map(employee => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{employee.avatar}</div>
                      <div>
                        <p className="text-white font-medium">{employee.name}</p>
                        <p className="text-gray-400 text-sm">{employee.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-yellow-600 text-white mb-1">Top</Badge>
                      <p className="text-yellow-500 font-bold">★ {employee.evaluation}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Aucun top employé</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- INVENTAIRE ---
const InventoryScreen: React.FC = () => {
  const { products, setProducts } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Café',
    stock: 0,
    icon: '☕'
  });

  const openModalForAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: 0, category: 'Café', stock: 0, icon: '☕' });
    setIsModalOpen(true);
  };
  
  const openModalForEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };
  
  const handleSave = () => {
    if (!formData.name || !formData.price) return;
  
    if (editingProduct) {
      // Update
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, price: Number(formData.price), stock: Number(formData.stock) }
          : p
      ));
    } else {
      // Add
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        price: Number(formData.price),
        category: formData.category || 'Café',
        stock: Number(formData.stock) || 0,
        icon: formData.icon || '📦'
      };
      setProducts(prev => [...prev, newProduct]);
    }
  
    setIsModalOpen(false);
    setEditingProduct(null);
  };
  

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Inventaire</h1>
        <Button onClick={openModalForAdd} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map(product => (
          <Card key={product.id} className="bg-gray-800 border-gray-700 flex flex-col">
            <CardContent className="p-4 flex-grow text-center">
              <div className="text-4xl mb-2">{product.icon}</div>
              <h3 className="font-semibold text-white">{product.name}</h3>
              <p className="text-orange-500 font-bold">{product.price.toFixed(2)} DT</p>
              <p className="text-gray-400">Stock: {product.stock}</p>
              <Badge variant="outline" className="mt-2 text-gray-400 border-gray-600">{product.category}</Badge>
            </CardContent>
            <div className="flex gap-2 p-4 border-t border-gray-700">
                <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300" onClick={() => openModalForEdit(product)}>
                  <Edit className="h-3 w-3 mr-1" /> Modifier
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="flex-1">
                      <Trash2 className="h-3 w-3 mr-1" /> Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer {product.name} ?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 hover:bg-red-700">
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input placeholder="Nom" value={formData.name || ''} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="bg-gray-700 border-gray-600" />
            <Input type="number" step="0.01" placeholder="Prix (DT)" value={formData.price || ''} onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} className="bg-gray-700 border-gray-600" />
            <Input placeholder="Catégorie" value={formData.category || ''} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} className="bg-gray-700 border-gray-600" />
            <Input type="number" placeholder="Stock" value={formData.stock || ''} onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))} className="bg-gray-700 border-gray-600" />
            <Input placeholder="Icône (emoji)" value={formData.icon || ''} onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))} className="bg-gray-700 border-gray-600" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-gray-600">Annuler</Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600" disabled={!formData.name || !formData.price}>
              {editingProduct ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- GESTION ---
const ManagementScreen: React.FC = () => {
  const { clients, setClients, employees, setEmployees, expenses, setExpenses } = useApp();
  const [activeTab, setActiveTab] = useState('clients');

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 p-1 mb-6">
          <TabsTrigger value="clients" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded">Clients</TabsTrigger>
          <TabsTrigger value="employees" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded">Employés</TabsTrigger>
          <TabsTrigger value="expenses" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded">Dépenses</TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <div className="space-y-4">
            {clients.map(client => (
              <Card key={client.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-white">{client.name}</h3>
                        {client.isVip && <Badge className="bg-yellow-600 text-white">VIP</Badge>}
                      </div>
                      <p className="text-gray-400">{client.email}</p>
                      <p className="text-gray-400">{client.phone}</p>
                      {client.credit > 0 && <p className="text-red-400">Crédit: {client.credit.toFixed(2)} DT</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-gray-600"><Edit className="h-3 w-3" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive"><Trash2 className="h-3 w-3" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer {client.name} ?</AlertDialogTitle>
                            <AlertDialogDescription>Irreversible.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-600 text-gray-300">Annuler</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600">Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un client
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="employees">
          <div className="space-y-4">
            {employees.map(employee => (
              <Card key={employee.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="text-3xl">{employee.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{employee.name}</h3>
                        {employee.isTopEmployee && <Badge className="bg-yellow-600 text-white">Top</Badge>}
                      </div>
                      <p className="text-gray-400">{employee.role}</p>
                      <p className="text-gray-400">Salaire: {employee.salary} DT</p>
                      <p className="text-gray-400">Horaire: {employee.schedule}</p>
                      <div className="flex gap-1 mt-2">
                        {['L', 'M', 'J', 'V', 'S', 'D'].map(day => (
                          <span key={day} className={`w-6 h-6 flex items-center justify-center text-xs rounded ${employee.workingDays.includes(day as any) ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-400'}`}>
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="border-gray-600"><Edit className="h-3 w-3" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive"><Trash2 className="h-3 w-3" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer {employee.name} ?</AlertDialogTitle>
                            <AlertDialogDescription>Irreversible.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-600 text-gray-300">Annuler</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600">Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un employé
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="expenses">
          <div className="space-y-4">
            {expenses.map(expense => (
              <Card key={expense.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{expense.description}</h3>
                      <p className="text-gray-400">{expense.category}</p>
                      <p className="text-gray-400">{expense.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-bold">- {expense.amount.toFixed(2)} DT</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" className="border-gray-600"><Edit className="h-3 w-3" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive"><Trash2 className="h-3 w-3" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer ?</AlertDialogTitle>
                              <AlertDialogDescription>Irreversible.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-600 text-gray-300">Annuler</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600">Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-2 h-4 w-4" /> Ajouter une dépense
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// --- NAVIGATION PRINCIPALE ---
const MainApp: React.FC = () => {
  const { user, setUser, currentView, setCurrentView } = useApp();

  const navigation = [
    { id: 'pos', label: 'Caisse', icon: ShoppingCart, allowedRoles: ['SuperAdmin', 'Owner', 'Caissier'] },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, allowedRoles: ['SuperAdmin', 'Owner'] },
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

  if (currentView === 'login') {
    return <LoginScreen />;
  }
  
  if (!user) {
    return <LoginScreen />; // Should not be reached if logic is correct
  }


  const visibleNav = navigation.filter(item => item.allowedRoles.includes(user.role));

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-orange-500">MG</div>
            <nav className="hidden md:flex gap-1">
              {visibleNav.map(item => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => setCurrentView(item.id)}
                  className={`
                    ${currentView === item.id 
                      ? "bg-orange-500 hover:bg-orange-600 text-white" 
                      : "text-gray-300 hover:bg-gray-700"}
                  `}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <SyncStatus />
            <div className="hidden sm:block">
              <span className="text-gray-400">Connecté: </span>
              <span className="font-medium">{user.name}</span>
              <Badge className="ml-2 bg-blue-600 text-white text-xs">{user.role}</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-300 hover:bg-gray-700">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
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

    