
import type { Product, Client, Employee, Order, Expense } from "@/app/(app)/app-provider";

// ===================================
// DATA FOR: Café Mon Plaisir (default)
// ===================================

const mp_products: Product[] = [
    { id: 'mp_1', name: 'Café express', price: 1.700, category: 'Boissons Chaudes', stock: 100, icon: '☕', commerce_id: 'mon_plaisir' },
    { id: 'mp_2', name: 'Capucin', price: 2.000, category: 'Boissons Chaudes', stock: 100, icon: '☕', commerce_id: 'mon_plaisir' },
    { id: 'mp_3', name: 'Café direct', price: 1.700, category: 'Boissons Chaudes', stock: 100, icon: '☕', commerce_id: 'mon_plaisir' },
    { id: 'mp_4', name: 'Café lait au chocolat', price: 1.500, category: 'Boissons Chaudes', stock: 80, icon: '🍫', commerce_id: 'mon_plaisir' },
    { id: 'mp_5', name: 'Café filtre', price: 1.600, category: 'Boissons Chaudes', stock: 60, icon: '☕', commerce_id: 'mon_plaisir' },
    { id: 'mp_6', name: 'Thé vert', price: 1.200, category: 'Thé', stock: 100, icon: '🍵', commerce_id: 'mon_plaisir' },
    { id: 'mp_7', name: 'Thé au menthe', price: 1.500, category: 'Thé', stock: 50, icon: '🌿', commerce_id: 'mon_plaisir' },
    { id: 'mp_8', name: 'Jus de saison', price: 1.500, category: 'Jus Frais', stock: 30, icon: '🍹', commerce_id: 'mon_plaisir' },
    { id: 'mp_9', name: 'Jus de citron', price: 1.200, category: 'Jus Frais', stock: 50, icon: '🍋', commerce_id: 'mon_plaisir' },
    { id: 'mp_10', name: 'Citronnade au menthe', price: 1.300, category: 'Jus Frais', stock: 40, icon: '🍃', commerce_id: 'mon_plaisir' },
    { id: 'mp_11', name: 'Boisson gazeuse', price: 1.500, category: 'Boissons Fraîches', stock: 100, icon: '🥤', commerce_id: 'mon_plaisir' },
    { id: 'mp_12', name: 'Eau minérale 1.5L', price: 1.500, category: 'Boissons Fraîches', stock: 100, icon: '💧', commerce_id: 'mon_plaisir' },
    { id: 'mp_13', name: 'Eau minérale 0.5L', price: 1.000, category: 'Boissons Fraîches', stock: 100, icon: '💧', commerce_id: 'mon_plaisir' },
];
const mp_clients: Client[] = [
    { id: 'mp_c1', name: 'Issam Bayaoui', email: 'mg.06sbz@gmail.com', phone: '+216 20 123 456', isVip: true, credit: 0, avatar: 'https://i.pravatar.cc/150?img=60', commerce_id: 'mon_plaisir' },
    { id: 'mp_c2', name: 'Ahmed Ben Ali', email: 'ahmed@email.com', phone: '+216 22 987 654', isVip: false, credit: 15.5, avatar: 'https://i.pravatar.cc/150?img=32', commerce_id: 'mon_plaisir' },
    { id: 'mp_c3', name: 'Fatma Gharbi', email: 'fatma.g@email.com', phone: '+216 55 111 222', isVip: true, credit: 120.0, avatar: 'https://i.pravatar.cc/150?img=31', commerce_id: 'mon_plaisir' },
];
const mp_employees: Employee[] = [
    { id: 'mp_e1', name: 'Mourad', role: 'Caissier', salary: 800, evaluation: 4.2, schedule: '16:00 - 23:00', workingDays: ['L', 'M', 'J', 'V', 'S', 'D'], joinDate: '15/01/2023', advance: 100, balance: 700, isTopEmployee: true, avatar: 'https://i.pravatar.cc/150?img=11', commerce_id: 'mon_plaisir' },
    { id: 'mp_e2', name: 'Fatma', role: 'Manager', salary: 1200, evaluation: 4.8, schedule: '10:00 - 18:00', workingDays: ['L', 'M', 'J', 'V', 'S'], joinDate: '01/03/2023', advance: 200, balance: 1000, isTopEmployee: true, avatar: 'https://i.pravatar.cc/150?img=16', commerce_id: 'mon_plaisir' },
];
const mp_orders: Order[] = [
  { id: 'mp_o1', items: [{ ...mp_products[0], quantity: 2 }], total: (1.7 * 2), clientName: 'Ahmed Ben Ali', timestamp: '2023-07-14T12:35:33Z', cashierId: '1', commerce_id: 'mon_plaisir' },
];
const mp_expenses: Expense[] = [
  { id: 'mp_ex1', description: 'Facture STEG', amount: 185.50, category: 'Services Publics', date: '10/07/2023', commerce_id: 'mon_plaisir' },
];

// ===================================
// DATA FOR: Café Chichkhan
// ===================================

const ck_products: Product[] = [
    { id: 'ck_1', name: 'Chicha', price: 10.000, category: 'Chicha', stock: 50, icon: '💨', commerce_id: 'chichkhan' },
    { id: 'ck_2', name: 'Café Turc', price: 2.500, category: 'Boissons Chaudes', stock: 100, icon: '☕', commerce_id: 'chichkhan' },
    { id: 'ck_3', name: 'Thé à la menthe', price: 2.000, category: 'Thé', stock: 100, icon: '🍵', commerce_id: 'chichkhan' },
    { id: 'ck_4', name: 'Mojito', price: 7.000, category: 'Cocktails', stock: 40, icon: '🍹', commerce_id: 'chichkhan' },
    { id: 'ck_5', name: 'Crêpe Nutella', price: 6.500, category: 'Desserts', stock: 50, icon: '🥞', commerce_id: 'chichkhan' },
];
const ck_clients: Client[] = [
    { id: 'ck_c1', name: 'Leila Ketari', email: 'leila@email.com', phone: '+216 50 111 222', isVip: true, credit: 25.0, avatar: 'https://i.pravatar.cc/150?img=45', commerce_id: 'chichkhan' },
    { id: 'ck_c2', name: 'Hassen Bouzid', email: 'hassen@email.com', phone: '+216 53 333 444', isVip: false, credit: 0, avatar: 'https://i.pravatar.cc/150?img=68', commerce_id: 'chichkhan' },
];
const ck_employees: Employee[] = [
    { id: 'ck_e1', name: 'Ali', role: 'Manager', salary: 1500, evaluation: 4.9, schedule: '18:00 - 02:00', workingDays: ['L', 'M', 'J', 'V', 'S', 'D'], joinDate: '01/01/2022', advance: 0, balance: 1500, isTopEmployee: true, avatar: 'https://i.pravatar.cc/150?img=53', commerce_id: 'chichkhan' },
];
const ck_orders: Order[] = [];
const ck_expenses: Expense[] = [
    { id: 'ck_ex1', description: 'Achat Tabac Chicha', amount: 500, category: 'Fournitures', date: '15/07/2023', commerce_id: 'chichkhan' },
];


// ===================================
// COMBINED INITIAL DATA
// ===================================

export const initialProducts: Product[] = [...mp_products, ...ck_products];
export const initialClients: Client[] = [...mp_clients, ...ck_clients];
export const initialEmployees: Employee[] = [...mp_employees, ...ck_employees];
export const initialOrders: Order[] = [...mp_orders, ...ck_orders];
export const initialExpenses: Expense[] = [...mp_expenses, ...ck_expenses];
