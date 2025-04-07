"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, MoreHorizontal, ArrowUpDown, Star } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

// Mock reviews data
const reviews = [
  {
    id: "1",
    userId: "user1",
    userName: "Rahul Sharma",
    productId: "1",
    productName: "Pro Master English Willow Bat",
    rating: 5,
    comment:
      "This bat is amazing! Perfect balance and great pickup. I've been using it for a month now and it's already helped me improve my game.",
    date: "April 15, 2023",
    status: "published",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Priya Patel",
    productId: "1",
    productName: "Pro Master English Willow Bat",
    rating: 4,
    comment:
      "Good quality bat with nice balance. The only reason I'm giving 4 stars instead of 5 is that it took a bit longer to knock in than expected.",
    date: "April 2, 2023",
    status: "published",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Arjun Singh",
    productId: "1",
    productName: "Pro Master English Willow Bat",
    rating: 5,
    comment:
      "Excellent bat! The willow quality is top-notch and it feels great in hand. I've been hitting boundaries with ease since I started using this bat.",
    date: "March 28, 2023",
    status: "published",
  },
  {
    id: "4",
    userId: "user4",
    userName: "Ananya Desai",
    productId: "5",
    productName: "Professional Batting Pads",
    rating: 3,
    comment: "The pads are good but a bit heavier than I expected. Protection is excellent though.",
    date: "March 25, 2023",
    status: "published",
  },
  {
    id: "5",
    userId: "user5",
    userName: "Vikram Mehta",
    productId: "6",
    productName: "Premium Batting Gloves",
    rating: 2,
    comment: "The gloves started coming apart after just a few uses. Very disappointed with the quality.",
    date: "March 20, 2023",
    status: "flagged",
  },
  {
    id: "6",
    userId: "user6",
    userName: "Neha Gupta",
    productId: "3",
    productName: "Junior Academy Cricket Bat",
    rating: 5,
    comment: "Bought this for my son and he loves it! Perfect size and weight for a 12-year-old.",
    date: "March 15, 2023",
    status: "published",
  },
  {
    id: "7",
    userId: "user7",
    userName: "Rajesh Kumar",
    productId: "4",
    productName: "Tournament Special Bat",
    rating: 1,
    comment: "This is the worst product I've ever purchased. Complete waste of money!",
    date: "March 10, 2023",
    status: "hidden",
  },
]

export default function AdminReviewsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      const matchesSearch =
        review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter
      const matchesStatus = statusFilter === "all" || review.status === statusFilter

      return matchesSearch && matchesRating && matchesStatus
    })
    .sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortField === "rating") {
        return sortDirection === "asc" ? a.rating - b.rating : b.rating - a.rating
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
      case "published":
        return "bg-green-100 text-green-800"
      case "flagged":
        return "bg-yellow-100 text-yellow-800"
      case "hidden":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = (reviewId: string, newStatus: string) => {
    toast({
      title: "Review status updated",
      description: `Review has been ${newStatus}.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">Manage customer reviews for your products</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer, product, or review content..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Rating" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
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
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("rating")}>
                  Rating
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Review</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("date")}>
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No reviews found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{review.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/products/${review.productId}`} className="hover:underline">
                      {review.productName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="truncate max-w-xs">{review.comment}</p>
                  </TableCell>
                  <TableCell>{review.date}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(review.status)}`}
                    >
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/reviews/${review.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        {review.status !== "published" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(review.id, "published")}>
                            Publish Review
                          </DropdownMenuItem>
                        )}
                        {review.status !== "flagged" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(review.id, "flagged")}>
                            Flag Review
                          </DropdownMenuItem>
                        )}
                        {review.status !== "hidden" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(review.id, "hidden")}>
                            Hide Review
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Delete Review</DropdownMenuItem>
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

