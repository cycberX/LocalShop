"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { CreditCard } from "lucide-react"

interface CheckoutButtonProps {
  onCheckoutStart?: () => void
  onCheckoutComplete?: () => void
  onCheckoutError?: (error: string) => void
}

export default function CheckoutButton({ onCheckoutStart, onCheckoutComplete, onCheckoutError }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const { items, storeId, total, clearCart } = useCart()

  const handleCheckout = async () => {
    if (items.length === 0 || !storeId) {
      onCheckoutError?.("Cart is empty")
      return
    }

    setLoading(true)
    onCheckoutStart?.()

    try {
      // Create order first
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          storeId,
          totalAmount: total,
          deliveryAddress: "123 Main St", // This would come from a form
          phone: "555-0123", // This would come from a form
        }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const order = await orderResponse.json()

      // Create Stripe checkout session
      const paymentResponse = await fetch("/api/payments/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order._id,
          storeId,
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error("Failed to create payment session")
      }

      const { url } = await paymentResponse.json()

      // Clear cart and redirect to Stripe
      clearCart()
      onCheckoutComplete?.()
      window.location.href = url
    } catch (error) {
      console.error("Checkout error:", error)
      onCheckoutError?.(error instanceof Error ? error.message : "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading || items.length === 0} className="w-full" size="lg">
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          Checkout ${total.toFixed(2)}
        </>
      )}
    </Button>
  )
}
