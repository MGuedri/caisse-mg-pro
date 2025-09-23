
export interface Commerce {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  subscription: 'Active' | 'Inactive' | 'Trial';
  creationDate: string;
}

export const initialCommerces: Commerce[] = [
  {
    id: 'mon_plaisir',
    name: 'Café Mon Plaisir',
    ownerName: 'Issam Bayaoui',
    ownerEmail: 'mg.06sbz@gmail.com',
    subscription: 'Active',
    creationDate: '2023-01-15'
  },
  {
    id: 'chichkhan',
    name: 'Café Chichkhan',
    ownerName: 'Ali',
    ownerEmail: 'chichkhan@email.com',
    subscription: 'Trial',
    creationDate: '2023-06-01'
  }
];
