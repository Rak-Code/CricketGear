// This is a mock implementation for demo purposes
// In a real app, you would use the actual Firebase SDK

import type { Product } from "@/lib/types"

// Mock products data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Pro Master English Willow Bat",
    description: "Premium grade 1 English willow cricket bat with optimal balance and power",
    price: 299.99,
    discountPrice: 249.99,
    images: ["/placeholder.svg?height=600&width=400"],
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
    images: ["/placeholder.svg?height=600&width=400"],
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
    images: ["/placeholder.svg?height=600&width=400"],
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
    images: ["/placeholder.svg?height=600&width=400"],
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
    images: ["/placeholder.svg?height=600&width=400"],
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
    images: ["/placeholder.svg?height=600&width=400"],
    category: "gloves",
    featured: false,
    rating: 4.4,
    stock: 25,
    brand: "BatMaster",
  },
]

interface ProductFilters {
  category?: string | null
  minPrice?: number
  maxPrice?: number
  brand?: string | null
  sort?: string | null
}

export async function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let filteredProducts = [...mockProducts]

  if (filters) {
    if (filters.category) {
      const categories = filters.category.split(",")
      filteredProducts = filteredProducts.filter((product) => categories.includes(product.category))
    }

    if (filters.brand) {
      const brands = filters.brand.split(",")
      filteredProducts = filteredProducts.filter((product) => brands.includes(product.brand.toLowerCase()))
    }

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => (product.discountPrice || product.price) >= filters.minPrice!,
      )
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => (product.discountPrice || product.price) <= filters.maxPrice!,
      )
    }

    if (filters.sort) {
      switch (filters.sort) {
        case "price-asc":
          filteredProducts.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
          break
        case "price-desc":
          filteredProducts.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
          break
        case "rating-desc":
          filteredProducts.sort((a, b) => b.rating - a.rating)
          break
        case "name-asc":
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
          break
      }
    }
  }

  return filteredProducts
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return mockProducts.filter((product) => product.featured)
}

export async function getProductById(id: string): Promise<Product | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const product = mockProducts.find((product) => product.id === id)
  return product || null
}

export async function getRelatedProducts(currentProductId: string, category: string): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return mockProducts.filter((product) => product.id !== currentProductId && product.category === category).slice(0, 4)
}

