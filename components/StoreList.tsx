"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"

interface StoreItem {
  _id: string
  name: string
  description: string
  address: string
  phone: string
  distance?: number
  isOpen?: boolean
}

interface StoreListProps {
  latitude: number
  longitude: number
  onStoreSelect: (store: StoreItem) => void
  selectedStoreId: string | null
}

export default function StoreList({ latitude, longitude, onStoreSelect, selectedStoreId }: StoreListProps) {
  const [stores, setStores] = useState<StoreItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNearbyStores()
  }, [latitude, longitude])

  const fetchNearbyStores = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/stores/nearby?lat=${latitude}&lng=${longitude}&radius=10`)

      if (!response.ok) {
        throw new Error("Failed to fetch stores")
      }

      const data = await response.json()

      // Add mock distance and opening hours for demo
      const storesWithMeta = data.stores.map((store: StoreItem, index: number) => ({
        ...store,
        distance: Math.round((Math.random() * 5 + 0.5) * 10) / 10, // 0.5-5.5 km
        isOpen: Math.random() > 0.2, // 80% chance of being open
      }))

      setStores(storesWithMeta)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stores")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Nearby Stores</h2>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchNearbyStores} className="text-blue-600 hover:text-blue-700 font-medium">
          Try Again
        </button>
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No stores found in your area</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Nearby Stores ({stores.length})</h2>

      <div className="grid gap-4">
        {stores.map((store) => (
          <Card
            key={store._id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedStoreId === store._id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
            }`}
            onClick={() => onStoreSelect(store)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{store.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant={store.isOpen ? "default" : "secondary"}>
                    <Clock className="h-3 w-3 mr-1" />
                    {store.isOpen ? "Open" : "Closed"}
                  </Badge>
                  {store.distance && (
                    <Badge variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      {store.distance} km
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">{store.description}</p>

              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {store.address}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
