"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react"

interface Order {
  _id: string
  userId: {
    name: string
    email: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: string
  paymentStatus: string
  deliveryAddress: string
  phone: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })

  useEffect(() => {
    if (session?.user) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      // This would need the user's store ID in a real implementation
      const response = await fetch("/api/orders?storeId=YOUR_STORE_ID")
      const data = await response.json()
      setOrders(data.orders)

      // Calculate stats
      const totalOrders = data.orders.length
      const totalRevenue = data.orders
        .filter((order: Order) => order.paymentStatus === "paid")
        .reduce((sum: number, order: Order) => sum + order.totalAmount, 0)
      const pendingOrders = data.orders.filter(
        (order: Order) => order.status === "pending" || order.status === "confirmed",
      ).length
      const completedOrders = data.orders.filter((order: Order) => order.status === "delivered").length

      setStats({
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
      })
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchOrders() // Refresh orders
      }
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-orange-100 text-orange-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!session || (session.user.role !== "store-owner" && session.user.role !== "admin")) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this dashboard.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Store Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Management */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
                        <p className="text-sm text-gray-600">
                          {order.userId.name} • {order.userId.email}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-gray-600">
                        Items: {order.items.map((item) => `${item.name} (${item.quantity})`).join(", ")}
                      </p>
                      <p className="text-sm text-gray-600">Total: ${order.totalAmount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Address: {order.deliveryAddress}</p>
                      <p className="text-sm text-gray-600">Phone: {order.phone}</p>
                    </div>

                    <div className="flex space-x-2">
                      {order.status === "pending" && (
                        <Button size="sm" onClick={() => updateOrderStatus(order._id, "confirmed")}>
                          Confirm
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button size="sm" onClick={() => updateOrderStatus(order._id, "preparing")}>
                          Start Preparing
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button size="sm" onClick={() => updateOrderStatus(order._id, "ready")}>
                          Mark Ready
                        </Button>
                      )}
                      {order.status === "ready" && (
                        <Button size="sm" onClick={() => updateOrderStatus(order._id, "delivered")}>
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Product management features would go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
