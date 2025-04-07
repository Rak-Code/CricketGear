"use client"

import { useState } from "react"
import { Star, ThumbsUp, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ProductReviewsProps {
  productId: string
}

// Mock reviews data
const reviews = [
  {
    id: "1",
    userId: "user1",
    userName: "Rahul Sharma",
    userAvatar: "/placeholder.svg?height=40&width=40",
    productId: "1",
    rating: 5,
    comment:
      "This bat is amazing! Perfect balance and great pickup. I've been using it for a month now and it's already helped me improve my game. The sweet spot is generous and the grip is comfortable.",
    date: new Date("2023-03-15"),
    helpful: 12,
    flagged: false,
  },
  {
    id: "2",
    userId: "user2",
    userName: "Priya Patel",
    userAvatar: "/placeholder.svg?height=40&width=40",
    productId: "1",
    rating: 4,
    comment:
      "Good quality bat with nice balance. The only reason I'm giving 4 stars instead of 5 is that it took a bit longer to knock in than expected. Otherwise, it's a great bat for the price.",
    date: new Date("2023-02-28"),
    helpful: 8,
    flagged: false,
  },
  {
    id: "3",
    userId: "user3",
    userName: "Arjun Singh",
    userAvatar: "/placeholder.svg?height=40&width=40",
    productId: "1",
    rating: 5,
    comment:
      "Excellent bat! The willow quality is top-notch and it feels great in hand. I've been hitting boundaries with ease since I started using this bat. Highly recommended for serious cricketers.",
    date: new Date("2023-02-10"),
    helpful: 15,
    flagged: false,
  },
]

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productReviews, setProductReviews] = useState(reviews.filter((review) => review.productId === productId))

  const handleRatingClick = (rating: number) => {
    setUserRating(rating)
  }

  const handleRatingHover = (rating: number) => {
    setHoverRating(rating)
  }

  const handleRatingLeave = () => {
    setHoverRating(0)
  }

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to submit a review.",
        variant: "destructive",
      })
      return
    }

    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      })
      return
    }

    if (reviewText.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write a more detailed review (at least 10 characters).",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newReview = {
        id: `new-${Date.now()}`,
        userId: user.uid,
        userName: user.displayName,
        userAvatar: user.photoURL || "",
        productId,
        rating: userRating,
        comment: reviewText,
        date: new Date(),
        helpful: 0,
        flagged: false,
      }

      setProductReviews([newReview, ...productReviews])
      setUserRating(0)
      setReviewText("")

      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      })

      setIsSubmitting(false)
    }, 1000)
  }

  const handleHelpfulClick = (reviewId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to mark a review as helpful.",
        variant: "destructive",
      })
      return
    }

    setProductReviews(
      productReviews.map((review) => (review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review)),
    )

    toast({
      title: "Marked as helpful",
      description: "Thank you for your feedback!",
    })
  }

  const handleFlagClick = (reviewId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to report a review.",
        variant: "destructive",
      })
      return
    }

    setProductReviews(productReviews.map((review) => (review.id === reviewId ? { ...review, flagged: true } : review)))

    toast({
      title: "Review reported",
      description: "Thank you for helping us maintain quality reviews.",
    })
  }

  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
      : 0

  const ratingCounts = [0, 0, 0, 0, 0]
  productReviews.forEach((review) => {
    ratingCounts[review.rating - 1]++
  })

  const ratingPercentages = ratingCounts.map((count) =>
    productReviews.length > 0 ? (count / productReviews.length) * 100 : 0,
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-5 w-5",
                    star <= Math.round(averageRating) ? "fill-primary text-primary" : "fill-muted text-muted",
                  )}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground mb-4">Based on {productReviews.length} reviews</div>

            <div className="w-full space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="text-sm w-2">{rating}</div>
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${ratingPercentages[rating - 1]}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground w-8">{ratingCounts[rating - 1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Write a Review</h3>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Your Rating</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    onMouseEnter={() => handleRatingHover(rating)}
                    onMouseLeave={handleRatingLeave}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        (hoverRating > 0 ? rating <= hoverRating : rating <= userRating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Your Review</div>
              <Textarea
                placeholder="Share your experience with this product..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleSubmitReview} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="font-semibold mb-6">Customer Reviews ({productReviews.length})</h3>

        {productReviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {productReviews.map((review) => (
              <div key={review.id} className="border-b pb-8 last:border-b-0">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.userAvatar} alt={review.userName} />
                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h4 className="font-medium">{review.userName}</h4>
                      <div className="text-sm text-muted-foreground">{review.date.toLocaleDateString()}</div>
                    </div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= review.rating ? "fill-primary text-primary" : "fill-muted text-muted",
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-sm mb-4">{review.comment}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleHelpfulClick(review.id)}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                      {!review.flagged ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleFlagClick(review.id)}
                        >
                          <Flag className="h-3 w-3 mr-1" />
                          Report
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Reported</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

