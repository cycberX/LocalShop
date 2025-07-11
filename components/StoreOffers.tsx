import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Percent, Clock } from "lucide-react"

interface Offer {
  id: string
  title: string
  description: string
  type: "discount" | "bogo" | "free_shipping" | "bundle"
  value: string
  validUntil: string
  minPurchase?: number
}

interface StoreOffersProps {
  storeId: string
}

async function getStoreOffers(storeId: string): Promise<Offer[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/stores/${storeId}/offers`,
      { cache: "no-store" },
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.offers || []
  } catch (error) {
    console.error("Error fetching store offers:", error)
    return []
  }
}

export default async function StoreOffers({ storeId }: StoreOffersProps) {
  const offers = await getStoreOffers(storeId)

  if (offers.length === 0) {
    return null
  }

  const getOfferIcon = (type: string) => {
    switch (type) {
      case "discount":
        return <Percent className="h-4 w-4" />
      case "bogo":
        return <Gift className="h-4 w-4" />
      default:
        return <Gift className="h-4 w-4" />
    }
  }

  const getOfferColor = (type: string) => {
    switch (type) {
      case "discount":
        return "bg-red-500"
      case "bogo":
        return "bg-purple-500"
      case "free_shipping":
        return "bg-blue-500"
      case "bundle":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gift className="h-5 w-5" />
          <span>Store Offers</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {offers.map((offer) => (
          <div key={offer.id} className="p-4 border border-dashed border-orange-200 bg-orange-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Badge className={`${getOfferColor(offer.type)} flex items-center space-x-1`}>
                {getOfferIcon(offer.type)}
                <span>{offer.value}</span>
              </Badge>

              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{offer.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{offer.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                  </div>

                  {offer.minPurchase && <span>Min. purchase: ${offer.minPurchase}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
