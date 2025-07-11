"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/useCart"
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"

interface CartPanelProps {
  onCheckout: () => void
  checkoutLoading: boolean
}

export default function CartPanel({ onCheckout, checkoutLoading }: CartPanelProps) {
  const { items, total, storeName, itemCount, isOpen, closeCart, updateQuantity, removeItem, clearCart } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={closeCart} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform lg:relative lg:shadow-lg lg:rounded-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Cart</h2>
              {itemCount > 0 && <Badge variant="secondary">{itemCount} items</Badge>}
            </div>
            <Button variant="ghost" size="sm" onClick={closeCart}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Add some products to get started!</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Store Info */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Shopping from: {storeName}</p>
                  <p className="text-xs text-blue-700">You can only order from one store at a time</p>
                </div>

                {/* Cart Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg?height=64&width=64"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-green-600 font-medium">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>

                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-green-600">${total.toFixed(2)}</span>
              </div>

              <Button onClick={onCheckout} disabled={checkoutLoading} className="w-full" size="lg">
                {checkoutLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  "Checkout"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
