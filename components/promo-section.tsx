import { Shield, Truck, RotateCcw, Clock } from "lucide-react"

export default function PromoSection() {
  return (
    <section className="py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Free Shipping</h3>
            <p className="text-sm text-muted-foreground">On orders over $100</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <RotateCcw className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Easy Returns</h3>
            <p className="text-sm text-muted-foreground">30-day return policy</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">100% secure checkout</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">Always here to help</p>
          </div>
        </div>
      </div>
    </section>
  )
}

