
'use client';

import React, { useState, useTransition } from 'react';
import { useApp, Product } from '@/app/(app)/app-provider';
import {
  Card, CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  Plus, Trash2, Edit, Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addProduct, updateProduct, deleteProduct } from '@/app/actions/mutations';


export const InventoryScreen: React.FC = () => {
  const { products, user, viewedCommerceId } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Café',
    stock: 0,
    icon: '☕'
  });
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const commerceId = user?.isSuperAdmin ? viewedCommerceId : user?.commerceId;

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
  
  const handleSave = async () => {
    if (!formData.name || !formData.price || !commerceId) return;
  
    startTransition(async () => {
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
        setIsModalOpen(false);
        setEditingProduct(null);
      }
    });
  };
  

  const handleDeleteProduct = async (id: string) => {
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.error) {
        toast({ variant: 'destructive', title: 'Erreur', description: result.error });
      } else {
        toast({ variant: 'success', title: 'Produit supprimé' });
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Inventaire</h1>
        <Button onClick={openModalForAdd} className="bg-orange-500 hover:bg-orange-600" disabled={isPending}>
           {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Plus className="mr-2 h-4 w-4" /> }
           Ajouter
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map(product => (
          <Card key={product.id} className="bg-gray-800 border-gray-700 flex flex-col">
            <CardContent className="p-4 flex-grow text-center">
              <div className="text-4xl mb-2">{product.icon}</div>
              <h3 className="font-semibold text-white">{product.name}</h3>
              <p className="text-orange-500 font-bold">{product.price.toFixed(3)} DT</p>
              <p className="text-gray-400">Stock: {product.stock}</p>
              <Badge variant="outline" className="mt-2 text-gray-400 border-gray-600">{product.category}</Badge>
            </CardContent>
            <div className="flex gap-2 p-4 border-t border-gray-700">
                <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300" onClick={() => openModalForEdit(product)} disabled={isPending}>
                  <Edit className="h-3 w-3 mr-1" /> Modifier
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="flex-1" disabled={isPending}>
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
            <Input type="number" step="0.001" placeholder="Prix (DT)" value={formData.price || ''} onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} className="bg-gray-700 border-gray-600" />
            <Input placeholder="Catégorie" value={formData.category || ''} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} className="bg-gray-700 border-gray-600" />
            <Input type="number" placeholder="Stock" value={formData.stock || ''} onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value, 10) || 0 }))} className="bg-gray-700 border-gray-600" />
            <Input placeholder="Icône (emoji)" value={formData.icon || ''} onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))} className="bg-gray-700 border-gray-600" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-gray-600">Annuler</Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600" disabled={isPending || !formData.name || !formData.price}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
              {editingProduct ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
