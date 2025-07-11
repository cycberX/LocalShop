"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { RefreshCw } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SwitchStoreButtonProps {
  storeId: string
  storeName: string
  productId: string
}

export default function SwitchStoreButton({ storeId, storeName, productId }: SwitchStoreButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { clearCart, items } = useCart()

  const handleSwitchStore = () => {
    clearCart()
    setIsOpen(false)
    // Redirect to the same product but from the new store
    window.location.href = `/products/${productId}?storeId=${storeId}`
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-3 w-3 mr-1" />
          Switch Store
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Switch to {storeName}?</AlertDialogTitle>
          <AlertDialogDescription>
            You currently have {items.length} item(s) in your cart from another store. Switching stores will clear your
            current cart. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSwitchStore}>Yes, Switch Store</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
