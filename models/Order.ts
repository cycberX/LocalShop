import mongoose, { Schema, type Document } from "mongoose"

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  name: string
  price: number
  quantity: number
  image: string
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  storeId: mongoose.Types.ObjectId
  items: IOrderItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  stripeSessionId?: string
  deliveryAddress: string
  phone: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
  },
})

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripeSessionId: {
      type: String,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
