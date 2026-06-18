"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    { src: "/images/group2.jpeg", alt: "GDG Campus Group 2" },
    { src: "/images/group.png", alt: "GDG Campus Group" },
    { src: "/images/group3.jpeg", alt: "GDG Campus Group 3" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <main className=" bg-gradient-to-b from-[#0a0a0a] to-[#373737] min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Text Content */}
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

          {/* Right Column - Image Carousel */}
          <div className="relative mt-6 sm:mt-8 lg:mt-0">
            <div className="bg-neutral-900 p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] mx-auto">
              <div className="aspect-video relative overflow-hidden rounded-xl sm:rounded-2xl">
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
                      currentSlide === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-3 sm:mt-4 px-2 flex flex-col justify-between gap-3 sm:gap-4">
                <p className="text-gray-400 text-lg sm:text-xl lg:text-2xl text-center">
                  Tenure 2024 - 25
                </p>

                {/* Navigation Dots */}
                <div className="flex gap-2 justify-end mt-8 sm:mt-12 lg:mt-16">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
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
