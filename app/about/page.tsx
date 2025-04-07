import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Users, Star, ShieldCheck } from "lucide-react"

export const metadata = {
  title: "About Us | CricketGear",
  description: "Learn about CricketGear, our mission, and our commitment to quality cricket equipment",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About CricketGear</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Providing premium cricket equipment to professionals and enthusiasts since 2010
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-lg mb-4">
            Founded in 2010 by former cricket players, CricketGear was born out of a passion for the sport and a desire
            to provide high-quality equipment to players of all levels.
          </p>
          <p className="text-lg mb-4">
            What started as a small shop in Mumbai has grown into one of India's leading cricket equipment retailers,
            serving thousands of customers across the country and beyond.
          </p>
          <p className="text-lg">
            Our mission is simple: to provide cricket enthusiasts with the finest equipment that enhances their
            performance and love for the game.
          </p>
        </div>
        <div className="rounded-xl overflow-hidden">
          <Image
            src="/placeholder.svg?height=600&width=800"
            alt="CricketGear store"
            width={800}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      <div className="bg-primary/5 rounded-xl p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Choose CricketGear?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We stand apart from the competition for several reasons
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-muted-foreground">
                Every product undergoes rigorous quality checks before reaching our customers
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
              <p className="text-muted-foreground">
                Our staff includes former players who understand the nuances of cricket equipment
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Selection</h3>
              <p className="text-muted-foreground">
                We source the finest English and Kashmir willow bats and premium protective gear
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Satisfaction</h3>
              <p className="text-muted-foreground">
                Our 30-day return policy and dedicated support ensure complete satisfaction
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Meet the passionate cricket enthusiasts behind CricketGear
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Rahul Sharma",
              role: "Founder & CEO",
              bio: "Former domestic cricket player with 15 years of experience in the sport",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Priya Patel",
              role: "Head of Product",
              bio: "Cricket equipment specialist with expertise in bat manufacturing",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Arjun Singh",
              role: "Customer Experience",
              bio: "Ensuring every customer finds the perfect equipment for their needs",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Ananya Desai",
              role: "Marketing Director",
              bio: "Passionate about connecting cricket enthusiasts with quality gear",
              image: "/placeholder.svg?height=300&width=300",
            },
          ].map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <Image
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                width={300}
                height={300}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden relative mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 opacity-90"></div>
        <div className="relative z-10 p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Our Commitment to Quality</h2>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            We believe that every cricket player deserves equipment that enhances their performance and keeps them safe
            on the field.
          </p>
          <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
            <Link href="/products">Explore Our Products</Link>
          </Button>
        </div>
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Cricket field"
          width={1200}
          height={400}
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Visit Our Store</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          Experience our products in person at our flagship store in Mumbai
        </p>
        <div className="aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Game?</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          Browse our collection of premium cricket equipment and take your game to the next level
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

