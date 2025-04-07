"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "@/components/product-card"
import type { Product } from "@/lib/types"
import { fetchProducts } from "@/lib/firebase/products"

export default function ProductList() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const category = searchParams.get("category")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const brand = searchParams.get("brand")
  const sort = searchParams.get("sort")

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        // In a real app, you would pass these filters to your fetchProducts function
        const fetchedProducts = await fetchProducts({
          category,
          minPrice: minPrice ? Number.parseInt(minPrice) : undefined,
          maxPrice: maxPrice ? Number.parseInt(maxPrice) : undefined,
          brand,
          sort,
        })
        setProducts(fetchedProducts)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category, minPrice, maxPrice, brand, sort])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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

  // Fallback for demo purposes
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
          {
            id: "5",
            name: "Professional Batting Pads",
            description: "Lightweight and durable batting pads with superior protection",
            price: 129.99,
            images: ["/placeholder.svg?height=400&width=300"],
            category: "pads",
            featured: false,
            rating: 4.6,
            stock: 18,
            brand: "CricketPro",
          },
          {
            id: "6",
            name: "Premium Batting Gloves",
            description: "High-quality batting gloves with extra padding for comfort",
            price: 79.99,
            images: ["/placeholder.svg?height=400&width=300"],
            category: "gloves",
            featured: false,
            rating: 4.4,
            stock: 25,
            brand: "BatMaster",
          },
        ]

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {demoProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

