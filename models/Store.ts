import mongoose, { Schema, type Document } from "mongoose"

export interface IStore extends Document {
  name: string
  description: string
  address: string
  location: {
    type: "Point"
    coordinates: [number, number] // [longitude, latitude]
  }
  ownerId: mongoose.Types.ObjectId
  phone: string
  email: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const StoreSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Store description is required"],
    },
    address: {
      type: String,
      required: [true, "Store address is required"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Create geospatial index for location-based queries
StoreSchema.index({ location: "2dsphere" })

export default mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema)
