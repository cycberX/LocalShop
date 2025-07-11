// Server-side geocoding utility
export async function getCoordinatesFromAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      console.warn("Google Maps API key not configured")
      return null
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
      { cache: "force-cache" },
    )

    if (!response.ok) {
      throw new Error("Geocoding request failed")
    }

    const data = await response.json()

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location
      return {
        lat: location.lat,
        lng: location.lng,
      }
    }

    return null
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
  }
}

export async function getAddressFromCoordinates(lat: number, lng: number): Promise<string | null> {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      console.warn("Google Maps API key not configured")
      return null
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
      { cache: "force-cache" },
    )

    if (!response.ok) {
      throw new Error("Reverse geocoding request failed")
    }

    const data = await response.json()

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address
    }

    return null
  } catch (error) {
    console.error("Reverse geocoding error:", error)
    return null
  }
}
