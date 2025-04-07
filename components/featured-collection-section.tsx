import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function FeaturedCollectionSection() {
  return (
    <section className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden rounded-xl group">
          <Image
            src="/placeholder.svg?height=600&width=800"
            alt="Professional Collection"
            width={800}
            height={600}
            className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
            <h3 className="text-white text-2xl font-bold mb-2">Professional Collection</h3>
            <p className="text-white/80 mb-4">Premium equipment for serious players</p>
            <Button className="w-fit" asChild>
              <Link href="/products?category=professional">Shop Now</Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl group">
          <Image
            src="/placeholder.svg?height=600&width=800"
            alt="Junior Collection"
            width={800}
            height={600}
            className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
            <h3 className="text-white text-2xl font-bold mb-2">Junior Collection</h3>
            <p className="text-white/80 mb-4">Quality gear for young cricketers</p>
            <Button className="w-fit" asChild>
              <Link href="/products?category=junior">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

