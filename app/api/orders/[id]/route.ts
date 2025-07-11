import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import { authOptions } from "@/lib/auth"

// PUT /api/orders/[id] - Update order status
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "store-owner" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { status } = body

    const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true, runValidators: true }).populate([
      { path: "userId", select: "name email" },
      { path: "storeId", select: "name address" },
    ])

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Here you could trigger web push notification
    // await sendOrderUpdateNotification(order);

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
