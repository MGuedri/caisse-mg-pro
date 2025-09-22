import type { Product, Customer, Order } from './types';

export const products: Product[] = [
  { id: 'prod-001', name: 'Espresso', category: 'Coffee', price: 2.50, stock: 100, imageUrl: 'https://picsum.photos/seed/1/400/300' },
  { id: 'prod-002', name: 'Latte', category: 'Coffee', price: 3.50, stock: 100, imageUrl: 'https://picsum.photos/seed/2/400/300' },
  { id: 'prod-003', name: 'Cappuccino', category: 'Coffee', price: 3.50, stock: 80, imageUrl: 'https://picsum.photos/seed/3/400/300' },
  { id: 'prod-004', name: 'Croissant', category: 'Pastry', price: 2.75, stock: 50, imageUrl: 'https://picsum.photos/seed/4/400/300' },
  { id: 'prod-005', name: 'Muffin', category: 'Pastry', price: 3.00, stock: 60, imageUrl: 'https://picsum.photos/seed/5/400/300' },
  { id: 'prod-006', name: 'Orange Juice', category: 'Beverage', price: 4.00, stock: 70, imageUrl: 'https://picsum.photos/seed/6/400/300' },
  { id: 'prod-007', name: 'Iced Tea', category: 'Beverage', price: 3.25, stock: 90, imageUrl: 'https://picsum.photos/seed/7/400/300' },
  { id: 'prod-008', name: 'Bagel with Cream Cheese', category: 'Food', price: 4.50, stock: 40, imageUrl: 'https://picsum.photos/seed/8/400/300' },
  { id: 'prod-009', name: 'Americano', category: 'Coffee', price: 3.00, stock: 100, imageUrl: 'https://picsum.photos/seed/9/400/300' },
  { id: 'prod-010', name: 'Pain au Chocolat', category: 'Pastry', price: 3.25, stock: 50, imageUrl: 'https://picsum.photos/seed/10/400/300' },
  { id: 'prod-011', name: 'Water Bottle', category: 'Beverage', price: 1.50, stock: 150, imageUrl: 'https://picsum.photos/seed/11/400/300' },
  { id: 'prod-012', name: 'Breakfast Sandwich', category: 'Food', price: 5.50, stock: 30, imageUrl: 'https://picsum.photos/seed/12/400/300' },
];

export const customers: Customer[] = [
  { id: 'cust-001', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', totalSpent: 125.50 },
  { id: 'cust-002', name: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', totalSpent: 250.75 },
  { id: 'cust-003', name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-0103', totalSpent: 75.00 },
  { id: 'cust-004', name: 'Diana Prince', email: 'diana@example.com', phone: '555-0104', totalSpent: 500.20 },
  { id: 'cust-005', name: 'Ethan Hunt', email: 'ethan@example.com', phone: '555-0105', totalSpent: 320.00 },
];

export const orders: Order[] = [
  { id: 'ord-001', customerName: 'Alice Johnson', date: '2024-07-29', total: 12.50, status: 'Completed' },
  { id: 'ord-002', customerName: 'Bob Smith', date: '2024-07-29', total: 8.75, status: 'Completed' },
  { id: 'ord-003', customerName: 'Charlie Brown', date: '2024-07-28', total: 5.50, status: 'Completed' },
  { id: 'ord-004', customerName: 'Walk-in Customer', date: '2024-07-28', total: 15.00, status: 'Completed' },
  { id: 'ord-005', customerName: 'Diana Prince', date: '2024-07-27', total: 22.25, status: 'Completed' },
];

export const salesData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];
