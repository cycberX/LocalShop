import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface SimilarProduct {
  _id: string
  name: string
  price: number
  image: string
  rating: number
  storeId: {
    _id: string
    name: string
  }
}

interface SimilarProductsCarouselProps {
  productId: string
}

async function getSimilarProducts(productId: string): Promise<SimilarProduct[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/products/similar?productId=${productId}`,
      { cache: "no-store" },
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error("Error fetching similar products:", error)
    return []
  }
}

export default async function SimilarProductsCarousel({ productId }: SimilarProductsCarouselProps) {
  const similarProducts = await getSimilarProducts(productId)

  if (similarProducts.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Similar Products</h2>

      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4" style={{ width: "max-content" }}>
          {similarProducts.map((product) => (
            <Link key={product._id} href={`/products/${product._id}`} className="flex-shrink-0 w-64 group">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg?height=256&width=256"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                    {product.name}
                  </h3>

                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
                    <Badge variant="outline" className="text-xs">
                      {product.storeId.name}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
