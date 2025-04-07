import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl my-6">
      <div className="hero-pattern py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-sm font-medium mb-4">
            New Collection 2023
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Premium Cricket Bats for Champions</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Handcrafted from the finest English willow, our bats are designed for performance, durability, and that
            perfect sweet spot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              View Collections
            </Button>
          </div>
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-3 inline-block">
            <p className="text-white/90 text-sm">Limited time offer: Free shipping on orders over $100</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/10 to-transparent"></div>
    </div>
  )
}

