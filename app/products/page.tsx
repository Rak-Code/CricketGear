import { Suspense } from "react"
import ProductList from "@/components/product-list"
import ProductFilters from "@/components/product-filters"
import ProductsLoading from "./loading"

export const metadata = {
  title: "Products | CricketGear",
  description: "Browse our collection of premium cricket equipment",
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <ProductFilters />
        <div>
          <Suspense fallback={<ProductsLoading />}>
            <ProductList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

