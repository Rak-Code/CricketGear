import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductActions from "@/components/product-actions"
import RelatedProducts from "@/components/related-products"
import ProductReviews from "@/components/product-reviews"
import { getProductById } from "@/lib/firebase/products"
import { cn } from "@/lib/utils"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // In a real app, you would fetch this from your database
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/products" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images[0] || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-md border">
                  <Image
                    src={image || "/placeholder.svg?height=150&width=150"}
                    alt={`${product.name} - Image ${index + 1}`}
                    width={150}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating}) · 24 reviews</span>
            </div>
          </div>

          <div>
            {product.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">${product.discountPrice.toFixed(2)}</span>
                <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            )}
            <p className="text-sm text-muted-foreground mt-1">In stock: {product.stock} units</p>
          </div>

          <ProductActions product={product} />

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="flex-1">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">
                Shipping
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <p className="text-muted-foreground">{product.description}</p>
              <p className="text-muted-foreground mt-4">
                This premium cricket bat is crafted from the finest materials to provide optimal performance on the
                field. Designed for both professional players and enthusiasts, it offers the perfect balance of power
                and control.
              </p>
            </TabsContent>
            <TabsContent value="specifications" className="pt-4">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 border-b pb-2">
                  <span className="font-medium">Brand</span>
                  <span>{product.brand}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b pb-2">
                  <span className="font-medium">Material</span>
                  <span>English Willow</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b pb-2">
                  <span className="font-medium">Weight</span>
                  <span>1.2 kg</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b pb-2">
                  <span className="font-medium">Handle</span>
                  <span>Premium Cane Handle</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">Warranty</span>
                  <span>1 Year</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="pt-4">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We offer free standard shipping on all orders over $100. For orders under $100, standard shipping
                  costs $10.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">Estimated Delivery Times:</h4>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>Standard Shipping: 5-7 business days</li>
                    <li>Express Shipping: 2-3 business days (additional $15)</li>
                    <li>Next Day Delivery: Next business day (additional $25, order before 2pm)</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="space-y-12">
        <Suspense fallback={<div>Loading reviews...</div>}>
          <ProductReviews productId={params.id} />
        </Suspense>

        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <RelatedProducts currentProductId={params.id} category={product.category} />
        </div>
      </div>
    </div>
  )
}

