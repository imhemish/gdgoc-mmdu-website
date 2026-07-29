"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import type { ChapterPhotosResponse } from "@/types/chapter_photos";

const PatternFallback = ({ index }: { index: number }) => {
  const labels = ["Campus Engagement", "Developer Community", "Tech Innovation"];
  const label = labels[index % labels.length];

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a0a]">
      {/* Fine dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Subtle diagonal hatching */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 20px,
            rgba(255,255,255,0.015) 20px,
            rgba(255,255,255,0.015) 21px
          )`,
        }}
      />

      {/* SVG geometric accents */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 600 338"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Corner brackets */}
        <rect x="24" y="24" width="60" height="1" fill="rgba(255,255,255,0.12)" />
        <rect x="24" y="24" width="1" height="60" fill="rgba(255,255,255,0.12)" />

        <rect x="516" y="24" width="60" height="1" fill="rgba(255,255,255,0.12)" />
        <rect x="575" y="24" width="1" height="60" fill="rgba(255,255,255,0.12)" />

        <rect x="24" y="313" width="60" height="1" fill="rgba(255,255,255,0.12)" />
        <rect x="24" y="253" width="1" height="60" fill="rgba(255,255,255,0.12)" />

        <rect x="516" y="313" width="60" height="1" fill="rgba(255,255,255,0.12)" />
        <rect x="575" y="253" width="1" height="60" fill="rgba(255,255,255,0.12)" />

        {/* Concentric circles, center */}
        <circle cx="300" cy="169" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx="300" cy="169" r="60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <circle cx="300" cy="169" r="100" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />

        {/* Crosshair */}
        <line x1="285" y1="169" x2="315" y2="169" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <line x1="300" y1="154" x2="300" y2="184" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <circle cx="300" cy="169" r="2" fill="rgba(255,255,255,0.25)" />
      </svg>

      {/* Text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span className="text-[10px] tracking-[0.35em] text-white/25 uppercase font-light">
          GDG Chapter
        </span>
        <div
          className="border border-white/10 px-8 py-2 mt-1"
          style={{ borderStyle: "solid" }}
        >
          <span className="text-base font-light tracking-[0.18em] text-white/35 uppercase">
            {label}
          </span>
        </div>
        <span className="text-[10px] text-white/15 tracking-[0.25em] mt-2 uppercase">
          Loading
        </span>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [carouselImages, setCarouselImages] = useState<Array<{
    src: string;
    alt: string;
    id: number;
    isFallback?: boolean;
  }>>([]);

  const fallbackPatterns = [
    { id: 1, alt: "GDG Pattern 1" },
    { id: 2, alt: "GDG Pattern 2" },
    { id: 3, alt: "GDG Pattern 3" },
  ];

  const toFallback = (items: typeof fallbackPatterns) =>
    items.map(p => ({ ...p, src: "", isFallback: true }));

  useEffect(() => {
    async function fetchChapterPhotos() {
      try {
        const response = await fetch(`/api/chapter-photos/`);
        if (!response.ok) throw new Error("Failed to fetch chapter photos");

        const data: ChapterPhotosResponse = await response.json();
        //console.log("Fetched chapter photos:", data);

        if (data.results && data.results.length > 0) {
          const sortedPhotos = [...data.results].sort((a, b) => a.order - b.order);
          const images = sortedPhotos.map((photo) => ({
            src: photo.picture.url,
            alt: `GDG Chapter Photo ${photo.id}`,
            id: photo.id,
            isFallback: false,
          }));
          setCarouselImages(images);
        } else {
          setCarouselImages(toFallback(fallbackPatterns));
        }
      } catch (error) {
        console.error("Error fetching chapter photos:", error);
        setCarouselImages(toFallback(fallbackPatterns));
      } finally {
        setLoading(false);
      }
    }

    fetchChapterPhotos();
  }, []);

  useEffect(() => {
    if (carouselImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);

  const markAsFallback = (id: number) => {
    setCarouselImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, isFallback: true } : img))
    );
  };

  if (loading) {
    return (
      <main className="bg-gradient-to-b from-[#0a0a0a] to-[#373737] min-h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-[600px] aspect-video">
          <PatternFallback index={0} />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-[#0a0a0a] to-[#373737] min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center max-w-7xl mx-auto">

          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="relative w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] mx-auto lg:mx-0">
              <Image
                src="/images/Hero.png"
                alt="GDG Logo"
                width={500}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] mx-auto lg:mx-0">
              <Image
                src="/images/slogan.png"
                alt="Slogan Logo"
                width={500}
                height={500}
                className="w-full h-auto m-0 sm:m-4 lg:m-6"
              />
            </div>
          </div>

          {/* Right Carousel */}
          <div className="relative mt-6 sm:mt-8 lg:mt-0">
            <div className="bg-neutral-900 p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] mx-auto">

              {/* Slides container */}
              <div className="aspect-video relative overflow-hidden rounded-xl sm:rounded-2xl">
                {carouselImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                      currentSlide === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {image.isFallback || !image.src ? (
                      <PatternFallback index={index} />
                    ) : (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 500px, 600px"
                        className="object-cover"
                        unoptimized
                        priority={index === 0}
                        onError={() => markAsFallback(image.id)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 sm:mt-4 px-2 flex flex-col justify-between gap-3 sm:gap-4">
                <p className="text-gray-400 text-lg sm:text-xl lg:text-2xl text-center">
                  Gallery
                </p>
                <div className="flex gap-2 justify-end mt-8 sm:mt-12 lg:mt-16">
                  {carouselImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors duration-300 ${
                        currentSlide === index
                          ? "bg-white"
                          : "bg-gray-600 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default HeroSection;