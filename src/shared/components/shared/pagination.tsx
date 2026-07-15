"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams();

  function getPageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${baseUrl}?${params.toString()}`;
  }

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="التنقل بين الصفحات">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex h-10 items-center justify-center rounded-xl border border-border/50 bg-white px-3 text-text-secondary hover:bg-surface-secondary hover:border-accent/30 transition-all duration-200 shadow-sm"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-1 text-text-tertiary">...</span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
              page === currentPage
                ? "bg-gradient-to-l from-primary to-primary-light text-white shadow-md"
                : "border border-border/50 bg-white text-text-secondary hover:bg-surface-secondary hover:border-accent/30 shadow-sm"
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex h-10 items-center justify-center rounded-xl border border-border/50 bg-white px-3 text-text-secondary hover:bg-surface-secondary hover:border-accent/30 transition-all duration-200 shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
