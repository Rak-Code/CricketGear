"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const carouselItems = [
  {
    title: "Premium Cricket Bats for Champions",
    description:
      "Handcrafted from the finest English willow, our bats are designed for performance, durability, and that perfect sweet spot.",
    cta: "Shop Bats",
    link: "/products?category=bats",
    bgClass: "hero-pattern",
  },
  {
    title: "Professional Batting Gear",
    description:
      "Stay protected with our range of high-quality pads, gloves, and helmets designed for maximum comfort and safety.",
    cta: "Shop Protective Gear",
    link: "/products?category=pads",
    bgClass: "india-gradient",
  },
  {
    title: "Cricket Balls for Every Match",
    description: "From professional leather balls to training balls, find the perfect cricket ball for your game.",
    cta: "Shop Balls",
    link: "/products?category=balls",
    bgClass: "india-accent-gradient",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1))
  }

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden">
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-in-out",
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            <div className={`${item.bgClass} h-full py-16 md:py-24 px-6 md:px-12`}>
              <div className="container mx-auto max-w-4xl">
                <div className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-sm font-medium mb-4">
                  New Collection 2023
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{item.title}</h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">{item.description}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto" asChild>
                    <Link href={item.link}>{item.cta}</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20 w-full sm:w-auto"
                  >
                    <Link href="/products">View All Products</Link>
                  </Button>
                </div>
                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-3 inline-block">
                  <p className="text-white/90 text-sm">Limited time offer: Free shipping on orders over $100</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/50",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  )
}

