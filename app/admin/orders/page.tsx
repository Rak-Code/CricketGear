"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

// Mock orders data
const orders = [
  {
    id: "12345",
    customer: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    date: "April 12, 2023",
    total: 249.99,
    status: "delivered",
    items: 1,
  },
  {
    id: "12344",
    customer: "Priya Patel",
    email: "priya.patel@example.com",
    date: "April 11, 2023",
    total: 129.99,
    status: "shipped",
    items: 1,
  },
  {
    id: "12343",
    customer: "Arjun Singh",
    email: "arjun.singh@example.com",
    date: "April 10, 2023",
    total: 349.99,
    status: "processing",
    items: 3,
  },
  {
    id: "12342",
    customer: "Ananya Desai",
    email: "ananya.desai@example.com",
    date: "April 9, 2023",
    total: 79.99,
    status: "pending",
    items: 1,
  },
  {
    id: "12341",
    customer: "Vikram Mehta",
    email: "vikram.mehta@example.com",
    date: "April 8, 2023",
    total: 199.99,
    status: "cancelled",
    items: 2,
  },
  {
    id: "12340",
    customer: "Neha Gupta",
    email: "neha.gupta@example.com",
    date: "April 7, 2023",
    total: 159.99,
    status: "delivered",
    items: 1,
  },
  {
    id: "12339",
    customer: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    date: "April 6, 2023",
    total: 299.99,
    status: "delivered",
    items: 2,
  },
  {
    id: "12338",
    customer: "Sonia Verma",
    email: "sonia.verma@example.com",
    date: "April 5, 2023",
    total: 89.99,
    status: "shipped",
    items: 1,
  },
]

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(() => {
    const statuses: Record<string, string> = {}
    orders.forEach((order) => {
      statuses[order.id] = order.status
    })
    return statuses
  })

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.id.includes(searchQuery) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || orderStatuses[order.id] === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortField === "date") {
        // Simple date comparison for demo purposes
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortField === "total") {
        return sortDirection === "asc" ? a.total - b.total : b.total - a.total
      } else if (sortField === "id") {
        return sortDirection === "asc"
          ? Number.parseInt(a.id) - Number.parseInt(b.id)
          : Number.parseInt(b.id) - Number.parseInt(a.id)
      }
      return 0
    })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrderStatuses((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }))

    toast({
      title: "Order status updated",
      description: `Order #${orderId} has been updated to ${newStatus}.`,
    })
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/orders/export">Export Orders</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer name, or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("id")}>
                  Order ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("date")}>
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Items</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("total")}>
                  Total
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No orders found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={orderStatuses[order.id]}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

