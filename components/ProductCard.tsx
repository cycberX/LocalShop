"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCart } from "@/hooks/useCart"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
  storeId: {
    _id: string
    name: string
  }
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      storeId: product.storeId._id,
    })
  }

  return (
    <Card className="overflow-hidden">
      <Link href={`/products/${product._id}`}>
        <div className="aspect-square relative">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <p className="text-sm text-gray-500 mb-2">by {product.storeId.name}</p>
        <p className="text-xl font-bold text-green-600">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
