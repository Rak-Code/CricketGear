"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Edit, Trash, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { db } from "@/lib/firebase/firebase"
import { doc, getDoc, Timestamp, deleteDoc } from "firebase/firestore"
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CustomerData {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  createdAt: Timestamp;
  isAdmin?: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  orders?: any[];
  wishlist?: any[];
}

interface CustomerDetailsPageProps {
  params: {
    id: string
  }
}

export default function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAdmin) {
      setError("Access Denied: You do not have permission to view this page.")
      setLoading(false)
      return
    }

    const fetchCustomer = async () => {
      setLoading(true)
      try {
        const customerRef = doc(db, "users", params.id)
        const customerSnap = await getDoc(customerRef)
        
        if (customerSnap.exists()) {
          const data = customerSnap.data() as Omit<CustomerData, 'uid'>;
          setCustomer({
            ...data,
            uid: customerSnap.id,
          } as CustomerData);
        } else {
          setError("Customer not found")
          toast({
            title: "Error",
            description: "Customer not found",
            variant: "destructive",
          })
        }
      } catch (err: any) {
        console.error("Error fetching customer:", err)
        setError("Failed to load customer data")
        toast({
          title: "Error",
          description: "Could not fetch customer data: " + err.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [params.id, isAdmin, authLoading, toast])

  const handleDeleteCustomer = async () => {
    setIsDeleting(true)
    try {
      // Delete the customer from Firestore
      await deleteDoc(doc(db, "users", params.id));
      
      toast({
        title: "Customer account deleted",
        description: "The customer account has been permanently deleted.",
      })
      router.push("/admin/customers")
    } catch (err: any) {
      console.error("Error deleting customer:", err)
      toast({
        title: "Error",
        description: "Failed to delete customer: " + err.message,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
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

  const formatTimestamp = (timestamp: Timestamp | undefined | null): string => {
    if (timestamp && timestamp.toDate) {
      try {
        return format(timestamp.toDate(), 'PPP');
      } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid Date";
      }
    }
    return "N/A";
  }

  if (loading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading customer data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-red-800 mb-4">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button variant="outline" asChild>
            <Link href="/admin/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-amber-800 mb-4">Customer Not Found</h2>
          <p className="text-amber-700 mb-4">The requested customer could not be found.</p>
          <Button variant="outline" asChild>
            <Link href="/admin/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">{customer.displayName?.charAt(0) || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{customer.displayName || 'Unknown'}</h1>
            <p className="text-muted-foreground">Customer since {formatTimestamp(customer.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/customers/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Customer
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the customer account and remove all
                  associated data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCustomer} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{customer.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{customer.phone || 'Not provided'}</p>
                  </div>
                </div>
                {customer.address && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <p>
                        {customer.address.street || 'No street address'}
                        <br />
                        {customer.address.city || ''}{customer.address.city && customer.address.state ? ', ' : ''}{customer.address.state || ''} {customer.address.postalCode || ''}
                        <br />
                        {customer.address.country || 'No country specified'}
                      </p>
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>{formatTimestamp(customer.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    {customer.orders && customer.orders.length > 0 
                      ? `This customer has placed ${customer.orders.length} orders`
                      : "This customer has no orders yet"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {customer.orders && customer.orders.length > 0 ? (
                    <div className="space-y-4">
                      {customer.orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">{formatTimestamp(order.date)}</p>
                          </div>
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mt-2 md:mt-0">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(order.status)}`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <span className="text-sm font-medium">₹{order.total.toFixed(2)}</span>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/orders/${order.id}`}>View</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders found for this customer.
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/admin/orders?customer=${params.id}`}>View All Orders</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="wishlist" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Wishlist</CardTitle>
                  <CardDescription>
                    {customer.wishlist && customer.wishlist.length > 0 
                      ? `Items this customer has saved to their wishlist`
                      : "This customer's wishlist is empty"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {customer.wishlist && customer.wishlist.length > 0 ? (
                    <div className="space-y-4">
                      {customer.wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm font-medium">₹{item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2 mt-2 md:mt-0">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/products/${item.id}`}>View</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      This customer hasn't added any items to their wishlist.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

