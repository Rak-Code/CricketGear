"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/product-card"
import type { Product } from "@/lib/types"
import { fetchFeaturedProducts } from "@/lib/firebase/products"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const featuredProducts = await fetchFeaturedProducts()
        setProducts(featuredProducts)
      } catch (error) {
        console.error("Error loading featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-4">
            <div className="aspect-square bg-muted rounded-md animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
            <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  // Fallback for demo purposes if no products are loaded
  const demoProducts: Product[] =
    products.length > 0
      ? products
      : [
          {
            id: "1",
            name: "Pro Master English Willow Bat",
            description: "Premium grade 1 English willow cricket bat with optimal balance and power",
            price: 299.99,
            discountPrice: 249.99,
            images: ["/placeholder.svg?height=400&width=300"],
            category: "bats",
            featured: true,
            rating: 4.8,
            stock: 15,
            brand: "CricketPro",
          },
          {
            id: "2",
            name: "Elite Player Kashmir Willow Bat",
            description: "High-performance Kashmir willow bat for intermediate players",
            price: 149.99,
            images: ["/placeholder.svg?height=400&width=300"],
            category: "bats",
            featured: true,
            rating: 4.5,
            stock: 23,
            brand: "BatMaster",
          },
          {
            id: "3",
            name: "Junior Academy Cricket Bat",
            description: "Specially designed for young players with perfect weight distribution",
            price: 89.99,
            images: ["/placeholder.svg?height=400&width=300"],
            category: "bats",
            featured: true,
            rating: 4.6,
            stock: 30,
            brand: "YoungStar",
          },
          {
            id: "4",
            name: "Tournament Special Bat",
            description: "Competition-grade bat with premium grip and excellent pickup",
            price: 199.99,
            discountPrice: 179.99,
            images: ["/placeholder.svg?height=400&width=300"],
            category: "bats",
            featured: true,
            rating: 4.7,
            stock: 12,
            brand: "CricketPro",
          },
        ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {demoProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

