"use client";

import { useEffect } from "react";

interface PropertyViewTrackerProps {
  propertyId: string;
  agencyId: string;
}

export function PropertyViewTracker({ propertyId, agencyId }: PropertyViewTrackerProps) {
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "PROPERTY_VIEW",
        propertyId,
        agencyId,
      }),
    }).catch(() => {});
  }, [propertyId, agencyId]);

  return null;
}
