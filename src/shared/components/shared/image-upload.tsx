"use client";

import { useState, useRef } from "react";
import { Upload, X, Star, ImagePlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { addPropertyImage, deletePropertyImage, setPrimaryImage } from "@/modules/property/image-actions";

interface ImageUploadProps {
  propertyId: string;
  images: Array<{ id: string; url: string; altText: string | null; isPrimary: boolean }>;
  onImagesChange: () => void;
}

export function ImageUpload({ propertyId, images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("propertyId", propertyId);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (res.ok && data.url) {
          await addPropertyImage(propertyId, data.url, file.name, images.length === 0);
        }
      }
      onImagesChange();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(imageId: string) {
    await deletePropertyImage(imageId);
    onImagesChange();
  }

  async function handleSetPrimary(imageId: string) {
    await setPrimaryImage(imageId, propertyId);
    onImagesChange();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <ImagePlus className="mb-3 h-10 w-10 text-text-tertiary" />
        <p className="text-sm text-text-secondary">
          {uploading ? "جاري الرفع..." : "اسحب الصور هنا أو انقر للتحديد"}
        </p>
        <p className="mt-1 text-xs text-text-tertiary">JPG, PNG, WebP — حد أقصى 5 ميغابايت</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
              <img src={image.url} alt={image.altText || ""} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => handleSetPrimary(image.id)}
                >
                  <Star className={`h-4 w-4 ${image.isPrimary ? "fill-accent text-accent" : "text-white"}`} />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDelete(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {image.isPrimary && (
                <div className="absolute right-2 top-2 rounded bg-accent px-2 py-0.5 text-xs font-medium text-primary-dark">
                  رئيسية
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
