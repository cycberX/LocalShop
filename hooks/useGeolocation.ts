"use client"

import { useState } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
  permissionDenied: boolean
  address: string | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
    permissionDenied: false,
    address: null,
  })

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        // Try to get address from coordinates using our API
        let address = null
        try {
          const response = await fetch(`/api/geocoding?lat=${latitude}&lng=${longitude}`)
          if (response.ok) {
            const data = await response.json()
            address = data.address
          }
        } catch (error) {
          console.warn("Failed to get address from coordinates:", error)
        }

        setState({
          latitude,
          longitude,
          address,
          error: null,
          loading: false,
          permissionDenied: false,
        })
      },
      (error) => {
        let errorMessage = "Unable to retrieve location"
        let permissionDenied = false

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user"
            permissionDenied = true
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }

        setState({
          latitude: null,
          longitude: null,
          address: null,
          error: errorMessage,
          loading: false,
          permissionDenied,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  return {
    ...state,
    requestLocation,
    hasLocation: state.latitude !== null && state.longitude !== null,
  }
}
