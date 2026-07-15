"use client";

import { useCallback } from "react";

interface ContactTrackerProps {
  agencyId: string;
  propertyId?: string | null;
  method: "PHONE" | "EMAIL" | "FORM";
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function ContactTracker({
  agencyId,
  propertyId,
  method,
  children,
  className,
  href,
  onClick,
}: ContactTrackerProps) {
  const track = useCallback(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "CONTACT_CLICK",
        agencyId,
        propertyId: propertyId || null,
        method,
      }),
    }).catch(() => {});
  }, [agencyId, propertyId, method]);

  if (href) {
    return (
      <a
        href={href}
        className={className}
        onClick={() => {
          track();
          onClick?.();
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <div
      className={className}
      onClick={() => {
        track();
        onClick?.();
      }}
    >
      {children}
    </div>
  );
}
