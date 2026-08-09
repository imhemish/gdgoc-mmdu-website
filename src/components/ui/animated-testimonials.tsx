"use client";

import {
  IconArrowLeft,
  IconArrowRight,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { TeamMember } from "@/types/team";

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: TeamMember[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [rotations, setRotations] = useState<number[]>([]);

  useEffect(() => {
    setRotations(
      testimonials.map(() => Math.floor(Math.random() * 21) - 10)
    );
  }, [testimonials]);

  const handleNext = () =>
    setActive((prev) => (prev + 1) % testimonials.length);

  const handlePrev = () =>
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const isActive = (index: number) => index === active;

  useEffect(() => {
    if (!autoplay || testimonials.length <= 1) return;

    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  if (!testimonials.length) return null;

  const activeMember = testimonials[active];

  return (
    <div className="max-w-sm md:max-w-4xl mx-auto antialiased px-4 md:px-8 py-14">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <div className="relative w-[72%] aspect-square max-w-[320px] mx-auto md:max-w-none">
            <AnimatePresence>
              {testimonials.map((member, index) => (
                <motion.div
                  key={`${member.name}-${index}`}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: rotations[index] ?? 0,
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index)
                      ? 0
                      : rotations[index] ?? 0,
                    zIndex: isActive(index)
                      ? 999
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: rotations[index] ?? 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 origin-bottom"
                >
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col h-[370px] relative">
          {/* Content area */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-2">
            <motion.div
              key={active}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {activeMember.name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {activeMember.title}
                  </p>
                </div>

                {activeMember.linkedin && (
                  <a
                    href={activeMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <IconBrandLinkedin size={16} />
                    LinkedIn
                  </a>
                )}
              </div>

              <motion.p className="text-lg text-white mt-3">
                {(activeMember.bio ||
                  `${activeMember.title} at GDG on Campus ${process.env.NEXT_PUBLIC_INST_NAME_LONG}`)
                  .split(" ")
                  .map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{
                        filter: "blur(10px)",
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        filter: "blur(0px)",
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                        delay: 0.02 * index,
                      }}
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
              </motion.p>

              {activeMember.tags?.length ? (
                <div className="flex flex-wrap gap-2 mt-4">
                  {activeMember.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80"
                    >
                      {tag.replace(/^[-_]+/, "")}
                    </span>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </div>

          {/* Fixed-position navigation */}
          <div className="absolute bottom-0 left-0 flex gap-4">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/button"
            >
              <IconArrowLeft className="h-5 w-5 text-black dark:text-neutral-400 group-hover/button:rotate-12 transition-transform duration-300" />
            </button>

            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/button"
            >
              <IconArrowRight className="h-5 w-5 text-black dark:text-neutral-400 group-hover/button:-rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};