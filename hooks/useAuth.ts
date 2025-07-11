"use client"

import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    isAdmin: session?.user?.role === "admin",
    isStoreOwner: session?.user?.role === "store-owner",
    isUser: session?.user?.role === "user",
  }
}
