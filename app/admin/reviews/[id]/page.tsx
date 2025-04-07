"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock review data
const getReviewById = (id: string) => {
  return {
    id,
    userId: "user1",
    userName: "Rahul Sharma",
    userEmail: "rahul.sharma@example.com",
    productId: "1",
    productName: "Pro Master English Willow Bat",
    rating: 5,
    comment:
      "This bat is amazing! Perfect balance and great pickup. I've been using it for a month now and it's already helped me improve my game. The sweet spot is generous and the grip is comfortable.",
    date: "April 15, 2023",
    status: "published",
    adminResponse: "",
  }
}

interface ReviewDetailsPageProps {
  params: {
    id: string
  }
}

export default function ReviewDetailsPage({ params }: ReviewDetailsPageProps) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState("published")
  const [adminResponse, setAdminResponse] = useState("")

  const review = getReviewById(params.id)

  const handleUpdateReview = () => {
    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Review updated",
        description: "The review has been updated successfully.",
      })
      setIsUpdating(false)
    }, 1500)
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/reviews">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reviews
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Review Details</h1>
          <p className="text-muted-foreground">Review #{params.id}</p>
        </div>
        <div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(review.status)}`}
          >
            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Review Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{review.userName}</h3>
                  <p className="text-sm text-muted-foreground">{review.userEmail}</p>
                </div>
              </div>

              <div>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-2">Posted on {review.date}</p>
                <p>{review.comment}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Product</h3>
                <Link href={`/admin/products/${review.productId}`} className="text-primary hover:underline">
                  {review.productName}
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add a public response to this review..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleUpdateReview} disabled={isUpdating || !adminResponse}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Post Response"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Review Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Review Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleUpdateReview} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Review deleted",
                    description: "The review has been permanently deleted.",
                  })
                }}
              >
                Delete Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

