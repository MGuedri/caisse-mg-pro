
'use client';

import React, { useState, useCallback } from 'react';
import { useApp, CartItem, Order } from '@/app/(app)/app-provider';
import {
  Card, CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus, Minus, Trash2, CreditCard, ShoppingCart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addOrder } from '@/app/actions/mutations';

export const CartView: React.FC<{onClose?: () => void}> = ({onClose}) => {
  const { cart, setCart, clients, includeVAT, setIncludeVAT, user, viewedCommerceId, fetchData } = useApp();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedClient, setSelectedClient] = useState('Client invité');
  const { toast } = useToast();

  const commerceId = user?.isSuperAdmin ? viewedCommerceId : user?.commerceId;

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

  const handlePayment = async () => {
    if (cart.length === 0 || !user || !commerceId) return;
    
    const newOrderData: Omit<Order, 'id'> = {
      timestamp: new Date().toISOString(),
      items: [...cart],
      total,
      clientName: selectedClient,
      cashierId: user.id,
      commerce_id: commerceId,
    };

    const result = await addOrder(newOrderData);
    
    if (result.error) {
      toast({ variant: 'destructive', title: 'Erreur', description: result.error });
    } else {
      toast({variant: 'success', title: 'Commande enregistrée'});
      await fetchData(); // Refresh data to show new order
      setCart([]);
      setIsPaymentOpen(false);
      setPaymentAmount('');
      setSelectedClient('Client invité');
      if (onClose) onClose();
    }
  };

  return (
    <div className="bg-gray-800 h-full p-6 flex flex-col">
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
                    {(item.price * item.quantity).toFixed(3)} DT
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
                <span className="text-white">{subtotal.toFixed(3)} DT</span>
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
                <span className="text-gray-300">{vatAmount.toFixed(3)} DT</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-700">
                <span className="text-lg font-bold text-white">Total:</span>
                <span className="text-2xl font-bold text-orange-500">
                  {total.toFixed(3)} DT
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
                      Total à payer: <span className="text-orange-500 font-bold">{total.toFixed(3)} DT</span>
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
                        {change.toFixed(3)} DT
                      </p>
                    </div>
                  )}
                  
                </div>
                <DialogFooter>
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
  )
}
