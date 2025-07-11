import { type NextRequest, NextResponse } from "next/server"

// Mock product data for demonstration
const mockProducts = {
  store1: [
    {
      _id: "prod1",
      name: "Organic Bananas",
      description: "Fresh organic bananas, perfect for smoothies and snacks",
      price: 2.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Fruits",
      stock: 25,
    },
    {
      _id: "prod2",
      name: "Whole Grain Bread",
      description: "Freshly baked whole grain bread, rich in fiber",
      price: 4.49,
      image: "/placeholder.svg?height=300&width=300",
      category: "Bakery",
      stock: 12,
    },
    {
      _id: "prod3",
      name: "Free Range Eggs",
      description: "Farm fresh free-range eggs, dozen pack",
      price: 5.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Dairy",
      stock: 8,
    },
    {
      _id: "prod4",
      name: "Greek Yogurt",
      description: "Creamy Greek yogurt, high in protein",
      price: 3.79,
      image: "/placeholder.svg?height=300&width=300",
      category: "Dairy",
      stock: 15,
    },
  ],
  store2: [
    {
      _id: "prod5",
      name: "Wireless Headphones",
      description: "Premium noise-canceling wireless headphones",
      price: 199.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Audio",
      stock: 5,
    },
    {
      _id: "prod6",
      name: "Smartphone Case",
      description: "Protective case for latest smartphone models",
      price: 24.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Accessories",
      stock: 20,
    },
    {
      _id: "prod7",
      name: "USB-C Cable",
      description: "Fast charging USB-C cable, 6ft length",
      price: 12.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Cables",
      stock: 30,
    },
    {
      _id: "prod8",
      name: "Portable Charger",
      description: "10,000mAh portable battery pack",
      price: 39.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Power",
      stock: 0, // Out of stock
    },
  ],
  store3: [
    {
      _id: "prod9",
      name: "Espresso Blend",
      description: "Rich and bold espresso blend, 12oz bag",
      price: 16.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Coffee",
      stock: 18,
    },
    {
      _id: "prod10",
      name: "Chocolate Croissant",
      description: "Buttery croissant filled with dark chocolate",
      price: 3.25,
      image: "/placeholder.svg?height=300&width=300",
      category: "Pastry",
      stock: 6,
    },
    {
      _id: "prod11",
      name: "Mystery Novel",
      description: "Bestselling mystery novel by acclaimed author",
      price: 14.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Books",
      stock: 3,
    },
    {
      _id: "prod12",
      name: "Travel Mug",
      description: "Insulated travel mug, keeps drinks hot for hours",
      price: 22.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Accessories",
      stock: 12,
    },
  ],
  store4: [
    {
      _id: "prod13",
      name: "Succulent Plant",
      description: "Low-maintenance succulent in decorative pot",
      price: 8.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Plants",
      stock: 22,
    },
    {
      _id: "prod14",
      name: "Garden Trowel",
      description: "Stainless steel garden trowel with ergonomic handle",
      price: 15.49,
      image: "/placeholder.svg?height=300&width=300",
      category: "Tools",
      stock: 10,
    },
    {
      _id: "prod15",
      name: "Organic Fertilizer",
      description: "All-natural organic fertilizer for healthy plants",
      price: 12.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Fertilizer",
      stock: 7,
    },
    {
      _id: "prod16",
      name: "Watering Can",
      description: "Classic metal watering can, 2-gallon capacity",
      price: 28.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Tools",
      stock: 4,
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!storeId) {
      return NextResponse.json({ error: "Store ID is required" }, { status: 400 })
    }

    // Get products for the specific store
    const products = mockProducts[storeId as keyof typeof mockProducts] || []

    return NextResponse.json({
      products: products.slice(0, limit),
      total: products.length,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
