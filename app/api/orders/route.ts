import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, storeId, totalAmount, deliveryAddress, phone } = body

    // Validate required fields
    if (!items || !storeId || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would save this to your database
    const order = {
      _id: `order_${Date.now()}`,
      items,
      storeId,
      totalAmount,
      deliveryAddress: deliveryAddress || "123 Main St",
      phone: phone || "555-0123",
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
