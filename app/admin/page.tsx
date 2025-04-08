"use client"
import Link from "next/link"
import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { Users, Package, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight, Star, BarChart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase/firebase";
import { collection, getCountFromServer } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, refreshToken, debugAdminStatus } = useAuth();
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchStats = async (isRetry = false) => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      // Refresh token to ensure we have the latest claims
      await refreshToken();
      
      const usersCollectionRef = collection(db, "users");
      const snapshot = await getCountFromServer(usersCollectionRef);
      setCustomerCount(snapshot.data().count);
      setHasAttemptedFetch(true);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      const errorMessage = `Failed to load stats: ${error.message}`;
      setStatsError(errorMessage);
      
      // Implement retry logic
      if (!isRetry && retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchStats(true), 2000); // Retry after 2 seconds
      } else {
        setHasAttemptedFetch(true);
      }
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      setStatsLoading(true);
      return;
    }
    
    // Debug admin status
    debugAdminStatus();
    
    // Set debug info
    setDebugInfo({
      userId: user?.uid,
      email: user?.email,
      isAdmin: isAdmin,
      loading: authLoading,
      retryCount,
      environment: process.env.NODE_ENV
    });
    
    if (!isAdmin) {
      setStatsError("Access Denied: You do not have admin privileges.");
      setStatsLoading(false);
      return;
    }

    // Only attempt to fetch if we haven't tried before or if we're refreshing
    if (!hasAttemptedFetch) {
      fetchStats();
    }
  }, [isAdmin, authLoading, refreshToken, debugAdminStatus, user, hasAttemptedFetch, retryCount]);

  // Add debug section at the top
  if (statsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-red-800 mb-4">Access Error</h2>
          <p className="text-red-700 mb-4">{statsError}</p>
          <div className="bg-white p-4 rounded border">
            <h3 className="font-medium mb-2">Debug Information:</h3>
            <pre className="text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          <div className="mt-4 space-y-2">
            <Button 
              onClick={() => {
                setHasAttemptedFetch(false);
                setRetryCount(0); // Reset retry count when manually retrying
                refreshToken();
              }}
              className="mr-2"
              variant="outline"
            >
              Retry
            </Button>
            {retryCount > 0 && retryCount <= MAX_RETRIES && (
              <p className="text-sm text-gray-600">
                Retry attempt {retryCount} of {MAX_RETRIES}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your store, products, and orders</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/products/new">Add New Product</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <Link href="/admin/products">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +8.2%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +12.4%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/customers">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : statsError ? (
                  "Error"
                ) : (
                  customerCount ?? 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500 inline-flex items-center">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  -1.2%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/revenue">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +20.1%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/reviews">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviews</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">487</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +12.5%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link href="/admin/products/new">
                <Package className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Add Product</div>
                  <div className="text-xs text-muted-foreground">Create a new product listing</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link href="/admin/orders">
                <ShoppingCart className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Manage Orders</div>
                  <div className="text-xs text-muted-foreground">View and update order status</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link href="/admin/reviews">
                <Star className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Review Management</div>
                  <div className="text-xs text-muted-foreground">Moderate customer reviews</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link href="/admin/revenue">
                <BarChart className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Revenue Analytics</div>
                  <div className="text-xs text-muted-foreground">View sales performance</div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Overview</CardTitle>
            <CardDescription>Performance metrics for your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Products</span>
                <span className="font-medium">124</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Orders</span>
                <span className="font-medium">32</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Inventory Status</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <span className="font-medium">4.7/5</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "94%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="reviews">Latest Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage your recent orders and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">#12345</TableCell>
                    <TableCell>Rahul Sharma</TableCell>
                    <TableCell>April 12, 2023</TableCell>
                    <TableCell>
                      <Select
                        defaultValue="delivered"
                        onValueChange={(value) => {
                          // In a real app, you would update the order status here
                          console.log(`Order #12345 status updated to ${value}`)
                        }}
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
                    <TableCell>$249.99</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/orders/12345">View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#12344</TableCell>
                    <TableCell>Priya Patel</TableCell>
                    <TableCell>April 11, 2023</TableCell>
                    <TableCell>
                      <Select
                        defaultValue="shipped"
                        onValueChange={(value) => {
                          // In a real app, you would update the order status here
                          console.log(`Order #12344 status updated to ${value}`)
                        }}
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
                    <TableCell>$129.99</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/orders/12344">View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#12343</TableCell>
                    <TableCell>Arjun Singh</TableCell>
                    <TableCell>April 10, 2023</TableCell>
                    <TableCell>
                      <Select
                        defaultValue="processing"
                        onValueChange={(value) => {
                          // In a real app, you would update the order status here
                          console.log(`Order #12343 status updated to ${value}`)
                        }}
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
                    <TableCell>$349.99</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/orders/12343">View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/orders">View All Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Your best performing products this month</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Pro Master English Willow Bat</TableCell>
                    <TableCell>Bats</TableCell>
                    <TableCell>$249.99</TableCell>
                    <TableCell>124</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/admin/products/1">View</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/admin/products/1/edit">Edit</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Professional Batting Pads</TableCell>
                    <TableCell>Pads</TableCell>
                    <TableCell>$129.99</TableCell>
                    <TableCell>98</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/admin/products/5">View</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/admin/products/5/edit">Edit</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Premium Batting Gloves</TableCell>
                    <TableCell>Gloves</TableCell>
                    <TableCell>$79.99</TableCell>
                    <TableCell>87</TableCell>
                    <TableCell>25</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/admin/products/6">View</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/admin/products/6/edit">Edit</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/products">Manage Products</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latest Reviews</CardTitle>
              <CardDescription>Recent customer feedback on your products</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Rahul Sharma</TableCell>
                    <TableCell>Pro Master English Willow Bat</TableCell>
                    <TableCell>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      This bat is amazing! Perfect balance and great pickup.
                    </TableCell>
                    <TableCell>April 15, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/reviews/1">View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Priya Patel</TableCell>
                    <TableCell>Pro Master English Willow Bat</TableCell>
                    <TableCell>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">Good quality bat with nice balance.</TableCell>
                    <TableCell>April 2, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/reviews/2">View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Vikram Mehta</TableCell>
                    <TableCell>Premium Batting Gloves</TableCell>
                    <TableCell>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 2 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      The gloves started coming apart after just a few uses.
                    </TableCell>
                    <TableCell>March 20, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/reviews/5">View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/reviews">View All Reviews</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

