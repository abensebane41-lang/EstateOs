"use client";

import { useState } from "react";
import { ImageUpload } from "@/shared/components/shared/image-upload";

interface Image {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
}

export function PropertyImagesSection({ propertyId, initialImages }: { propertyId: string; initialImages: Image[] }) {
  const [images, setImages] = useState<Image[]>(initialImages);
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleRefresh() {
    const res = await fetch(`/api/property-images?propertyId=${propertyId}`);
    const data = await res.json();
    if (data.images) setImages(data.images);
    setRefreshKey((p) => p + 1);
  }

  return <ImageUpload propertyId={propertyId} images={images} onImagesChange={handleRefresh} key={refreshKey} />;
}
