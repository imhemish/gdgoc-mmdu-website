"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface VelocityScrollProps {
  images: string[];
  default_velocity?: number;
  className?: string;
  imageWidth?: number;
  imageHeight?: number;
}

interface ParallaxProps {
  images: string[];
  baseVelocity: number;
  className?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function VelocityScroll({
  images,
  default_velocity = 5,
  className,
  imageWidth = 200,
  imageHeight = 200,
}: VelocityScrollProps) {
  function ParallaxImages({
    images,
    baseVelocity = 100,
    className,
    imageWidth,
    imageHeight,
  }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 50,
      stiffness: 400,
    });

    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
      clamp: false,
    });

    const [repetitions, setRepetitions] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const calculateRepetitions = () => {
        if (containerRef.current && imagesContainerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          const imagesWidth = imageWidth || 0 * images.length;
          const newRepetitions = Math.ceil(containerWidth / imagesWidth) + 2;
          setRepetitions(newRepetitions);
        }
      };

      calculateRepetitions();

      window.addEventListener("resize", calculateRepetitions);
      return () => window.removeEventListener("resize", calculateRepetitions);
    }, [images, imageWidth]);

    const x = useTransform(baseX, (v) => `${wrap(-100 / repetitions, 0, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get();

      baseX.set(baseX.get() + moveBy);
    });

    return (
      <div
        className="w-full overflow-hidden whitespace-nowrap"
        ref={containerRef}
      >
        <motion.div
          className={cn("inline-flex items-center", className)}
          style={{ x }}
          ref={imagesContainerRef}
        >
          {Array.from({ length: repetitions }).map((_, repIndex) => (
            <div key={repIndex} className="inline-flex gap-4">
              {images.map((image, imgIndex) => (
                <div
                  key={`${repIndex}-${imgIndex}`}
                  className="inline-block"
                  style={{ width: imageWidth, height: imageHeight }}
                >
                  <Image
                    width={imageWidth}
                    height={imageHeight}
                    src={image}
                    alt={`Scrolling image ${imgIndex + 1}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <section className="relative w-full">
      <ParallaxImages
        images={images}
        baseVelocity={default_velocity}
        className={className}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
      />
      <ParallaxImages
        images={images}
        baseVelocity={-default_velocity}
        className={className}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
      />
    </section>
  );
}
