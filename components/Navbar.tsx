"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/useCart"
import { ShoppingCart, Store } from "lucide-react"
import { useSession } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()
  const { itemCount, toggleCart, storeName } = useCart()

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">LocalShop</h1>
          </div>

          <div className="flex items-center space-x-4">
            {storeName && (
              <div className="hidden sm:block">
                <Badge variant="outline" className="text-xs">
                  Shopping from: {storeName}
                </Badge>
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={toggleCart} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

            {session?.user && <div className="hidden md:block text-sm text-gray-600">Welcome, {session.user.name}</div>}
          </div>
        </div>
      </div>
    </nav>
  )
}
