"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, ArrowUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase/firebase"
import { collection, getDocs, query, orderBy as firestoreOrderBy, Timestamp } from "firebase/firestore"
import { format } from 'date-fns'
import { useAuth } from "@/context/auth-context"

// Define an interface for the Firestore user data structure
interface FirestoreUser {
  uid: string;
  displayName: string;
  email: string;
  createdAt: Timestamp; // Firestore Timestamp
  isAdmin: boolean;
  // Add other fields if they exist in your Firestore documents
  // Example: ordersCount?: number; totalSpent?: number; status?: string;
}

export default function AdminCustomersPage() {
  const { toast } = useToast()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [customers, setCustomers] = useState<FirestoreUser[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Fetch customers from Firestore, only if user is admin
  useEffect(() => {
    console.log("[AdminCustomersPage useEffect] Running effect..."); // Log effect start
    console.log("[AdminCustomersPage useEffect] authLoading:", authLoading);
    console.log("[AdminCustomersPage useEffect] isAdmin:", isAdmin);

    // Don't fetch until auth state is loaded and user is confirmed admin
    if (authLoading) {
      console.log("[AdminCustomersPage useEffect] Auth is loading, returning.");
      setDataLoading(true)
      return
    }
    if (!isAdmin) {
      console.log("[AdminCustomersPage useEffect] User is not admin, setting error.");
      setError("Access Denied: You do not have permission to view this page.")
      setDataLoading(false)
      return
    }
    
    console.log("[AdminCustomersPage useEffect] User is admin, proceeding to fetch."); // Log before fetch

    const fetchCustomers = async () => {
      setDataLoading(true)
      setError(null)
      try {
        console.log("Fetching customers from Firestore...")
        const usersCollectionRef = collection(db, "users")
        const q = query(usersCollectionRef, firestoreOrderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        
        const fetchedCustomers = querySnapshot.docs.map(doc => {
          const data = doc.data() as Omit<FirestoreUser, 'uid'> & { createdAt: Timestamp };
          return {
            ...data,
            uid: doc.id,
            createdAt: data.createdAt
          } as FirestoreUser;
        });
        console.log("Fetched customers:", fetchedCustomers)

        setCustomers(fetchedCustomers)
      } catch (err: any) {
        console.error("Error fetching customers:", err)
        if (err.code === 'permission-denied') {
          setError("Permission Denied: Check Firestore rules or admin status.")
          toast({
            title: "Permission Error",
            description: "You don't have permission to access customer data.",
            variant: "destructive",
          })
        } else {
          setError("Failed to fetch customers. Please try again later.")
          toast({
            title: "Error",
            description: "Could not fetch customer data.",
            variant: "destructive",
          })
        }
      } finally {
        setDataLoading(false)
      }
    }

    fetchCustomers()
  }, [isAdmin, authLoading, toast])

  // Filter and sort customers (client-side for now)
  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = true;

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let compareResult = 0;
      switch (sortField) {
        case 'displayName':
          compareResult = a.displayName.localeCompare(b.displayName);
          break;
        case 'email':
          compareResult = a.email.localeCompare(b.email);
          break;
        case 'createdAt':
          if (a.createdAt && b.createdAt) {
            compareResult = a.createdAt.toMillis() - b.createdAt.toMillis();
          }
          break;
        default:
          compareResult = 0;
      }
      return sortDirection === "asc" ? compareResult : -compareResult;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getStatusBadgeClass = (status?: string) => { 
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
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

  // Combine loading states for UI
  const isLoading = authLoading || dataLoading;

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
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => !isLoading && handleSort('displayName')}>
                  Customer
                  {sortField === 'displayName' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => !isLoading && handleSort("createdAt")}>
                  Joined
                  {sortField === 'createdAt' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span>{authLoading ? 'Verifying access...' : 'Loading customers...'}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  No customers found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.uid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{customer.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.displayName}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatTimestamp(customer.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/customers/${customer.uid}`}>View Profile</Link>
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

