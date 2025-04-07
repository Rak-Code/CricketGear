"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

// Mock customers data
const customers = [
  {
    id: "user1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    joined: "April 1, 2023",
    orders: 3,
    spent: 499.97,
    status: "active",
  },
  {
    id: "user2",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    joined: "April 2, 2023",
    orders: 1,
    spent: 129.99,
    status: "active",
  },
  {
    id: "user3",
    name: "Arjun Singh",
    email: "arjun.singh@example.com",
    joined: "April 3, 2023",
    orders: 2,
    spent: 349.98,
    status: "active",
  },
  {
    id: "user4",
    name: "Ananya Desai",
    email: "ananya.desai@example.com",
    joined: "April 4, 2023",
    orders: 0,
    spent: 0,
    status: "inactive",
  },
  {
    id: "user5",
    name: "Vikram Mehta",
    email: "vikram.mehta@example.com",
    joined: "April 5, 2023",
    orders: 5,
    spent: 899.95,
    status: "active",
  },
  {
    id: "user6",
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    joined: "April 6, 2023",
    orders: 2,
    spent: 259.98,
    status: "active",
  },
  {
    id: "user7",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    joined: "April 7, 2023",
    orders: 1,
    spent: 299.99,
    status: "active",
  },
  {
    id: "user8",
    name: "Sonia Verma",
    email: "sonia.verma@example.com",
    joined: "April 8, 2023",
    orders: 0,
    spent: 0,
    status: "inactive",
  },
]

export default function AdminCustomersPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("joined")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filter and sort customers
  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || customer.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortField === "joined") {
        // Simple date comparison for demo purposes
        return sortDirection === "asc"
          ? new Date(a.joined).getTime() - new Date(b.joined).getTime()
          : new Date(b.joined).getTime() - new Date(a.joined).getTime()
      } else if (sortField === "orders") {
        return sortDirection === "asc" ? a.orders - b.orders : b.orders - a.orders
      } else if (sortField === "spent") {
        return sortDirection === "asc" ? a.spent - b.spent : b.spent - a.spent
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer accounts</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/customers/export">Export Customers</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("joined")}>
                  Joined
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("orders")}>
                  Orders
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("spent")}>
                  Total Spent
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No customers found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.joined}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${customer.spent.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(customer.status)}`}
                    >
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/customers/${customer.id}`}>View Profile</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/customers/${customer.id}/orders`}>View Orders</Link>
                      </Button>
                    </div>
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

