import { type NextRequest, NextResponse } from "next/server"

// Mock store offers data
const mockOffers = {
  store1: [
    {
      id: "offer1",
      title: "Fresh Produce Special",
      description: "Get 15% off all fresh fruits and vegetables",
      type: "discount",
      value: "15% OFF",
      validUntil: "2024-12-31",
      minPurchase: 25,
    },
    {
      id: "offer2",
      title: "Buy 2 Get 1 Free",
      description: "Mix and match on selected dairy products",
      type: "bogo",
      value: "BOGO",
      validUntil: "2024-12-15",
    },
  ],
  store2: [
    {
      id: "offer3",
      title: "Tech Bundle Deal",
      description: "Save 20% when you buy 3 or more accessories",
      type: "bundle",
      value: "20% OFF",
      validUntil: "2024-12-25",
      minPurchase: 100,
    },
    {
      id: "offer4",
      title: "Free Shipping",
      description: "Free delivery on orders over $50",
      type: "free_shipping",
      value: "FREE SHIP",
      validUntil: "2024-12-31",
      minPurchase: 50,
    },
  ],
  store3: [
    {
      id: "offer5",
      title: "Coffee Lover's Deal",
      description: "Buy any coffee bag and get a pastry for $1",
      type: "bundle",
      value: "$1 PASTRY",
      validUntil: "2024-12-20",
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { storeId: string } }) {
  try {
    const storeId = params.storeId

    if (!storeId) {
      return NextResponse.json({ error: "Store ID is required" }, { status: 400 })
    }

    const offers = mockOffers[storeId as keyof typeof mockOffers] || []

    return NextResponse.json({ offers })
  } catch (error) {
    console.error("Error fetching store offers:", error)
    return NextResponse.json({ error: "Failed to fetch store offers" }, { status: 500 })
  }
}
