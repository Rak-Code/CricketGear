"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface OrderDetailsPageProps {
  params: {
    id: string
  }
}

// Mock order data
const getOrderById = (id: string) => {
  const orders = {
    "12345": {
      id: "12345",
      date: "April 12, 2023",
      status: "delivered",
      total: 249.99,
      shipping: 0,
      subtotal: 249.99,
      paymentMethod: "Credit Card (Visa ending in 4242)",
      shippingAddress: {
        name: "Rahul Sharma",
        address: "123 Cricket Lane",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        country: "India",
      },
      items: [
        {
          id: "1",
          name: "Pro Master English Willow Bat",
          quantity: 1,
          price: 249.99,
          image: "/placeholder.svg?height=100&width=100",
        },
      ],
      timeline: [
        { status: "ordered", date: "April 8, 2023", time: "10:30 AM" },
        { status: "processing", date: "April 9, 2023", time: "2:15 PM" },
        { status: "shipped", date: "April 10, 2023", time: "11:45 AM" },
        { status: "delivered", date: "April 12, 2023", time: "3:20 PM" },
      ],
    },
    "12344": {
      id: "12344",
      date: "March 28, 2023",
      status: "delivered",
      total: 129.99,
      shipping: 10,
      subtotal: 119.99,
      paymentMethod: "Credit Card (Visa ending in 4242)",
      shippingAddress: {
        name: "Rahul Sharma",
        address: "123 Cricket Lane",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        country: "India",
      },
      items: [
        {
          id: "5",
          name: "Professional Batting Pads",
          quantity: 1,
          price: 119.99,
          image: "/placeholder.svg?height=100&width=100",
        },
      ],
      timeline: [
        { status: "ordered", date: "March 25, 2023", time: "3:45 PM" },
        { status: "processing", date: "March 26, 2023", time: "10:20 AM" },
        { status: "shipped", date: "March 27, 2023", time: "9:30 AM" },
        { status: "delivered", date: "March 28, 2023", time: "4:15 PM" },
      ],
    },
  }

  return orders[id as keyof typeof orders]
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  if (!user) {
    router.push("/")
    return null
  }

  const order = getOrderById(params.id)

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <AlertCircle className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Order not found</h2>
          <p className="text-muted-foreground mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button asChild>
            <Link href="/orders">View Your Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleCancelOrder = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Cannot cancel order",
        description: "This order has already been delivered and cannot be cancelled.",
        variant: "destructive",
      })
      setLoading(false)
    }, 1000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ordered":
        return <Package className="h-6 w-6 text-primary" />
      case "processing":
        return <Package className="h-6 w-6 text-yellow-500" />
      case "shipped":
        return <Truck className="h-6 w-6 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <Package className="h-6 w-6" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <p className="text-muted-foreground">Placed on {order.date}</p>
        </div>
        <div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium 
            ${
              order.status === "delivered"
                ? "bg-green-100 text-green-800"
                : order.status === "shipped"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "processing"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-muted px-6 py-4">
              <h2 className="font-semibold">Order Items</h2>
            </div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex justify-between mt-2">
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <p className="font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden">
            <div className="bg-muted px-6 py-4">
              <h2 className="font-semibold">Order Timeline</h2>
            </div>
            <div className="p-6">
              <div className="relative">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4 mb-6 relative">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full p-2 bg-primary/10">{getStatusIcon(event.status)}</div>
                      {index < order.timeline.length - 1 && (
                        <div className="h-full w-0.5 bg-muted absolute top-10 bottom-0"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.date} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-muted px-6 py-4">
              <h2 className="font-semibold">Order Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">Payment Method</h3>
                <p className="text-sm">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden">
            <div className="bg-muted px-6 py-4">
              <h2 className="font-semibold">Shipping Address</h2>
            </div>
            <div className="p-6">
              <p className="text-sm">
                {order.shippingAddress.name}
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" asChild>
              <Link href={`/products/${order.items[0].id}`}>Buy Again</Link>
            </Button>
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleCancelOrder}
                disabled={loading}
              >
                {loading ? "Processing..." : "Cancel Order"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

