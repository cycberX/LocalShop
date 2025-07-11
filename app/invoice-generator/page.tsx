import InvoiceGenerator from "@/components/InvoiceGenerator"

export default function InvoiceGeneratorPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Generator</h1>
          <p className="text-gray-600">Create professional invoices with PDF download</p>
        </div>

        <InvoiceGenerator />
      </div>
    </div>
  )
}
