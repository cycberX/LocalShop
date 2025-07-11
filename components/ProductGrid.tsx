"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/useCart"
import { ShoppingCart, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

interface Store {
  _id: string
  name: string
}

interface ProductGridProps {
  store: Store
}

export default function ProductGrid({ store }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showStoreAlert, setShowStoreAlert] = useState(false)

  const { addItem, canAddFromStore, storeId, storeName } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [store._id])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/products?storeId=${store._id}&limit=20`)

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      setProducts(data.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    if (!canAddFromStore(store._id)) {
      setShowStoreAlert(true)
      setTimeout(() => setShowStoreAlert(false), 5000)
      return
    }

    addItem(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
      store._id,
      store.name,
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchProducts} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Products from {store.name}</h2>
        <Badge variant="outline">{products.length} items</Badge>
      </div>

      {showStoreAlert && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You can only add products from one store at a time. Your cart currently contains items from{" "}
            <strong>{storeName}</strong>. Please checkout or clear your cart to add items from {store.name}.
          </AlertDescription>
        </Alert>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No products available at this store</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card key={product._id} className="group hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <Image
                  src={product.image || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
                {product.stock > 0 && product.stock <= 5 && (
                  <p className="text-xs text-orange-600 mt-1">Only {product.stock} left!</p>
                )}
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full"
                  variant={canAddFromStore(store._id) ? "default" : "outline"}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
