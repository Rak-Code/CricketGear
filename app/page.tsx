import FeaturedProducts from "@/components/featured-products"
import HeroCarousel from "@/components/hero-carousel"
import CategorySection from "@/components/category-section"
import NewsletterSignup from "@/components/newsletter-signup"
import TestimonialSection from "@/components/testimonial-section"
import FeaturedCollectionSection from "@/components/featured-collection-section"
import PromoSection from "@/components/promo-section"

export default function Home() {
  return (
    <div>
      <HeroCarousel />

      <div className="container mx-auto px-4 py-12 space-y-16">
        <PromoSection />

        <CategorySection />

        <section className="py-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="mt-2 text-muted-foreground">Discover our handpicked selection of premium cricket equipment</p>
          </div>
          <FeaturedProducts />
        </section>

        <FeaturedCollectionSection />

        <TestimonialSection />

        <NewsletterSignup />
      </div>
    </div>
  )
}

