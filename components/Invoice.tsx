"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Printer, Mail, Package, MapPin, User, Phone, HelpCircle } from "lucide-react"
import QRCode from "qrcode.react"
import { v4 as uuidv4 } from "uuid"
import html2pdf from "html2pdf.js"

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

interface InvoiceData {
  orderId?: string
  orderDate?: Date
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  storeName: string
  storeLogo?: string
  products: Product[]
  subtotal: number
  shippingCharges: number
  discount: number
  tax: number
  grandTotal: number
}

interface InvoiceProps {
  data: InvoiceData
  showDownloadButton?: boolean
  className?: string
}

export default function Invoice({ data, showDownloadButton = true, className = "" }: InvoiceProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  // Generate order ID if not provided
  const orderId = data.orderId || uuidv4()
  const orderDate = data.orderDate || new Date()

  const downloadPDF = async () => {
    if (!invoiceRef.current) return

    setIsGeneratingPDF(true)

    try {
      const element = invoiceRef.current
      const opt = {
        margin: 0.5,
        filename: `invoice-${orderId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      }

      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const printInvoice = () => {
    window.print()
  }

  const prepareEmailBody = () => {
    const emailBody = `
Dear ${data.customerName},

Thank you for your order! Please find your invoice details below:

Order ID: ${orderId}
Order Date: ${orderDate.toLocaleDateString()}
Total Amount: $${data.grandTotal.toFixed(2)}

Products:
${data.products
  .map(
    (product) =>
      `- ${product.name} ${product.color ? `(${product.color})` : ""} ${product.size ? `- Size: ${product.size}` : ""} x${product.quantity} = $${product.totalPrice.toFixed(2)}`,
  )
  .join("\n")}

Shipping Address:
${data.shippingAddress.street}
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
${data.shippingAddress.country}

If you have any questions, please contact our customer support.

Best regards,
${data.storeName} Team
    `.trim()

    const subject = `Invoice for Order ${orderId}`
    const mailtoLink = `mailto:${data.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`

    window.open(mailtoLink)
  }

  return (
    <>
      <div className={`max-w-4xl mx-auto bg-white ${className}`}>
        {/* Action Buttons - Desktop */}
        {showDownloadButton && (
          <div className="hidden md:flex justify-end space-x-2 mb-4 print:hidden">
            <Button onClick={downloadPDF} disabled={isGeneratingPDF} className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? "Generating..." : "Download PDF"}
            </Button>
            <Button onClick={printInvoice} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={prepareEmailBody} variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        )}

        {/* Invoice Content */}
        <div ref={invoiceRef} className="bg-white">
          <Card className="shadow-lg border-0">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    {data.storeLogo && (
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg p-2">
                        <Image
                          src={data.storeLogo || "/placeholder.svg"}
                          alt={data.storeName}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold">{data.storeName}</h1>
                      <p className="text-blue-100">Tax Invoice</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <QRCode value={orderId} size={80} bgColor="transparent" fgColor="#ffffff" className="mx-auto" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order & Customer Info */}
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
                  {/* Order Details */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-blue-600" />
                      Order Details
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-mono font-medium">{orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium">
                          {orderDate.toLocaleDateString()} {orderDate.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Customer Details
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <p className="font-medium">{data.customerName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium">{data.customerEmail}</p>
                      </div>
                      {data.customerPhone && (
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <p className="font-medium">{data.customerPhone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Shipping Address
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{data.customerName}</p>
                    <p>{data.shippingAddress.street}</p>
                    <p>
                      {data.shippingAddress.city}, {data.shippingAddress.state} {data.shippingAddress.zipCode}
                    </p>
                    <p>{data.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>

                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-900">Product</th>
                          <th className="text-center p-4 font-medium text-gray-900">Qty</th>
                          <th className="text-right p-4 font-medium text-gray-900">Unit Price</th>
                          <th className="text-right p-4 font-medium text-gray-900">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.products.map((product, index) => (
                          <tr key={product.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                  <Image
                                    src={product.image || "/placeholder.svg?height=64&width=64"}
                                    alt={product.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{product.name}</p>
                                  {product.color && <p className="text-sm text-gray-600">Color: {product.color}</p>}
                                  {product.size && <p className="text-sm text-gray-600">Size: {product.size}</p>}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center font-medium">{product.quantity}</td>
                            <td className="p-4 text-right font-medium">${product.unitPrice.toFixed(2)}</td>
                            <td className="p-4 text-right font-bold text-green-600">
                              ${product.totalPrice.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {data.products.map((product) => (
                      <Card key={product.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex space-x-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={product.image || "/placeholder.svg?height=64&width=64"}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                              <div className="text-sm text-gray-600 space-y-1">
                                {product.color && <p>Color: {product.color}</p>}
                                {product.size && <p>Size: {product.size}</p>}
                                <div className="flex justify-between items-center mt-2">
                                  <span>Qty: {product.quantity}</span>
                                  <span>Unit: ${product.unitPrice.toFixed(2)}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-green-600 text-lg">
                                    ${product.totalPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Order Summary */}
                <div className="max-w-md ml-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${data.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">
                        {data.shippingCharges === 0 ? "FREE" : `$${data.shippingCharges.toFixed(2)}`}
                      </span>
                    </div>
                    {data.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span className="font-medium">-${data.discount.toFixed(2)}</span>
                      </div>
                    )}
                    {data.tax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-medium">${data.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Grand Total:</span>
                      <span className="text-green-600">${data.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 p-6 md:p-8 border-t">
                <div className="text-center space-y-4">
                  <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      <span>Customer Support: 1-800-HELP</span>
                    </div>
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      <a href="#" className="text-blue-600 hover:underline">
                        Order Help
                      </a>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-900">Thank you for shopping with {data.storeName}!</p>
                  <p className="text-sm text-gray-600">This is a computer-generated invoice. No signature required.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Sticky Action Buttons */}
        {showDownloadButton && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 print:hidden">
            <div className="flex space-x-2">
              <Button onClick={downloadPDF} disabled={isGeneratingPDF} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingPDF ? "Generating..." : "Download"}
              </Button>
              <Button onClick={printInvoice} variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
              <Button onClick={prepareEmailBody} variant="outline" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          ${
            invoiceRef.current
              ? `
            #${invoiceRef.current.id}, 
            #${invoiceRef.current.id} * {
              visibility: visible;
            }
            #${invoiceRef.current.id} {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          `
              : ""
          }
        }
      `}</style>
    </>
  )
}
