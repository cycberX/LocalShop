"use client"

import { useState } from "react"
import { useGeolocation } from "@/hooks/useGeolocation"
import { useCart } from "@/hooks/useCart"
import LocationPermission from "@/components/LocationPermission"
import StoreList from "@/components/StoreList"
import ProductGrid from "@/components/ProductGrid"
import CartPanel from "@/components/CartPanel"
import CheckoutButton from "@/components/CheckoutButton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle } from "lucide-react"

interface Store {
  _id: string
  name: string
  description: string
  address: string
  phone: string
}

export default function HomePage() {
  const { latitude, longitude, error, loading, permissionDenied, hasLocation, requestLocation, address } =
    useGeolocation()

  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const { isOpen: cartOpen } = useCart()

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store)
  }

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    setCheckoutMessage(null)

    // CheckoutButton component handles the actual checkout logic
  }

  const handleCheckoutComplete = () => {
    setCheckoutLoading(false)
    setCheckoutMessage({
      type: "success",
      text: "Redirecting to payment...",
    })
  }

  const handleCheckoutError = (error: string) => {
    setCheckoutLoading(false)
    setCheckoutMessage({
      type: "error",
      text: error,
    })
  }

  // Show location permission screen if location not available
  if (!hasLocation) {
    return (
      <LocationPermission
        onRequestLocation={requestLocation}
        loading={loading}
        error={error}
        permissionDenied={permissionDenied}
        address={address}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Checkout Messages */}
        {checkoutMessage && (
          <Alert
            className={`mb-6 ${
              checkoutMessage.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            }`}
          >
            {checkoutMessage.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={checkoutMessage.type === "success" ? "text-green-800" : "text-red-800"}>
              {checkoutMessage.text}
            </AlertDescription>
          </Alert>
        )}

        <div className={`grid gap-8 ${cartOpen ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
          {/* Store List */}
          <div className="space-y-6">
            <StoreList
              latitude={latitude!}
              longitude={longitude!}
              onStoreSelect={handleStoreSelect}
              selectedStoreId={selectedStore?._id || null}
            />
          </div>

          {/* Product Grid */}
          <div className="space-y-6">
            {selectedStore ? (
              <ProductGrid store={selectedStore} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Store</h3>
                <p className="text-gray-600">Choose a store from the list to view their products</p>
              </div>
            )}
          </div>

          {/* Cart Panel */}
          {cartOpen && (
            <div className="lg:block">
              <CartPanel onCheckout={handleCheckout} checkoutLoading={checkoutLoading} />
            </div>
          )}
        </div>

        {/* Mobile Cart Panel */}
        <CartPanel onCheckout={handleCheckout} checkoutLoading={checkoutLoading} />

        {/* Hidden Checkout Button for functionality */}
        <div className="hidden">
          <CheckoutButton
            onCheckoutStart={() => setCheckoutLoading(true)}
            onCheckoutComplete={handleCheckoutComplete}
            onCheckoutError={handleCheckoutError}
          />
        </div>
      </div>
    </div>
  )
}
