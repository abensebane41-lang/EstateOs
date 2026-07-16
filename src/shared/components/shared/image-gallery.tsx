"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface GalleryImage {
  url: string;
  altText?: string | null;
}

interface Props {
  images: GalleryImage[];
  initialIndex?: number;
}

export function ImageGallery({ images, initialIndex = 0 }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const open = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    document.body.style.overflow = "hidden";
  };

  const close = useCallback(() => {
    setIsOpen(false);
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    document.body.style.overflow = "";
  }, []);

  const goTo = useCallback((dir: "prev" | "next") => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    setActiveIndex((prev) => {
      if (dir === "prev") return prev > 0 ? prev - 1 : images.length - 1;
      return prev < images.length - 1 ? prev + 1 : 0;
    });
  }, [images.length]);

  const toggleZoom = useCallback(() => {
    setScale((prev) => {
      const next = prev === 1 ? 2 : 1;
      if (next === 1) {
        setTranslateX(0);
        setTranslateY(0);
      }
      return next;
    });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        dist: Math.sqrt(dx * dx + dy * dy),
      };
      return;
    }
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchRef.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ratio = dist / lastTouchRef.current.dist;
      setScale((prev) => Math.min(Math.max(prev * ratio, 1), 4));
      lastTouchRef.current.dist = dist;
      return;
    }
    if (scale > 1 && touchStartRef.current) {
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;
      setTranslateX(dx);
      setTranslateY(dy);
    }
  }, [scale]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (lastTouchRef.current) {
      lastTouchRef.current = null;
      return;
    }
    if (!touchStartRef.current) return;
    if (scale > 1) {
      touchStartRef.current = null;
      return;
    }
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    touchStartRef.current = null;
    if (Math.abs(dx) > 50) {
      goTo(dx > 0 ? "prev" : "next");
    }
  }, [scale, goTo]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goTo("prev");
      if (e.key === "ArrowLeft") goTo("next");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close, goTo]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => open(i)}
            className="relative aspect-square overflow-hidden rounded-xl border border-border/50 shadow-sm cursor-pointer group"
          >
            <img
              src={img.url}
              alt={img.altText || ""}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
            </div>
            {i === 0 && images.length > 1 && (
              <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                1/{images.length}
              </div>
            )}
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center select-none"
          onClick={(e) => {
            if (e.target === containerRef.current) close();
          }}
        >
          <button
            onClick={close}
            className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
            <span className="text-sm text-white/70">
              {activeIndex + 1} / {images.length}
            </span>
            <button
              onClick={toggleZoom}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              {scale > 1 ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </button>
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goTo("prev"); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goTo("next"); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="w-full h-full flex items-center justify-center p-4 sm:p-16"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[activeIndex].url}
              alt={images[activeIndex].altText || ""}
              className="max-h-full max-w-full object-contain transition-transform duration-200"
              style={{
                transform: `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`,
              }}
              draggable={false}
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur-sm overflow-x-auto max-w-[90vw]">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                    setScale(1);
                    setTranslateX(0);
                    setTranslateY(0);
                  }}
                  className={`flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === activeIndex ? "border-accent scale-110" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
