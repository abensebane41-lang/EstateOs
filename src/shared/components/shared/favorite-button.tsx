"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/modules/property/favorite-actions";
import { cn } from "@/shared/lib/utils";
import { useTranslations } from "next-intl";

interface FavoriteButtonProps {
  propertyId: string;
  initialFavorited?: boolean;
  className?: string;
}

export function FavoriteButton({
  propertyId,
  initialFavorited = false,
  className,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("common");

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;

    startTransition(async () => {
      const result = await toggleFavorite(propertyId);
      if (result.success) {
        setFavorited((result.data as { favorited: boolean }).favorited);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white disabled:opacity-50",
        className
      )}
      aria-label={favorited ? t("removeFavorite") : t("addFavorite")}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          favorited ? "fill-error text-error" : "text-text-secondary"
        )}
      />
    </button>
  );
}
