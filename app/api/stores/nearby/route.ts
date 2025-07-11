import { type NextRequest, NextResponse } from "next/server"

// Mock store data for demonstration
const mockStores = [
  {
    _id: "store1",
    name: "Fresh Market Downtown",
    description: "Your neighborhood grocery store with fresh produce and daily essentials",
    address: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    location: {
      type: "Point",
      coordinates: [-74.006, 40.7128], // NYC coordinates
    },
  },
  {
    _id: "store2",
    name: "Tech Hub Electronics",
    description: "Latest gadgets, computers, and electronic accessories",
    address: "456 Tech Avenue, Midtown",
    phone: "(555) 234-5678",
    location: {
      type: "Point",
      coordinates: [-74.007, 40.7138],
    },
  },
  {
    _id: "store3",
    name: "Artisan Coffee & Books",
    description: "Specialty coffee, pastries, and curated book collection",
    address: "789 Literary Lane, Arts District",
    phone: "(555) 345-6789",
    location: {
      type: "Point",
      coordinates: [-74.008, 40.7148],
    },
  },
  {
    _id: "store4",
    name: "Green Garden Supplies",
    description: "Plants, gardening tools, and outdoor living essentials",
    address: "321 Garden Way, Suburbs",
    phone: "(555) 456-7890",
    location: {
      type: "Point",
      coordinates: [-74.009, 40.7158],
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const radius = searchParams.get("radius") || "10"

    if (!lat || !lng) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
    }

    // In a real app, you would query your database with geospatial queries
    // For demo purposes, we'll return mock stores
    const stores = mockStores

    return NextResponse.json({ stores })
  } catch (error) {
    console.error("Error fetching nearby stores:", error)
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 })
  }
}
