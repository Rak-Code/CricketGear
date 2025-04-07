"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const categories = [
  { id: "bats", name: "Cricket Bats" },
  { id: "pads", name: "Batting Pads" },
  { id: "gloves", name: "Batting Gloves" },
  { id: "balls", name: "Cricket Balls" },
  { id: "helmets", name: "Helmets" },
]

const brands = [
  { id: "cricketpro", name: "CricketPro" },
  { id: "batmaster", name: "BatMaster" },
  { id: "youngstar", name: "YoungStar" },
  { id: "elitegear", name: "EliteGear" },
  { id: "promaster", name: "ProMaster" },
]

export default function ProductFilters() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  // Local state for filters - no dependency on URL params
  const [priceRange, setPriceRange] = useState<number[]>([0, 500])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  // Apply filters by constructing a new URL
  const applyFilters = () => {
    const queryParams = new URLSearchParams()

    // Add category filter
    if (selectedCategories.length > 0) {
      queryParams.set("category", selectedCategories.join(","))
    }

    // Add brand filter
    if (selectedBrands.length > 0) {
      queryParams.set("brand", selectedBrands.join(","))
    }

    // Add price range
    queryParams.set("minPrice", priceRange[0].toString())
    queryParams.set("maxPrice", priceRange[1].toString())

    // Navigate to the filtered URL
    router.push(`/products?${queryParams.toString()}`)
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, 500])
    router.push("/products")
  }

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Toggle brand selection
  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]))
  }

  return (
    <div>
      <div className="md:hidden mb-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between">
              Filters
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="space-y-4">
              <FilterContent
                selectedCategories={selectedCategories}
                selectedBrands={selectedBrands}
                priceRange={priceRange}
                toggleCategory={toggleCategory}
                toggleBrand={toggleBrand}
                setPriceRange={setPriceRange}
              />
              <div className="flex gap-2">
                <Button onClick={applyFilters} className="flex-1">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="hidden md:block space-y-6">
        <h3 className="font-semibold text-lg mb-4">Filters</h3>
        <FilterContent
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          priceRange={priceRange}
          toggleCategory={toggleCategory}
          toggleBrand={toggleBrand}
          setPriceRange={setPriceRange}
        />
        <div className="flex gap-2">
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}

interface FilterContentProps {
  selectedCategories: string[]
  selectedBrands: string[]
  priceRange: number[]
  toggleCategory: (id: string) => void
  toggleBrand: (id: string) => void
  setPriceRange: (range: number[]) => void
}

function FilterContent({
  selectedCategories,
  selectedBrands,
  priceRange,
  toggleCategory,
  toggleBrand,
  setPriceRange,
}: FilterContentProps) {
  return (
    <Accordion type="multiple" defaultValue={["categories", "price", "brands"]} className="space-y-4">
      <AccordionItem value="categories" className="border rounded-md p-2">
        <AccordionTrigger className="px-2">Categories</AccordionTrigger>
        <AccordionContent className="pt-4 px-2">
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="price" className="border rounded-md p-2">
        <AccordionTrigger className="px-2">Price Range</AccordionTrigger>
        <AccordionContent className="pt-4 px-2">
          <div className="space-y-4">
            <Slider value={priceRange} min={0} max={500} step={10} onValueChange={setPriceRange} />
            <div className="flex items-center justify-between">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="brands" className="border rounded-md p-2">
        <AccordionTrigger className="px-2">Brands</AccordionTrigger>
        <AccordionContent className="pt-4 px-2">
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={() => toggleBrand(brand.id)}
                />
                <Label htmlFor={`brand-${brand.id}`}>{brand.name}</Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

