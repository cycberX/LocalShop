import { type NextRequest, NextResponse } from "next/server"
import { getCoordinatesFromAddress } from "@/lib/geocoding"

// POST /api/stores/geocode - Convert store addresses to coordinates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { addresses } = body

    if (!addresses || !Array.isArray(addresses)) {
      return NextResponse.json({ error: "Invalid addresses array" }, { status: 400 })
    }

    const results = await Promise.all(
      addresses.map(async (address: string) => {
        const coordinates = await getCoordinatesFromAddress(address)
        return {
          address,
          coordinates,
        }
      }),
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Geocoding error:", error)
    return NextResponse.json({ error: "Failed to geocode addresses" }, { status: 500 })
  }
}
