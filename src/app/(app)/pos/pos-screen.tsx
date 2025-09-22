'use client';

import React, { useState, useCallback } from 'react';
import { useApp, Product } from '@/app/(app)/app-provider';
import {
  Card, CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Search,
  ShoppingCart,
} from 'lucide-react';
import { CartView } from './cart-view';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';


export const POSScreen: React.FC = () => {
  const { products, cart, setCart } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = ['Tous', ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  }, [setCart]);
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="md:flex h-[calc(100vh-65px)] bg-gray-900 text-white relative">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`${selectedCategory === category 
                  ? "bg-orange-500 hover:bg-orange-600" 
                  : "border-gray-700 text-gray-300 hover:bg-gray-800"} shrink-0`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <Card 
              key={product.id} 
              className="cursor-pointer bg-gray-800 border-gray-700 transition-transform transform hover:scale-105"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">{product.icon}</div>
                <h3 className="font-semibold text-white mb-1 truncate">{product.name}</h3>
                <p className="text-orange-500 font-bold text-lg">{product.price.toFixed(3)} DT</p>
                <p className="text-gray-400 text-sm">Stock: {product.stock}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Desktop Cart */}
      <div className="w-96 border-l border-gray-700 hidden md:block">
        <CartView />
      </div>

      {/* Mobile Cart */}
      <div className="md:hidden">
         {cartItemCount > 0 && (
           <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button className="fixed bottom-4 right-4 h-16 w-16 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg">
                  <ShoppingCart className="h-8 w-8" />
                   <Badge className="absolute -top-1 -right-1">{cartItemCount}</Badge>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 border-none w-full max-w-sm sm:max-w-md">
                 <SheetHeader>
                   <SheetTitle>
                     <VisuallyHidden>Shopping Cart</VisuallyHidden>
                   </SheetTitle>
                 </SheetHeader>
                 <CartView onClose={() => setIsCartOpen(false)}/>
              </SheetContent>
           </Sheet>
         )}
      </div>
    </div>
  );
};
