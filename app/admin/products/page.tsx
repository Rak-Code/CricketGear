"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Filter, MoreHorizontal, ArrowUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"
import { db } from "@/lib/firebase/firebase"
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  brand?: string;
  featured?: boolean;
  description?: string;
  images?: string[];
  createdAt?: Timestamp;
}

export default function AdminProductsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Fetch products from Firestore
  useEffect(() => {
    if (authLoading) return;

    if (!isAdmin) {
      setError("Access Denied: You do not have permission to view this page.")
      setLoading(false)
      return
    }

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const productsRef = collection(db, "products")
        const q = query(productsRef, orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        
        const fetchedProducts: Product[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unnamed Product",
            category: data.category || "uncategorized",
            price: data.price || 0,
            stock: data.stock || 0,
            status: data.status || "active",
            brand: data.brand,
            featured: data.featured,
            description: data.description,
            images: data.images,
            createdAt: data.createdAt
          };
        });
        
        setProducts(fetchedProducts)
      } catch (err: any) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
        toast({
          title: "Error",
          description: "Could not fetch product data: " + err.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [isAdmin, authLoading, toast])

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      const matchesStatus = statusFilter === "all" || product.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortField === "price") {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price
      } else if (sortField === "stock") {
        return sortDirection === "asc" ? a.stock - b.stock : b.stock - a.stock
      }
      return 0
    })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "out_of_stock":
        return "bg-red-100 text-red-800"
      case "low_stock":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "out_of_stock":
        return "Out of Stock"
      case "low_stock":
        return "Low Stock"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-red-800 mb-4">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="bats">Bats</SelectItem>
              <SelectItem value="pads">Pads</SelectItem>
              <SelectItem value="gloves">Gloves</SelectItem>
              <SelectItem value="balls">Balls</SelectItem>
              <SelectItem value="helmets">Helmets</SelectItem>
              <SelectItem value="footwear">Footwear</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                  Product Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("price")}>
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("stock")}>
                  Stock
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No products found. Try adjusting your search or filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id.substring(0, 5)}...</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {product.category === "uncategorized" ? "Other" : product.category}
                    </span>
                  </TableCell>
                  <TableCell>₹{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                        product.status
                      )}`}
                    >
                      {getStatusLabel(product.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>Edit Product</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          asChild
                        >
                          <Link href={`/admin/products/${product.id}/delete`}>Delete Product</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

