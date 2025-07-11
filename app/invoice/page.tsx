"use client"

import Invoice from "@/components/Invoice"

// Sample invoice data
const sampleInvoiceData = {
  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
  customerPhone: "+1 (555) 123-4567",
  shippingAddress: {
    street: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  },
  storeName: "LocalShop",
  storeLogo: "/placeholder.svg?height=64&width=64",
  products: [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      image: "/placeholder.svg?height=300&width=300",
      color: "Black",
      size: "One Size",
      quantity: 1,
      unitPrice: 199.99,
      totalPrice: 199.99,
    },
    {
      id: "2",
      name: "Organic Cotton T-Shirt",
      image: "/placeholder.svg?height=300&width=300",
      color: "Navy Blue",
      size: "Large",
      quantity: 2,
      unitPrice: 29.99,
      totalPrice: 59.98,
    },
    {
      id: "3",
      name: "Stainless Steel Water Bottle",
      image: "/placeholder.svg?height=300&width=300",
      color: "Silver",
      quantity: 1,
      unitPrice: 24.99,
      totalPrice: 24.99,
    },
  ],
  subtotal: 284.96,
  shippingCharges: 0,
  discount: 28.5,
  tax: 22.92,
  grandTotal: 279.38,
}

export default function InvoicePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice</h1>
          <p className="text-gray-600">Download or print your order invoice</p>
        </div>

        <Invoice data={sampleInvoiceData} />
      </div>
    </div>
  )
}
