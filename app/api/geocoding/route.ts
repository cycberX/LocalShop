import { type NextRequest, NextResponse } from "next/server"
import { getCoordinatesFromAddress, getAddressFromCoordinates } from "@/lib/geocoding"

// GET /api/geocoding?address=... - Get coordinates from address
// GET /api/geocoding?lat=...&lng=... - Get address from coordinates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")

    if (address) {
      // Forward geocoding: address to coordinates
      const coordinates = await getCoordinatesFromAddress(address)

      if (!coordinates) {
        return NextResponse.json({ error: "Address not found" }, { status: 404 })
      }

      return NextResponse.json(coordinates)
    }

    if (lat && lng) {
      // Reverse geocoding: coordinates to address
      const latitude = Number.parseFloat(lat)
      const longitude = Number.parseFloat(lng)

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 })
      }

      const address = await getAddressFromCoordinates(latitude, longitude)

      if (!address) {
        return NextResponse.json({ error: "Address not found" }, { status: 404 })
      }

      return NextResponse.json({ address })
    }

    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  } catch (error) {
    console.error("Geocoding API error:", error)
    return NextResponse.json({ error: "Geocoding service unavailable" }, { status: 500 })
  }
}
