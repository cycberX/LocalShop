"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Minus, FileText } from "lucide-react"
import Invoice from "./Invoice"

interface Product {
  id: string
  name: string
  image: string
  color?: string
  size?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export default function InvoiceGenerator() {
  const [showInvoice, setShowInvoice] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "+1 (555) 123-4567",
    storeName: "LocalShop",
    storeLogo: "/placeholder.svg?height=64&width=64",
    street: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    shippingCharges: 0,
    discount: 0,
    tax: 0,
  })

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Sample Product",
      image: "/placeholder.svg?height=300&width=300",
      color: "Black",
      size: "Medium",
      quantity: 1,
      unitPrice: 29.99,
      totalPrice: 29.99,
    },
  ])

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "New Product",
      image: "/placeholder.svg?height=300&width=300",
      color: "",
      size: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    }
    setProducts([...products, newProduct])
  }

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const updated = { ...p, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updated.totalPrice = updated.quantity * updated.unitPrice
          }
          return updated
        }
        return p
      }),
    )
  }

  const subtotal = products.reduce((sum, p) => sum + p.totalPrice, 0)
  const grandTotal = subtotal + formData.shippingCharges + formData.tax - formData.discount

  const generateInvoice = () => {
    setShowInvoice(true)
  }

  const invoiceData = {
    customerName: formData.customerName,
    customerEmail: formData.customerEmail,
    customerPhone: formData.customerPhone,
    shippingAddress: {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
    },
    storeName: formData.storeName,
    storeLogo: formData.storeLogo,
    products,
    subtotal,
    shippingCharges: formData.shippingCharges,
    discount: formData.discount,
    tax: formData.tax,
    grandTotal,
  }

  if (showInvoice) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setShowInvoice(false)} variant="outline" className="mb-4">
          ← Back to Generator
        </Button>
        <Invoice data={invoiceData} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Invoice Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Store Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="storeLogo">Store Logo URL</Label>
              <Input
                id="storeLogo"
                value={formData.storeLogo}
                onChange={(e) => setFormData({ ...formData, storeLogo: e.target.value })}
              />
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Products</h3>
              <Button onClick={addProduct} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </Button>
            </div>

            {products.map((product, index) => (
              <Card key={product.id} className="p-4">
                <div className="grid md:grid-cols-6 gap-4 items-end">
                  <div>
                    <Label>Product Name</Label>
                    <Input value={product.name} onChange={(e) => updateProduct(product.id, "name", e.target.value)} />
                  </div>
                  <div>
                    <Label>Color</Label>
                    <Input
                      value={product.color || ""}
                      onChange={(e) => updateProduct(product.id, "color", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Size</Label>
                    <Input
                      value={product.size || ""}
                      onChange={(e) => updateProduct(product.id, "size", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => updateProduct(product.id, "quantity", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label>Unit Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={product.unitPrice}
                      onChange={(e) => updateProduct(product.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">${product.totalPrice.toFixed(2)}</span>
                    <Button
                      onClick={() => removeProduct(product.id)}
                      size="sm"
                      variant="destructive"
                      disabled={products.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="shippingCharges">Shipping Charges ($)</Label>
                <Input
                  id="shippingCharges"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.shippingCharges}
                  onChange={(e) =>
                    setFormData({ ...formData, shippingCharges: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount ($)</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="tax">Tax ($)</Label>
                <Input
                  id="tax"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Grand Total:</span>
                <span className="text-green-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button onClick={generateInvoice} className="w-full" size="lg">
            <FileText className="h-5 w-5 mr-2" />
            Generate Invoice
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
