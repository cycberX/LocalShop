import { type NextRequest, NextResponse } from "next/server"

// Mock product data
const mockProducts = {
  prod1: {
    _id: "prod1",
    name: "Organic Bananas",
    description:
      "Fresh organic bananas, perfect for smoothies and snacks. Grown without pesticides and harvested at peak ripeness for maximum flavor and nutrition. Rich in potassium, vitamin B6, and dietary fiber.",
    price: 2.99,
    image: "/placeholder.svg?height=500&width=500",
    category: "Fruits",
    rating: 4.5,
    reviewCount: 128,
    stock: 25,
    storeId: {
      _id: "store1",
      name: "Fresh Market Downtown",
      address: "123 Main Street, Downtown",
    },
  },
  prod5: {
    _id: "prod5",
    name: "Wireless Headphones",
    description:
      "Premium noise-canceling wireless headphones with superior sound quality. Features 30-hour battery life, quick charge capability, and comfortable over-ear design. Perfect for music, calls, and travel.",
    price: 199.99,
    image: "/placeholder.svg?height=500&width=500",
    category: "Audio",
    rating: 4.7,
    reviewCount: 89,
    stock: 5,
    storeId: {
      _id: "store2",
      name: "Tech Hub Electronics",
      address: "456 Tech Avenue, Midtown",
    },
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const product = mockProducts[productId as keyof typeof mockProducts]

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
