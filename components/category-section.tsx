import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const categories = [
  {
    name: "Cricket Bats",
    image: "/placeholder.svg?height=300&width=300",
    href: "/products?category=bats",
    description: "Premium English & Kashmir willow bats",
  },
  {
    name: "Batting Pads",
    image: "/placeholder.svg?height=300&width=300",
    href: "/products?category=pads",
    description: "Protective gear for batsmen",
  },
  {
    name: "Batting Gloves",
    image: "/placeholder.svg?height=300&width=300",
    href: "/products?category=gloves",
    description: "Comfort and protection for your hands",
  },
  {
    name: "Cricket Balls",
    image: "/placeholder.svg?height=300&width=300",
    href: "/products?category=balls",
    description: "Match and practice balls",
  },
]

export default function CategorySection() {
  return (
    <section className="py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
        <p className="mt-2 text-muted-foreground">Browse our collection of premium cricket equipment</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative overflow-hidden rounded-xl border hover:shadow-lg transition-all duration-300 category-card"
          >
            <div className="aspect-square overflow-hidden">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={300}
                height={300}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="font-semibold text-xl mb-1">{category.name}</h3>
              <p className="text-sm text-white/80 mb-3">{category.description}</p>
              <Button
                size="sm"
                variant="outline"
                className="w-fit bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Shop Now
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

