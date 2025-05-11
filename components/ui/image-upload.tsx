"use client"

import * as React from "react"
import Image from "next/image"
import { Trash, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { uploadFileToCloudinary, deleteFileFromCloudinary } from "@/lib/cloudinary/upload"

interface ImageUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean
  onChange: (value: { url: string; publicId: string }[]) => void
  onRemove: (value: { url: string; publicId: string }) => void
  value: { url: string; publicId: string }[]
  maxImages?: number
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value = [],
  maxImages = 5,
  className,
  ...props
}: ImageUploadProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Log component mounting and props for debugging
  React.useEffect(() => {
    console.log('ImageUpload component mounted with values:', {
      value,
      maxImages,
      disabled
    });
  }, [value, maxImages, disabled]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input change detected:', e.target.files);
    if (!e.target.files || e.target.files.length === 0) {
      console.log('No files selected');
      return;
    }

    try {
      setIsUploading(true)
      const files = Array.from(e.target.files)
      console.log('Processing files:', files.map(f => f.name));
      
      const remainingSlots = maxImages - value.length
      const filesToUpload = files.slice(0, remainingSlots)

      if (filesToUpload.length < files.length) {
        toast({
          title: "Maximum images limit",
          description: `Only ${remainingSlots} more image(s) can be uploaded.`,
          variant: "destructive",
        })
      }

      if (filesToUpload.length === 0) return

      // For debugging - just create local URLs and simulate the upload
      // This is a temporary workaround while we fix the full Cloudinary integration
      const simulatedUploads = filesToUpload.map(file => {
        const url = URL.createObjectURL(file);
        const publicId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        console.log(`Created local URL for ${file.name}:`, url);
        return { url, publicId };
      });
      
      onChange([...value, ...simulatedUploads]);
      toast({
        title: "Upload successful (local only)",
        description: `${simulatedUploads.length} image(s) created locally. Note: These are temporary and won't persist on page refresh.`,
      });
      
      e.target.value = "";
      
      /* Commenting out the actual upload implementation to debug
      const promises = filesToUpload.map(async (file) => {
        try {
          console.log(`Starting upload for ${file.name}`);
          const uploadResult = await uploadFileToCloudinary(file)
          console.log(`Upload result for ${file.name}:`, uploadResult);
          return {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
          }
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error)
          return null
        }
      })

      const results = await Promise.all(promises)
      const successfulUploads = results.filter((result): result is { url: string; publicId: string } => 
        result !== null
      )

      console.log('Successful uploads:', successfulUploads);
      
      if (successfulUploads.length > 0) {
        onChange([...value, ...successfulUploads])
        toast({
          title: "Upload successful",
          description: `${successfulUploads.length} image(s) uploaded successfully.`,
        })
      }

      // Reset the input
      e.target.value = ""
      */
    } catch (error) {
      console.error("Upload failed:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image(s).",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async (imageToRemove: { url: string; publicId: string }) => {
    try {
      console.log('Removing image:', imageToRemove);
      // Remove from state first for responsive UI
      onRemove(imageToRemove)
      
      // Then try to delete from Cloudinary if it's not a local URL
      if (imageToRemove.publicId && !imageToRemove.publicId.startsWith('temp_')) {
        await deleteFileFromCloudinary(imageToRemove.publicId)
      } else if (imageToRemove.url.startsWith('blob:')) {
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(imageToRemove.url);
        console.log('Revoked local object URL:', imageToRemove.url);
      }
    } catch (error) {
      console.error("Error removing image:", error)
      toast({
        title: "Error",
        description: "Failed to remove image. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle click on the upload area to trigger file input
  const handleUploadClick = () => {
    console.log('Upload area clicked, triggering file input');
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {value.map((image) => (
          <div
            key={image.publicId || image.url}
            className="relative group aspect-square rounded-md overflow-hidden border border-gray-200"
          >
            <Image
              src={image.url}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemove(image)}
                disabled={disabled}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {value.length < maxImages && (
          <div 
            className="aspect-square rounded-md border border-dashed border-gray-200 flex flex-col items-center justify-center text-sm gap-1 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleUploadClick}
          >
            <Upload className="h-6 w-6 text-gray-400" />
            <div className="text-gray-500">
              {isUploading ? "Uploading..." : "Click to upload"}
            </div>
            
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
              className="hidden"
              multiple={maxImages - value.length > 1}
              data-testid="image-upload-input"
            />
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500">
        {value.length} of {maxImages} images uploaded
      </div>
    </div>
  )
} 