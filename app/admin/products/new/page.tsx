"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { db } from "@/lib/firebase/firebase"
import { collection, addDoc, serverTimestamp, getFirestore } from "firebase/firestore"
import { ImageUpload } from "@/components/ui/image-upload"

export default function AddProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAdmin, loading: authLoading, refreshToken, debugAdminStatus } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    brand: "",
    stock: "",
    featured: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImagesChange = (newImages: { url: string; publicId: string }[]) => {
    setImages(newImages)
  }

  const handleImageRemove = (imageToRemove: { url: string; publicId: string }) => {
    setImages(prev => prev.filter(img => img.url !== imageToRemove.url))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Debug admin status before submission
      await debugAdminStatus();

      // Check if user is admin
      if (!isAdmin) {
        setError("You don't have permission to add products. Admin status check failed.")
        setIsSubmitting(false)
        return
      }

      console.log("Submitting product as admin:", {
        isAdmin,
        userId: user?.uid,
        adminStatus: user?.isAdmin
      })

      // Validate required fields
      if (!formData.name || !formData.category || !formData.price) {
        setError("Please fill all required fields (name, category, price)");
        setIsSubmitting(false);
        return;
      }

      // Force token refresh to ensure latest admin status
      await refreshToken();

      // Create product object with required fields first
      const productData = {
        name: formData.name,
        description: formData.description || "",
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        stock: parseInt(formData.stock, 10) || 0,
        status: parseInt(formData.stock, 10) > 0 ? "active" : "out_of_stock",
        createdAt: serverTimestamp(),
        createdBy: user?.uid || "unknown",
      }

      // Add optional fields if present
      if (formData.discountPrice) {
        productData["discountPrice"] = parseFloat(formData.discountPrice);
      }
      
      if (formData.brand) {
        productData["brand"] = formData.brand;
      }
      
      if (formData.featured) {
        productData["featured"] = formData.featured;
      }
      
      // Add Cloudinary images
      if (images.length > 0) {
        productData["images"] = images.map(img => ({
          url: img.url,
          publicId: img.publicId
        }));
      }

      console.log("Adding product to Firestore:", productData);
      console.log("Firestore instance:", db);

      // Create products collection if it doesn't exist by adding a document
      try {
        const productsCollection = collection(db, "products");
        const docRef = await addDoc(productsCollection, productData);
        console.log("Product added with ID:", docRef.id);
        
        toast({
          title: "Product added successfully",
          description: "The product has been added to your inventory.",
        });
        
        router.push("/admin/products");
      } catch (firestoreError: any) {
        console.error("Firestore error:", firestoreError);
        throw firestoreError; // Re-throw to be caught by the outer catch
      }
    } catch (err: any) {
      console.error("Error adding product:", err);
      
      // Parse Firebase error code
      let errorMessage = "Unknown error occurred";
      
      if (err.code) {
        switch (err.code) {
          case 'permission-denied':
            errorMessage = "You don't have permission to add products. Please check your admin status.";
            break;
          case 'unavailable':
            errorMessage = "Service temporarily unavailable. Please try again later.";
            break;
          case 'unauthenticated':
            errorMessage = "Authentication required. Please sign in again.";
            break;
          default:
            errorMessage = `Error: ${err.message || err.code}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(`Failed to add product: ${errorMessage}. Code: ${err.code || "N/A"}`);
      
      toast({
        title: "Error",
        description: "Failed to add product: " + errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // If not admin, show error
  if (!authLoading && !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-red-800 mb-4">Access Denied</h2>
          <p className="text-red-700 mb-4">You don't have permission to add products.</p>
          <Button variant="outline" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product in your inventory</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details of your product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select value={formData.brand} onValueChange={(value) => handleSelectChange("brand", value)}>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CricketPro">CricketPro</SelectItem>
                    <SelectItem value="BatMaster">BatMaster</SelectItem>
                    <SelectItem value="YoungStar">YoungStar</SelectItem>
                    <SelectItem value="EliteGear">EliteGear</SelectItem>
                    <SelectItem value="ProMaster">ProMaster</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price* (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                <Input
                  id="discountPrice"
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock*</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category*</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bats">Cricket Bats</SelectItem>
                    <SelectItem value="pads">Batting Pads</SelectItem>
                    <SelectItem value="gloves">Batting Gloves</SelectItem>
                    <SelectItem value="balls">Cricket Balls</SelectItem>
                    <SelectItem value="helmets">Helmets</SelectItem>
                    <SelectItem value="footwear">Footwear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>Add images of your product</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={images}
              disabled={isSubmitting}
              onChange={handleImagesChange}
              onRemove={handleImageRemove}
              maxImages={5}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting || authLoading}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

