export interface Product {
  id: string
  name: string
  description: string
  price: number
  discountPrice?: number
  images: string[]
  category: string
  featured: boolean
  rating: number
  stock: number
  brand: string
}

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  isAdmin?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  productId: string
  rating: number
  comment: string
  date: Date
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: Address
  paymentMethod: string
  paymentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

