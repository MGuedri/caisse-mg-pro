export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
};

export type Order = {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
};

export type CartItem = {
  product: Product;
  quantity: number;
};
