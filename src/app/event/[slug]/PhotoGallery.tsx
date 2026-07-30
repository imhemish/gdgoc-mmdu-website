"use client";

import { useEffect, useState, useCallback } from "react";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import type { EventWrapupPhoto } from "@/types/event";

export default function PhotoGallery({ photos }: { photos: EventWrapupPhoto[] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  const sorted = [...photos].sort((a, b) => a.order - b.order);

  const openImage = (i: number) => {
    setIdx(i);
    setLoading(true);
    setOpen(true);
  };

  const changeImage = useCallback(
    (newIdx: number) => {
      setLoading(true);
      setIdx((newIdx + sorted.length) % sorted.length);
    },
    [sorted.length]
  );

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      changeImage(idx - 1);
    },
    [idx, changeImage]
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      changeImage(idx + 1);
    },
    [idx, changeImage]
  );

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") changeImage(idx - 1);
      if (e.key === "ArrowRight") changeImage(idx + 1);
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, idx, changeImage]);

  // Preload adjacent images
  useEffect(() => {
    if (!open || sorted.length < 2) return;

    const nextImg = new window.Image();
    nextImg.src = sorted[(idx + 1) % sorted.length].picture.url;

    const prevImg = new window.Image();
    prevImg.src = sorted[(idx - 1 + sorted.length) % sorted.length].picture.url;
  }, [idx, open, sorted]);

  if (!sorted.length) return null;

  return (
    <>
      <div className="gallery-grid">
        {sorted.map((photo, i) => (
          <button
            key={photo.id}
            className="gallery-thumb"
            onClick={() => openImage(i)}
            aria-label={`View photo ${i + 1}`}
          >
            <img
              src={photo.picture.thumbnail_url || photo.picture.url}
              alt={`Event photo ${i + 1}`}
            />
            <div className="gallery-thumb-overlay" />
          </button>
        ))}
      </div>

      {open && (
        <div className="lightbox-backdrop" onClick={() => setOpen(false)}>
          <button className="lightbox-close" onClick={() => setOpen(false)} aria-label="Close">
            <IconX size={22} />
          </button>

          <button className="lightbox-nav lightbox-prev" onClick={prev} aria-label="Previous">
            <IconChevronLeft size={28} />
          </button>

          <div className="lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
            {loading && (
              <div className="lightbox-spinner">
                <div className="spinner" />
              </div>
            )}

            <img
              key={sorted[idx].picture.url}
              src={sorted[idx].picture.url}
              alt={`Event photo ${idx + 1}`}
              className="lightbox-img"
              style={{
                opacity: loading ? 0 : 1,
                transition: "opacity 0.2s ease",
              }}
              onLoad={() => setLoading(false)}
            />

            <p className="lightbox-counter">
              {idx + 1} / {sorted.length}
            </p>
          </div>

          <button className="lightbox-nav lightbox-next" onClick={next} aria-label="Next">
            <IconChevronRight size={28} />
          </button>
        </div>
      )}
    </>
  );
}