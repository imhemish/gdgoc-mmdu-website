"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import type { ChapterPhotosResponse } from "@/types/chapter_photos";

const LoadingSpinner = () => (
  <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
    <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-white/10 border-t-white/60 rounded-full animate-spin" />
  </div>
);

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [carouselImages, setCarouselImages] = useState<Array<{
    src: string;
    alt: string;
    id: number;
  }>>([]);
  // Tracks which image ids have finished loading (or errored) at least once
  const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchChapterPhotos() {
      try {
        const response = await fetch(`/api/chapter-photos/`);
        if (!response.ok) throw new Error("Failed to fetch chapter photos");

        const data: ChapterPhotosResponse = await response.json();

        if (data.results && data.results.length > 0) {
          const sortedPhotos = [...data.results].sort((a, b) => a.order - b.order);
          const images = sortedPhotos.map((photo) => ({
            src: photo.picture.url,
            alt: `GDG Chapter Photo ${photo.id}`,
            id: photo.id,
          }));
          setCarouselImages(images);
        } else {
          setCarouselImages([]);
        }
      } catch (error) {
        console.error("Error fetching chapter photos:", error);
        setCarouselImages([]);
      } finally {
        setFetching(false);
      }
    }

    fetchChapterPhotos();
  }, []);

  const currentImage = carouselImages[currentSlide];
  const isCurrentLoaded = currentImage ? loadedIds.has(currentImage.id) : false;

  // Timer only runs once the currently visible slide has finished loading.
  // If it hasn't loaded yet, the timer pauses instead of advancing.
  useEffect(() => {
    if (carouselImages.length === 0 || !isCurrentLoaded) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length, currentSlide, isCurrentLoaded]);

  const goToSlide = (index: number) => setCurrentSlide(index);

  const markLoaded = (id: number) => {
    setLoadedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

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
                {fetching ? (
                  <LoadingSpinner />
                ) : carouselImages.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                    <span className="text-white/30 text-sm tracking-wide">No photos available</span>
                  </div>
                ) : (
                  carouselImages.map((image, index) => {
                    const isVisible = currentSlide === index;
                    const isLoaded = loadedIds.has(image.id);
                    return (
                      <div
                        key={image.id}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                          isVisible ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {/* Spinner shows over/instead of the image until it has loaded */}
                        {!isLoaded && <LoadingSpinner />}
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 500px, 600px"
                          className={`object-cover transition-opacity duration-300 ${
                            isLoaded ? "opacity-100" : "opacity-0"
                          }`}
                          unoptimized
                          priority={index === 0}
                          onLoad={() => markLoaded(image.id)}
                          onError={() => markLoaded(image.id)}
                        />
                      </div>
                    );
                  })
                )}
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