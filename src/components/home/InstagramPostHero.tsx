"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

interface InstagramMediaLink {
  id: string;
  url: string;
  type: "image" | "video";
  dimensions?: { height: number; width: number };
}

interface InstagramPost {
  shortcode: string;
  postType: "image" | "video" | "carousel";
  caption: string;
  taken_at_timestamp: number;
  media_count: number;
  video_duration: number | null;
  links: InstagramMediaLink[];
  isReel: boolean;
}

const InstagramPostHero = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [mediaIndex, setMediaIndex] = useState(0);

  // caption clamp / expand state
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mediaHeight, setMediaHeight] = useState<number | undefined>(undefined);

  const mediaRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "/api/instagram",
        );
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // track desktop vs mobile breakpoint (md = 768px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // measure the media box height so the desktop caption clamp can match it
  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    const update = () => setMediaHeight(el.clientHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [current, mediaIndex]);

  // collapse caption whenever the post changes
  useEffect(() => {
    setExpanded(false);
  }, [current]);

  // detect whether the caption is actually being clipped, so "Show more" only
  // appears when needed. Measured while collapsed (scrollHeight still reports
  // the full content height even when clamped/clipped).
  useEffect(() => {
    const el = captionRef.current;
    if (!el) {
      setIsOverflowing(false);
      return;
    }
    const check = () => setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, isDesktop, mediaHeight]);

  const handlePrev = useCallback(() => {
    setMediaIndex(0);
    setCurrent((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  }, [posts.length]);

  const handleNext = useCallback(() => {
    setMediaIndex(0);
    setCurrent((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  }, [posts.length]);

  const handleMediaPrev = useCallback((mediaCount: number) => {
    setMediaIndex((prev) => (prev === 0 ? mediaCount - 1 : prev - 1));
  }, []);

  const handleMediaNext = useCallback((mediaCount: number) => {
    setMediaIndex((prev) => (prev === mediaCount - 1 ? 0 : prev + 1));
  }, []);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="loader mb-4" />
          <p className="text-gray-700 text-xl">Loading posts...</p>
        </div>
        <style jsx>{`
          .loader {
            width: 40px;
            height: 40px;
            border: 4px solid transparent;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center">
          <h2 className="text-red-600 text-2xl font-semibold">Error</h2>
          <p className="text-gray-700 mt-2">{error}</p>
        </div>
      </div>
    );

  const post = posts[current];
  const activeMedia = post?.links[mediaIndex];

  // Fall back to a sane default ratio if dimensions are missing
  const width = activeMedia?.dimensions?.width ?? 1;
  const height = activeMedia?.dimensions?.height ?? 1;
  const aspectRatio = `${width} / ${height}`;

  // Collapsed clamp: match the media box height on desktop, 2 lines on mobile.
  const captionStyle: React.CSSProperties = expanded
    ? {}
    : isDesktop
    ? { maxHeight: mediaHeight, overflow: "hidden" }
    : {};
  const captionClassName = [
    "text-gray-700 text-sm text-center md:text-left whitespace-pre-wrap",
    !expanded && !isDesktop ? "line-clamp-2" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // shared post-nav controls (prev/next + counter)
  const PostNavControls = () => (
    <>
      <div className="flex gap-4">
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

      <span className="text-sm text-gray-500">
        {current + 1} / {posts.length}
      </span>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full text-center">
        <h1 className="p-10 text-xl md:text-2xl font-thin text-gray-800 tracking-widest">
          Latest Posts From Instagram
        </h1>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 mb-10">No posts found.</p>
      ) : (
        <div className="w-full max-w-xs md:max-w-3xl flex flex-col items-center mb-10">
          <div
            key={post.shortcode}
            className="w-full flex flex-col md:flex-row md:items-start md:gap-8"
          >
            {/* media column: media box + (desktop) nav controls live together,
                so caption height never affects their position */}
            <div className="w-full md:w-1/2 flex flex-col items-center shrink-0">
              <div
                ref={mediaRef}
                className="relative w-full max-h-[420px] bg-black flex items-center justify-center overflow-hidden rounded-lg"
                style={{ aspectRatio }}
              >
                {activeMedia?.type === "video" ? (
                  <video
                    key={activeMedia.url}
                    src={activeMedia.url}
                    controls
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <img
                    key={activeMedia?.url}
                    src={activeMedia?.url}
                    alt={post.caption}
                    className="h-full w-full object-contain"
                  />
                )}

                {post.media_count > 1 && (
                  <>
                    <button
                      onClick={() => handleMediaPrev(post.media_count)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/80 flex items-center justify-center"
                    >
                      <IconArrowLeft className="h-3.5 w-3.5 text-black" />
                    </button>
                    <button
                      onClick={() => handleMediaNext(post.media_count)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/80 flex items-center justify-center"
                    >
                      <IconArrowRight className="h-3.5 w-3.5 text-black" />
                    </button>
                    <span className="absolute top-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                      {mediaIndex + 1}/{post.media_count}
                    </span>
                  </>
                )}
              </div>

              {/* desktop-only: sits right under the media, unaffected by caption height */}
              <div className="hidden md:flex w-full items-center justify-between mt-6">
                <PostNavControls />
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start md:w-1/2 md:pt-0">
              {post.caption && (
                <div
                  className={isOverflowing ? "mt-3 md:mt-0 cursor-pointer select-none" : "mt-3 md:mt-0"}
                  onClick={isOverflowing ? toggleExpanded : undefined}
                  role={isOverflowing ? "button" : undefined}
                  tabIndex={isOverflowing ? 0 : undefined}
                  onKeyDown={
                    isOverflowing
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleExpanded();
                          }
                        }
                      : undefined
                  }
                >
                  <p
                    ref={captionRef}
                    className={`${captionClassName} px-4 md:px-0`}
                    style={captionStyle}
                  >
                    {post.caption}
                  </p>
                  {isOverflowing && (
                    <span className="block text-xs font-medium text-gray-500 hover:text-gray-700 mt-1 px-4 md:px-0">
                      {expanded ? "Show less" : "Show more"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* mobile-only: below the full stacked media+caption */}
          <div className="flex md:hidden w-full items-center justify-between mt-6 px-4">
            <PostNavControls />
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramPostHero;