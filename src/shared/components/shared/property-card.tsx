import { Bed, MapPin } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { FavoriteButton } from "./favorite-button";

interface PropertyCardProps {
  title: string;
  price: string;
  location: string;
  bedrooms?: number;
  area: string;
  imageUrl?: string;
  status?: "active" | "draft";
  isFeatured?: boolean;
  propertyId?: string;
  isFavorited?: boolean;
  className?: string;
}

export function PropertyCard({
  title,
  price,
  location,
  bedrooms,
  area,
  imageUrl,
  status = "active",
  isFeatured,
  propertyId,
  isFavorited,
  className,
}: PropertyCardProps) {
  const statusVariant = {
    active: "success" as const,
    draft: "outline" as const,
  };

  return (
    <div className={cn("group rounded-xl border border-border bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300", className)}>
      <div className="relative aspect-[4/3] bg-surface-secondary overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-tertiary">
            <MapPin className="h-12 w-12" />
          </div>
        )}
        {propertyId && (
          <div className="absolute right-3 top-3">
            <FavoriteButton
              propertyId={propertyId}
              initialFavorited={isFavorited}
            />
          </div>
        )}
        {status !== "active" && (
          <div className="absolute left-3 top-3">
            <Badge variant={statusVariant[status]}>
              {status === "draft" ? "مسودة" : ""}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-text-primary line-clamp-1">{title}</h3>
          {isFeatured && <Badge variant="accent">مميز</Badge>}
        </div>
        <p className="text-sm text-text-secondary flex items-center gap-1 mb-3">
          <MapPin className="h-3 w-3" />
          {location}
        </p>
        <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
          {bedrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bed className="h-3 w-3" />
              {bedrooms}
            </span>
          )}
          <span>{area}</span>
        </div>
        <div className="border-t border-border pt-3">
          <p className="text-lg font-bold text-accent">{price}</p>
        </div>
      </div>
    </div>
  );
}
