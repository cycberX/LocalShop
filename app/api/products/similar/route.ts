import { type NextRequest, NextResponse } from "next/server"

// Mock similar products data
const mockSimilarProducts = {
  prod1: [
    {
      _id: "prod17",
      name: "Organic Apples",
      price: 3.49,
      image: "/placeholder.svg?height=256&width=256",
      rating: 4.6,
      storeId: {
        _id: "store1",
        name: "Fresh Market",
      },
    },
    {
      _id: "prod18",
      name: "Fresh Oranges",
      price: 2.79,
      image: "/placeholder.svg?height=256&width=256",
      rating: 4.4,
      storeId: {
        _id: "store2",
        name: "Green Grocers",
      },
    },
    {
      _id: "prod19",
      name: "Ripe Pears",
      price: 3.99,
      image: "/placeholder.svg?height=256&width=256",
      rating: 4.3,
      storeId: {
        _id: "store1",
        name: "Fresh Market",
      },
    },
    {
      _id: "prod20",
      name: "Sweet Grapes",
      price: 4.29,
      image: "/placeholder.svg?height=256&width=256",
      rating: 4.7,
      storeId: {
        _id: "store3",
        name: "Organic Plus",
      },
    },
  ],
  prod5: [
    {
      _id: "prod21",
      name: "Bluetooth Speaker",
      price: 89.99,
      image: "/placeholder.svg?height=256&width=256",
      rating: 4.5,
      storeId: {
        _id: "store2",
        name: "Tech Hub",
      },
    },
    {
      _id: "prod22",
      name: "Wireless Earbuds",
      price: 129.99,
      image: "/placeholder.svg?height=256&width=256",
      rating: 4.3,
      storeId: {
        _id: "store4",
        name: "Digital World",
      },
    },
    {
      _id: "prod23",
      name: "Smart Watch",
      price: 249.99,
      image: "/placeholder.svg?height=256&width=256",
      rating: 4.6,
      storeId: {
        _id: "store2",
        name: "Tech Hub",
      },
    },
    {
      _id: "prod24",
      name: "Phone Stand",
      price: 19.99,
      image: "/placeholder.svg?height=256&width=256",
      rating: 4.2,
      storeId: {
        _id: "store5",
        name: "Gadget Galaxy",
      },
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const products = mockSimilarProducts[productId as keyof typeof mockSimilarProducts] || []

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching similar products:", error)
    return NextResponse.json({ error: "Failed to fetch similar products" }, { status: 500 })
  }
}
