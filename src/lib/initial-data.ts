
export const defaultProducts = [
  { name: 'Espresso', price: 2.500, category: 'Café', stock: 100, icon: '☕' },
  { name: 'Café Crème', price: 3.000, category: 'Café', stock: 100, icon: '☕' },
  { name: 'Capriccio', price: 3.500, category: 'Café', stock: 100, icon: '☕' },
  { name: 'Café Americano', price: 3.000, category: 'Café', stock: 100, icon: '☕' },
  { name: 'Thé à la menthe', price: 2.500, category: 'Thé', stock: 100, icon: '🍵' },
  { name: 'Thé infusion', price: 2.500, category: 'Thé', stock: 100, icon: '🍵' },
  { name: 'Jus d\'orange', price: 4.000, category: 'Jus', stock: 100, icon: '🍊' },
  { name: 'Jus de citron', price: 3.500, category: 'Jus', stock: 100, icon: '🍋' },
  { name: 'Mojito', price: 5.000, category: 'Jus', stock: 100, icon: '🍹' },
  { name: 'Eau Minérale 0.5L', price: 1.000, category: 'Eau', stock: 100, icon: '💧' },
  { name: 'Eau Minérale 1L', price: 1.500, category: 'Eau', stock: 100, icon: '💧' },
  { name: 'Croissant', price: 1.500, category: 'Viennoiserie', stock: 100, icon: '🥐' },
  { name: 'Pain au chocolat', price: 1.800, category: 'Viennoiserie', stock: 100, icon: '🍫' },
];

export const defaultClients = [
    { name: 'Client A', email: 'client.a@email.com', phone: '11223344', isVip: true, credit: 15.500, avatar: 'https://i.pravatar.cc/150?u=client1' },
    { name: 'Client B', email: 'client.b@email.com', phone: '55667788', isVip: false, credit: 0, avatar: 'https://i.pravatar.cc/150?u=client2' },
];

export const defaultEmployees = [
    { 
        name: 'Employé 1', 
        role: 'Caissier', 
        salary: 1200, 
        evaluation: 4.5, 
        schedule: '08:00 - 16:00', 
        workingDays: ['L', 'M', 'J', 'V', 'S'], 
        joinDate: '01/01/2023', 
        advance: 100, 
        balance: 1100, 
        isTopEmployee: true, 
        avatar: 'https://i.pravatar.cc/150?u=emp1' 
    },
];

export const defaultExpenses = [
    { description: 'Achat de café', amount: 150, category: 'Fournitures', date: new Date().toLocaleDateString('fr-CA') },
    { description: 'Facture STEG', amount: 250, category: 'Services', date: new Date().toLocaleDateString('fr-CA') },
];
