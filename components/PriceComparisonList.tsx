import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingDown } from "lucide-react"
import SwitchStoreButton from "./SwitchStoreButton"

interface PriceComparison {
  storeId: string
  storeName: string
  storeAddress: string
  price: number
  distance: number
  inStock: boolean
  isCurrentStore: boolean
}

interface PriceComparisonListProps {
  productId: string
  currentPrice: number
  currentStoreId: string
  lat: number
  lng: number
}

async function getPriceComparisons(productId: string, lat: number, lng: number): Promise<PriceComparison[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/products/compare?productId=${productId}&lat=${lat}&lng=${lng}`,
      { cache: "no-store" },
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.comparisons || []
  } catch (error) {
    console.error("Error fetching price comparisons:", error)
    return []
  }
}

export default async function PriceComparisonList({
  productId,
  currentPrice,
  currentStoreId,
  lat,
  lng,
}: PriceComparisonListProps) {
  const comparisons = await getPriceComparisons(productId, lat, lng)

  if (comparisons.length === 0) {
    return null
  }

  // Find the lowest price
  const lowestPrice = Math.min(...comparisons.map((c) => c.price))
  const savings = currentPrice - lowestPrice

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingDown className="h-5 w-5" />
          <span>Price Comparison</span>
          {savings > 0 && (
            <Badge variant="destructive" className="ml-2">
              Save up to ${savings.toFixed(2)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {comparisons.map((comparison) => (
          <div
            key={comparison.storeId}
            className={`flex items-center justify-between p-4 border rounded-lg ${
              comparison.price === lowestPrice ? "border-green-200 bg-green-50" : "border-gray-200"
            } ${comparison.isCurrentStore ? "ring-2 ring-blue-200 bg-blue-50" : ""}`}
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium">{comparison.storeName}</h4>
                {comparison.isCurrentStore && (
                  <Badge variant="outline" className="text-xs">
                    Current Store
                  </Badge>
                )}
                {comparison.price === lowestPrice && <Badge className="bg-green-500 text-xs">Best Deal</Badge>}
                {!comparison.inStock && (
                  <Badge variant="destructive" className="text-xs">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-3 w-3" />
                <span>{comparison.storeAddress}</span>
                <span>•</span>
                <span>{comparison.distance.toFixed(1)} km away</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">${comparison.price.toFixed(2)}</div>
                {comparison.price < currentPrice && (
                  <div className="text-xs text-green-600">Save ${(currentPrice - comparison.price).toFixed(2)}</div>
                )}
              </div>

              {!comparison.isCurrentStore && comparison.inStock && (
                <SwitchStoreButton
                  storeId={comparison.storeId}
                  storeName={comparison.storeName}
                  productId={productId}
                />
              )}
            </div>
          </div>
        ))}

        <div className="text-xs text-gray-500 mt-4">Prices and availability are updated in real-time and may vary.</div>
      </CardContent>
    </Card>
  )
}
