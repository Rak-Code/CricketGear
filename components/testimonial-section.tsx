import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Professional Cricketer",
    content:
      "The Pro Master English Willow Bat has completely transformed my game. The balance and power are unmatched, and I've seen a significant improvement in my performance.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Cricket Coach",
    content:
      "I recommend CricketGear to all my students. The quality of their equipment is exceptional, and their customer service is outstanding. The batting pads provide excellent protection.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Arjun Singh",
    role: "Amateur Player",
    content:
      "As a weekend cricket enthusiast, I was looking for quality equipment that wouldn't break the bank. CricketGear delivered exactly what I needed. The gloves are comfortable and durable.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
  },
]

export default function TestimonialSection() {
  return (
    <section className="py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">What Our Customers Say</h2>
        <p className="mt-2 text-muted-foreground">Trusted by cricket players at all levels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
              </div>
              <p className="mb-6 italic text-muted-foreground">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

