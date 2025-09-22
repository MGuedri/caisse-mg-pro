"use client"

import * as React from "react"
import Image from "next/image"
import { PlusCircle, MinusCircle, Trash2, X, ShoppingCart } from "lucide-react"

import { products } from "@/lib/data"
import type { CartItem, Product } from "@/lib/types"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-[4/3] w-full">
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" data-ai-hint={`${product.category} ${product.name}`} />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground">{product.category}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
        <Button onClick={() => onAddToCart(product)} size="sm">Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}

export default function POSPage() {
  const [cart, setCart] = React.useState<CartItem[]>([])
  const { toast } = useToast()

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
    toast({ title: "Added to cart", description: `${product.name} was added to your cart.` })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.product.id !== productId)
      }
      return prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    })
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <PageHeader title="Point of Sale" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
        <div className="lg:col-span-2 h-full overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
        
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ShoppingCart className="w-16 h-16" />
                <p className="mt-4">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="flex-grow">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <MinusCircle className="w-4 h-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <PlusCircle className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="w-16 text-right font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="w-6 h-6 text-destructive" onClick={() => updateQuantity(item.product.id, 0)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {cart.length > 0 && (
            <CardFooter className="flex-col gap-4 !p-6">
              <Separator />
              <div className="flex justify-between items-center w-full font-semibold text-lg">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" onClick={clearCart}>
                  <Trash2 className="w-4 h-4 mr-2"/> Clear Cart
                </Button>
                <Button>Checkout</Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
