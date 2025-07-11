"use client"

import { MapPin, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LocationPermissionProps {
  onRequestLocation: () => void
  loading: boolean
  error: string | null
  permissionDenied: boolean
  address?: string | null
}

export default function LocationPermission({
  onRequestLocation,
  loading,
  error,
  permissionDenied,
  address,
}: LocationPermissionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Stores Near You</h1>
            <p className="text-gray-600">We need your location to show nearby stores and their products</p>

            {address && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  {address}
                </p>
              </div>
            )}
          </div>

          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={onRequestLocation} disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                {permissionDenied ? "Try Again" : "Allow Location Access"}
              </>
            )}
          </Button>

          {permissionDenied && (
            <p className="text-sm text-gray-500 mt-4">
              Please enable location access in your browser settings to continue
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
