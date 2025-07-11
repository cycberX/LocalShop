"use client"

import type React from "react"

import { useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
  storeId: {
    _id: string
    name: string
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      })

      if (search) {
        params.append("search", search)
      }

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()

      if (page === 1) {
        setProducts(data.products)
      } else {
        setProducts((prev) => [...prev, ...data.products])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Products</h1>

        <form onSubmit={handleSearch} className="flex gap-4 max-w-md">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {loading && page === 1 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found.</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button onClick={() => setPage((prev) => prev + 1)} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Load More
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
