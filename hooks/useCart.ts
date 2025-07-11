"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  storeId: string | null
  storeName: string | null
  total: number
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { item: CartItem; storeId: string; storeName: string } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, storeId, storeName } = action.payload

      // If cart is empty, set the store
      if (state.items.length === 0) {
        const newItems = [item]
        return {
          ...state,
          items: newItems,
          storeId,
          storeName,
          total: item.price * item.quantity,
          isOpen: true,
        }
      }

      // Check if item is from the same store
      if (state.storeId !== storeId) {
        // Don't add item from different store
        return state
      }

      const existingItem = state.items.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        const updatedItems = state.items.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem,
        )

        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0),
          isOpen: true,
        }
      }

      const newItems = [...state.items, item]
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0),
        isOpen: true,
      }
    }

    case "REMOVE_ITEM": {
      const filteredItems = state.items.filter((item) => item.id !== action.payload)

      // If no items left, clear store info
      if (filteredItems.length === 0) {
        return {
          ...state,
          items: [],
          storeId: null,
          storeName: null,
          total: 0,
        }
      }

      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
        .filter((item) => item.quantity > 0)

      // If no items left, clear store info
      if (updatedItems.length === 0) {
        return {
          ...state,
          items: [],
          storeId: null,
          storeName: null,
          total: 0,
        }
      }

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        storeId: null,
        storeName: null,
        total: 0,
        isOpen: false,
      }

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }

    case "OPEN_CART":
      return { ...state, isOpen: true }

    case "CLOSE_CART":
      return { ...state, isOpen: false }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    storeId: null,
    storeName: null,
    total: 0,
    isOpen: false,
  })

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    // Return a default state instead of throwing an error during SSR
    return {
      items: [],
      storeId: null,
      storeName: null,
      total: 0,
      isOpen: false,
      itemCount: 0,
      addItem: () => {},
      removeItem: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      toggleCart: () => {},
      openCart: () => {},
      closeCart: () => {},
      canAddFromStore: () => true,
    }
  }

  const { state, dispatch } = context

  const addItem = (item: CartItem, storeId: string, storeName: string) => {
    dispatch({ type: "ADD_ITEM", payload: { item, storeId, storeName } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const openCart = () => {
    dispatch({ type: "OPEN_CART" })
  }

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" })
  }

  const canAddFromStore = (storeId: string) => {
    return state.items.length === 0 || state.storeId === storeId
  }

  return {
    ...state,
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    canAddFromStore,
  }
}
