import { type NextRequest, NextResponse } from "next/server"

// Mock price comparison data
const mockComparisons = {
  prod1: [
    {
      storeId: "store1",
      storeName: "Fresh Market Downtown",
      storeAddress: "123 Main Street, Downtown",
      price: 2.99,
      distance: 0.5,
      inStock: true,
      isCurrentStore: true,
    },
    {
      storeId: "store2",
      storeName: "Green Grocers",
      storeAddress: "456 Oak Avenue, Midtown",
      price: 2.49,
      distance: 1.2,
      inStock: true,
      isCurrentStore: false,
    },
    {
      storeId: "store3",
      storeName: "Organic Plus",
      storeAddress: "789 Pine Street, Uptown",
      price: 3.29,
      distance: 2.1,
      inStock: false,
      isCurrentStore: false,
    },
  ],
  prod5: [
    {
      storeId: "store2",
      storeName: "Tech Hub Electronics",
      storeAddress: "456 Tech Avenue, Midtown",
      price: 199.99,
      distance: 0.8,
      inStock: true,
      isCurrentStore: true,
    },
    {
      storeId: "store4",
      storeName: "Digital World",
      storeAddress: "321 Circuit Lane, Tech District",
      price: 189.99,
      distance: 1.5,
      inStock: true,
      isCurrentStore: false,
    },
    {
      storeId: "store5",
      storeName: "Gadget Galaxy",
      storeAddress: "654 Innovation Blvd, Future City",
      price: 209.99,
      distance: 3.2,
      inStock: true,
      isCurrentStore: false,
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")

    if (!productId || !lat || !lng) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Get comparisons for the product
    const comparisons = mockComparisons[productId as keyof typeof mockComparisons] || []

    // Sort by price (lowest first)
    const sortedComparisons = [...comparisons].sort((a, b) => a.price - b.price)

    return NextResponse.json({ comparisons: sortedComparisons })
  } catch (error) {
    console.error("Error fetching price comparisons:", error)
    return NextResponse.json({ error: "Failed to fetch price comparisons" }, { status: 500 })
  }
}
