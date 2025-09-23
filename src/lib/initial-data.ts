
import type { Product, Client, Employee, Order, Expense } from "@/app/(app)/app-provider";

export const initialProducts: Product[] = [
    // Caffeinated Beverages
    { id: '1', name: 'Café express', price: 1.7, category: 'Boissons Chaudes', stock: 100, icon: '☕' },
    { id: '2', name: 'Capucin', price: 2.0, category: 'Boissons Chaudes', stock: 100, icon: '☕' },
    { id: '3', name: 'Café direct', price: 1.7, category: 'Boissons Chaudes', stock: 100, icon: '☕' },
    { id: '4', name: 'Café crème', price: 2.2, category: 'Boissons Chaudes', stock: 80, icon: '☕' },
    { id: '5', name: 'Chocolat au lait', price: 2.5, category: 'Boissons Chaudes', stock: 60, icon: '🍫' },
    
    // Tea
    { id: '6', name: 'Thé vert', price: 1.5, category: 'Thé', stock: 100, icon: '🍵' },
    { id: '7', name: 'Thé au menthe', price: 1.8, category: 'Thé', stock: 50, icon: '🌿' },
    { id: '8', name: 'Thé infusion', price: 2.0, category: 'Thé', stock: 40, icon: '🌺' },

    // Fresh Juices
    { id: '9', name: 'Jus d\'orange', price: 3.5, category: 'Jus Frais', stock: 30, icon: '🍊' },
    { id: '10', name: 'Jus de fraise', price: 4.0, category: 'Jus Frais', stock: 25, icon: '🍓' },
    { id: '11', name: 'Citronnade', price: 3.0, category: 'Jus Frais', stock: 50, icon: '🍋' },
    
    // Boissons
    { id: '12', name: 'Coca-Cola', price: 2.0, category: 'Boissons Fraîches', stock: 100, icon: '🥤' },
    { id: '13', name: 'Eau minérale 1.5L', price: 1.5, category: 'Boissons Fraîches', stock: 100, icon: '💧' },
    { id: '14', name: 'Eau minérale 0.5L', price: 1.0, category: 'Boissons Fraîches', stock: 100, icon: '💧' },

    // Viennoiserie
    { id: '15', name: 'Croissant', price: 1.2, category: 'Viennoiserie', stock: 40, icon: '🥐' },
    { id: '16', name: 'Pain au chocolat', price: 1.5, category: 'Viennoiserie', stock: 35, icon: '🍫' },
  ];
  
export const initialClients: Client[] = [
    { id: '1', name: 'Issam Bayaoui', email: 'mg.06sbz@gmail.com', phone: '+216 20 123 456', isVip: true, credit: 0, avatar: 'https://i.pravatar.cc/150?img=60' },
    { id: '2', name: 'Ahmed Ben Ali', email: 'ahmed@email.com', phone: '+216 22 987 654', isVip: false, credit: 15.5, avatar: 'https://i.pravatar.cc/150?img=32' },
    { id: '3', name: 'Fatma Gharbi', email: 'fatma.g@email.com', phone: '+216 55 111 222', isVip: true, credit: 120.0, avatar: 'https://i.pravatar.cc/150?img=31' },
    { id: '4', name: 'Youssef Trabelsi', email: 'youssef.t@email.com', phone: '+216 98 333 444', isVip: false, credit: 0, avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: '5', name: 'Amina Toumi', email: 'amina.toumi@email.com', phone: '+216 21 555 666', isVip: false, credit: 32.75, avatar: 'https://i.pravatar.cc/150?img=25' }
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
    },
    {
      id: '3',
      name: 'Karim',
      role: 'Caissier',
      salary: 750,
      evaluation: 3.9,
      schedule: '08:00 - 16:00',
      workingDays: ['L', 'M', 'J', 'V', 'S'],
      joinDate: '20/06/2023',
      advance: 50,
      balance: 700,
      isTopEmployee: false,
      avatar: 'https://i.pravatar.cc/150?img=52'
    }
  ];

export const initialOrders: Order[] = [
  {
    id: '1689333333',
    items: [
      { ...initialProducts[0], quantity: 2 },
      { ...initialProducts[15], quantity: 1 }
    ],
    total: (1.7 * 2) + 1.5,
    clientName: 'Ahmed Ben Ali',
    timestamp: '2023-07-14T12:35:33Z',
    cashierId: '1'
  },
  {
    id: '1689344444',
    items: [
      { ...initialProducts[5], quantity: 1 },
      { ...initialProducts[8], quantity: 1 }
    ],
    total: 1.5 + 3.5,
    clientName: 'Client invité',
    timestamp: '2023-07-14T15:40:44Z',
    cashierId: '3'
  }
]

export const initialExpenses: Expense[] = [
  {
    id: 'exp1',
    description: 'Facture STEG',
    amount: 185.50,
    category: 'Services Publics',
    date: '10/07/2023'
  },
  {
    id: 'exp2',
    description: 'Achat de 10kg de café',
    amount: 250.00,
    category: 'Fournitures',
    date: '12/07/2023'
  },
   {
    id: 'exp3',
    description: 'Maintenance machine à café',
    amount: 120.00,
    category: 'Maintenance',
    date: '13/07/2023'
  }
]
  
