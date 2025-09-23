# Analyse de l'Architecture pour Claude

Bonjour Claude,

Voici les extraits de code pertinents de notre application Next.js / Supabase pour ton analyse, comme demandé.

L'objectif est de valider l'architecture actuelle basée sur les Server Actions et de s'assurer qu'elle est propre et robuste.

---

## 1. Exemple de Server Actions (`src/app/actions/mutations.ts`)

Ce fichier centralise les opérations d'écriture (Créer, Mettre à jour, Supprimer) dans la base de données. Il est exécuté exclusivement côté serveur.

```typescript
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Commerce, Product, Client, Employee, Expense, Order } from '../(app)/app-provider';
import { add } from 'date-fns';
import { randomUUID } from 'crypto';

// General purpose function to handle mutations
async function handleMutation(callback: (supabase: any) => Promise<any>) {
    const supabase = createServerActionClient({ cookies });
    try {
        const { data, error } = await callback(supabase);
        if (error) {
            console.error('Supabase mutation error:', error.message);
            return { data: null, error: error.message };
        }
        revalidatePath('/'); // Revalidate all paths for simplicity
        return { data, error: null };
    } catch (e: any) {
        console.error('Server action error:', e.message);
        return { data: null, error: e.message };
    }
}


// Product Mutations
export async function addProduct(productData: Omit<Product, 'id'>) {
    return handleMutation(supabase => supabase.from('products').insert(productData));
}
export async function updateProduct(id: string, productData: Partial<Product>) {
    return handleMutation(supabase => supabase.from('products').update(productData).eq('id', id));
}
export async function deleteProduct(id: string) {
    return handleMutation(supabase => supabase.from('products').delete().eq('id', id));
}

// Other mutations (addClient, updateClient, etc.) follow the same pattern...
```

---

## 2. AppProvider (`src/app/(app)/app-provider.tsx`)

Ce provider gère l'état global de l'application (utilisateur connecté, données des commerces, etc.) et appelle les Server Actions pour récupérer les données initiales.

```typescript
'use client';

import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { fetchAllDataForAdmin, fetchDataForCommerce } from '@/app/actions/data';

// ... (Définitions des types : Product, Client, etc.)

type AppContextType = {
  user: AppUser | null;
  // ... autres états
  fetchData: () => Promise<void>;
  // ...
};

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  // ... autres états (clients, orders, etc.)
  const [syncStatus, setSyncStatus] = useState<'offline' | 'syncing' | 'synced' | 'error'>('synced');
  const [viewedCommerceId, setViewedCommerceId] = useState<string | null>(null);


  const fetchData = useCallback(async () => {
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

        // Logique pour filtrer et setter les états (setProducts, setClients, etc.)
        // ...

        setSyncStatus('synced');
    } catch (error: any) {
        console.error("Failed to fetch data:", error.message);
        setSyncStatus('error');
    }
  }, [user, viewedCommerceId]);

  useEffect(() => {
    if (user) {
        fetchData();
    }
  }, [user, fetchData]);

  // ...

  const value: AppContextType = {
    user, setUser,
    products, setProducts,
    // ...
    fetchData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
```

---

## 3. Composant Client (`src/app/(app)/inventory/inventory-screen.tsx`)

Ce composant gère l'inventaire. Il utilise le hook `useApp` pour accéder à l'état et appelle les Server Actions (comme `addProduct`, `deleteProduct`) pour modifier les données.

```typescript
'use client';

import React, { useState } from 'react';
import { useApp, Product } from '@/app/(app)/app-provider';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
// Import des Server Actions
import { addProduct, updateProduct, deleteProduct } from '@/app/actions/mutations';

export const InventoryScreen: React.FC = () => {
  const { products, user, viewedCommerceId, fetchData } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const { toast } = useToast();

  const commerceId = user?.isSuperAdmin ? viewedCommerceId : user?.commerceId;

  const handleSave = async () => {
    if (!formData.name || !formData.price || !commerceId) return;
  
    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, formData);
      if (!result.error) {
        toast({ variant: 'success', title: 'Produit mis à jour' });
      }
    } else {
      const newProductData: Omit<Product, 'id'> = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category || 'Café',
        stock: Number(formData.stock) || 0,
        icon: formData.icon || '📦',
        commerce_id: commerceId,
      };
      result = await addProduct(newProductData);
      if (!result.error) {
        toast({ variant: 'success', title: 'Produit ajouté' });
      }
    }

    if (result.error) {
      toast({ variant: 'destructive', title: 'Erreur', description: result.error });
    } else {
      await fetchData(); // Re-fetch data to update the UI
    }
  
    setIsModalOpen(false);
  };
  
  const handleDeleteProduct = async (id: string) => {
    const result = await deleteProduct(id);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Erreur', description: result.error });
    } else {
      toast({ variant: 'success', title: 'Produit supprimé' });
      await fetchData(); // Re-fetch data
    }
  };

  // ... (JSX pour l'interface)
  return (
    <div>
      {/* ... UI Components ... */}
    </div>
  );
};
```

Merci de ton aide pour la revue !
