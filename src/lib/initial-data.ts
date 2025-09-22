import type { Product, Client, Employee } from "@/app/(app)/app-provider";

export const initialProducts: Product[] = [
    // Caffeinated Beverages
    { id: '1', name: 'Café express', price: 1.7, category: 'Caffeinated Beverages', stock: 100, icon: '☕' },
    { id: '2', name: 'Capucin', price: 2.0, category: 'Caffeinated Beverages', stock: 100, icon: '☕' },
    { id: '3', name: 'Café direct', price: 1.7, category: 'Caffeinated Beverages', stock: 100, icon: '☕' },
    { id: '4', name: 'Café lait au chocolat', price: 1.2, category: 'Caffeinated Beverages', stock: 100, icon: '🍫' },
    { id: '5', name: 'Café filtre', price: 1.2, category: 'Caffeinated Beverages', stock: 100, icon: '☕' },
    
    // Tea
    { id: '6', name: 'Thé vert', price: 1.0, category: 'Tea', stock: 100, icon: '🍵' },
    { id: '7', name: 'Thé au menthe', price: 1.2, category: 'Tea', stock: 50, icon: '🍵' },
    
    // Fresh Juices
    { id: '8', name: 'Jus citron', price: 1.0, category: 'Fresh Juices', stock: 30, icon: '🍋' },
    { id: '9', name: 'Citron + menthe', price: 1.1, category: 'Fresh Juices', stock: 100, icon: '🍋' },
    
    // Boissons
    { id: '10', name: 'Gazeuz', price: 1.5, category: 'Boissons', stock: 100, icon: '🥤' },
    { id: '11', name: 'Eau minérale 1 litre', price: 1.5, category: 'Boissons', stock: 100, icon: '💧' },
    { id: '12', name: 'Eau minérale 0.5 litre', price: 1.0, category: 'Boissons', stock: 100, icon: '💧' },
  ];
  
export const initialClients: Client[] = [
    { id: '1', name: 'Issam Bayaoui', email: 'mg.06sbz@gmail.com', phone: '+216 20 123 456', isVip: true, credit: 0, avatar: 'https://i.pravatar.cc/150?img=60' },
    { id: '2', name: 'Ahmed Ben Ali', email: 'ahmed@email.com', phone: '+216 22 987 654', isVip: false, credit: 15.5, avatar: 'https://i.pravatar.cc/150?img=32' },
  ];
  
export const initialEmployees: Employee[] = [
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
      avatar: 'https://i.pravatar.cc/150?img=11'
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
      avatar: 'https://i.pravatar.cc/150?img=16'
    }
  ];
  