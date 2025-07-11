"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/hooks/useCart"

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  )
}
