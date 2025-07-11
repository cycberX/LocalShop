import { Suspense } from "react"
import { notFound } from "next/navigation"
import ProductDetailCard from "@/components/ProductDetailCard"
import PriceComparisonList from "@/components/PriceComparisonList"
import StoreOffers from "@/components/StoreOffers"
import SimilarProductsCarousel from "@/components/SimilarProductsCarousel"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/products/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

// Mock geolocation for server-side rendering
async function getUserLocation() {
  // In a real app, you might get this from cookies, session, or IP geolocation
  return { lat: 40.7128, lng: -74.006 } // NYC coordinates
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const userLocation = await getUserLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Product Details */}
          <div className="lg:col-span-2 space-y-6">
            <ProductDetailCard product={product} />

            {/* Price Comparison */}
            <Suspense fallback={<PriceComparisonSkeleton />}>
              <PriceComparisonList
                productId={product._id}
                currentPrice={product.price}
                currentStoreId={product.storeId._id}
                lat={userLocation.lat}
                lng={userLocation.lng}
              />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Store Offers */}
            <Suspense fallback={<StoreOffersSkeleton />}>
              <StoreOffers storeId={product.storeId._id} />
            </Suspense>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-12">
          <Suspense fallback={<SimilarProductsSkeleton />}>
            <SimilarProductsCarousel productId={product._id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// Loading Skeletons
function PriceComparisonSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center p-3 border rounded">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function StoreOffersSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-3 border rounded">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SimilarProductsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="flex space-x-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-64">
            <Card>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4 mb-2" />
                <Skeleton className="h-5 w-20" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} - LocalShop`,
    description: product.description,
  }
}
