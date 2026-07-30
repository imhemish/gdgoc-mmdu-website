"use client";

import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  icon?: string;
  href?: string;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    let timeout: ReturnType<typeof setTimeout>;

    const updateHeight = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (ref.current) {
          setHeight(0);

          requestAnimationFrame(() => {
            setHeight(ref.current?.scrollHeight || 0);
          });
        }
      }, 100);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(ref.current);
    observer.observe(document.body);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 80%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <div ref={containerRef}>
      {/* Header */}
      <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 lg:px-10">
        <h2 className="text-2xl md:text-5xl font-bold mb-4">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, #3f3f46, #71717a)",
            }}
          >
            GDGoC {process.env.NEXT_PUBLIC_INST_NAME_SHORT} Events
          </span>
        </h2>

        <p className="text-zinc-500 text-sm md:text-base max-w-xl">
          A timeline of events organized by GDG on Campus MM(DU)
        </p>
      </div>

      {/* Timeline */}
      <div ref={ref} className="relative max-w-7xl mx-auto pb-10 px-3">
        {data.map((item, index) => {
          const left = index % 2 === 0;

          const Wrapper = ({ children }: { children: React.ReactNode }) =>
            item.href ? (
              <Link
                href={item.href}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
              >
                {children}
              </Link>
            ) : (
              <>{children}</>
            );

          return (
            <Wrapper key={index}>
              <div className="relative z-20 flex flex-col md:flex-row mb-8 rounded-xl transition-transform duration-200 group-hover:scale-[1.01]">

                {/* MOBILE */}
                <div className="md:hidden w-full relative cursor-pointer">

                  <div className="absolute left-0 top-0 z-10 h-16 w-16 -ml-[6px] rounded-full overflow-hidden border-2 border-zinc-300 bg-zinc-100 transition-transform duration-200 group-hover:scale-105">
                    {item.icon ? (
                      <img
                        src={item.icon}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-zinc-300 to-zinc-500" />
                    )}
                  </div>

                  <div className="pl-[68px]">

                    <div className="h-16 flex items-center ml-4">
                      <h3
                        className="text-2xl font-bold bg-clip-text text-transparent leading-tight"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom, #18181b, #71717a)",
                        }}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {item.content}
                  </div>
                </div>

                {/* DESKTOP */}
                <div className="hidden md:flex w-full items-start cursor-pointer">

                  {left ? (
                    <>
                      <div className="w-[45%] flex justify-end pr-12 min-h-16 items-center">
                        <h3
                          className="text-4xl lg:text-5xl font-black bg-clip-text text-transparent text-right leading-[3.5rem] lg:leading-[4rem]"
                          style={{
                            backgroundImage:
                              "linear-gradient(to bottom, #18181b, #71717a)",
                          }}
                        >
                          {item.title}
                        </h3>
                      </div>

                      <div className="w-[10%] flex justify-center">
                        <div className="relative z-10 h-16 w-16 rounded-full overflow-hidden border-2 border-zinc-300 bg-zinc-100 shadow-sm transition-transform duration-200 group-hover:scale-105">

                          {item.icon ? (
                            <img
                              src={item.icon}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-b from-zinc-300 to-zinc-500" />
                          )}
                        </div>
                      </div>

                      <div className="w-[45%] pl-9 min-h-16 flex items-center">
                        {item.content}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-[45%] pr-9 flex justify-end min-h-16 items-center">
                        {item.content}
                      </div>

                      <div className="w-[10%] flex justify-center">
                        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-zinc-300 bg-zinc-100 shadow-sm transition-transform duration-200 group-hover:scale-105">

                          {item.icon ? (
                            <img
                              src={item.icon}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-b from-zinc-300 to-zinc-500" />
                          )}
                        </div>
                      </div>

                      <div className="w-[45%] flex justify-start pl-12 min-h-16 items-center">
                        <h3
                          className="text-4xl lg:text-5xl font-black bg-clip-text text-transparent leading-[3.5rem] lg:leading-[4rem]"
                          style={{
                            backgroundImage:
                              "linear-gradient(to bottom, #18181b, #71717a)",
                          }}
                        >
                          {item.title}
                        </h3>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Wrapper>
          );
        })}

        {/* Timeline */}
        <div
  style={{ height }}
  className="absolute left-9 md:left-1/2 md:-translate-x-1/2 top-0 w-[3px] overflow-hidden bg-gradient-to-b from-transparent via-zinc-200 to-transparent z-0"
>
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="absolute inset-x-0 top-0 w-[3px] rounded-full bg-gradient-to-b from-zinc-900 via-zinc-600 to-zinc-400"
          />
        </div>
      </div>
    </div>
  );
};