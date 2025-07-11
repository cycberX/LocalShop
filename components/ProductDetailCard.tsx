"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/useCart"
import { Star, ShoppingCart, AlertTriangle, Package, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviewCount: number
  stock: number
  storeId: {
    _id: string
    name: string
    address: string
  }
}

interface ProductDetailCardProps {
  product: Product
}

export default function ProductDetailCard({ product }: ProductDetailCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [showAlert, setShowAlert] = useState(false)
  const { addItem, canAddFromStore, storeId, storeName } = useCart()

  const handleAddToCart = () => {
    if (!canAddFromStore(product.storeId._id)) {
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
      return
    }

    addItem(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      },
      product.storeId._id,
      product.storeId.name,
    )
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Alert for different store */}
      {showAlert && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You can only order from one store at a time. Your cart currently contains items from{" "}
            <strong>{storeName}</strong>. Clear your cart or checkout first to add items from {product.storeId.name}.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="relative aspect-square">
              <Image
                src={product.image || "/placeholder.svg?height=500&width=500"}
                alt={product.name}
                fill
                className="object-cover rounded-l-lg"
                priority
              />
              {product.stock <= 5 && product.stock > 0 && (
                <Badge className="absolute top-4 left-4 bg-orange-500">Only {product.stock} left!</Badge>
              )}
              {product.stock === 0 && <Badge className="absolute top-4 left-4 bg-red-500">Out of Stock</Badge>}
            </div>

            {/* Product Info */}
            <div className="p-6 space-y-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">{renderStars(product.rating)}</div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="text-3xl font-bold text-green-600 mb-4">${product.price.toFixed(2)}</div>
              </div>

              {/* Store Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Sold by {product.storeId.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{product.storeId.address}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="font-medium">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border rounded-md px-3 py-2 bg-white"
                    disabled={product.stock === 0}
                  >
                    {[...Array(Math.min(10, product.stock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <Button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full" size="lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>

                {/* Stock Info */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Package className="h-4 w-4" />
                  <span>{product.stock > 0 ? `${product.stock} items in stock` : "Currently out of stock"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
