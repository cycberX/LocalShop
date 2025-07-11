import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Store from "@/models/Store"

// GET /api/stores - List stores with optional geolocation filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const radius = searchParams.get("radius") || "10" // Default 10km radius

    const query: any = { isActive: true }

    // If coordinates provided, find nearby stores
    if (lat && lng) {
      const latitude = Number.parseFloat(lat)
      const longitude = Number.parseFloat(lng)
      const radiusInMeters = Number.parseFloat(radius) * 1000 // Convert km to meters

      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusInMeters,
        },
      }
    }

    const stores = await Store.find(query).populate("ownerId", "name email").select("-__v")

    return NextResponse.json({ stores })
  } catch (error) {
    console.error("Error fetching stores:", error)
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 })
  }
}

// POST /api/stores - Create new store (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, description, address, coordinates, ownerId, phone, email } = body

    // Validate required fields
    if (!name || !description || !address || !coordinates || !ownerId || !phone || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const store = new Store({
      name,
      description,
      address,
      location: {
        type: "Point",
        coordinates: [coordinates.lng, coordinates.lat], // [longitude, latitude]
      },
      ownerId,
      phone,
      email,
    })

    await store.save()
    await store.populate("ownerId", "name email")

    return NextResponse.json(store, { status: 201 })
  } catch (error) {
    console.error("Error creating store:", error)
    return NextResponse.json({ error: "Failed to create store" }, { status: 500 })
  }
}
