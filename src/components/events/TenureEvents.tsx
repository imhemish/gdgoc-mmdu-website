"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Timeline } from "@/components/ui/timeline";

function formatEventRange(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = start.getMonth() === end.getMonth();
  const sameDay = start.getDate() === end.getDate() && sameMonth && sameYear;

  const formatTime = (d: Date, forceMeridiem = true) =>
    d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: d.getMinutes() === 0 ? undefined : "2-digit",
      hour12: true,
    }).replace(/\s/g, "");

  const startMeridiem = start
    .toLocaleTimeString("en-IN", { hour: "numeric", hour12: true })
    .match(/am|pm/i)?.[0];

  const endMeridiem = end
    .toLocaleTimeString("en-IN", { hour: "numeric", hour12: true })
    .match(/am|pm/i)?.[0];

  if (sameDay) {
    const startTime =
      startMeridiem === endMeridiem
        ? formatTime(start).replace(/am|pm/i, "")
        : formatTime(start);

    const endTime = formatTime(end);

    return `${startTime}–${endTime}, ${start.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  }

  const startText = `${formatTime(start)}, ${start.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })}`;

  const endText = `${formatTime(end)}, ${end.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  })}`;

  return `${startText} – ${endText}${sameYear ? `, ${start.getFullYear()}` : ""}`;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface EventResult {
  title: string;
  start_date: string;
  end_date: string;
  cropped_picture_url: string;
  url: string;
  description_short: string;
  id: string;
}

interface Pagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
}

interface ApiResponse {
  results: EventResult[];
  pagination: Pagination;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format date as "7 May 2026" */
/** Format date in local timezone */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Format time in local timezone */
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function isFuture(iso: string): boolean {
  return new Date(iso) > new Date();
}

// ─── Single Event Card ────────────────────────────────────────────────────────

function EventCard({
  event,
  reversed = false,
}: {
  event: EventResult;
  reversed?: boolean;
}) {
  const future = isFuture(event.start_date);

  return (
    <div
      className={`group relative flex gap-4 rounded-2xl p-4 ${reversed ? "md:flex-row-reverse md:text-right" : ""
        }`}
    >
      {/* Future event: subtle Google-colors left accent bar */}
      {future && (
        <span
          className={`absolute top-4 bottom-4 w-[3px] rounded-full ${reversed ? "md:right-0" : "md:left-0"
            } left-0`}
          style={{
            background:
              "linear-gradient(180deg, #4285F4 0%, #34A853 33%, #FBBC05 66%, #EA4335 100%)",
          }}
        />
      )}

      {/* Body */}
      <div
        className={`flex flex-col gap-1 min-w-0 flex-1 ${reversed ? "md:items-end" : ""
          }`}
      >
        {/* Title */}
          <p className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm md:text-base leading-snug hover:underline line-clamp-2">
            {event.title}
          </p>

        {/* Time */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono tracking-wide">
          {formatEventRange(event.start_date, event.end_date)}
        </p>

        {/* Description */}
        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2 mt-0.5">
          {event.description_short}
        </p>

        {/* RSVP button — only for upcoming events */}
        {future && (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 self-start inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150 shadow-sm"
          >
            {/* Google "G" coloured dots accent */}
            <span className="flex gap-[2px]">
              <span className="w-[5px] h-[5px] rounded-full bg-[#4285F4]" />
              <span className="w-[5px] h-[5px] rounded-full bg-[#EA4335]" />
              <span className="w-[5px] h-[5px] rounded-full bg-[#FBBC05]" />
              <span className="w-[5px] h-[5px] rounded-full bg-[#34A853]" />
            </span>
            RSVP
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function EventCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 animate-pulse">
      <div className="w-14 h-14 rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
        <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-1/4" />
        <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-full" />
        <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-5/6" />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TenureEvents() {
  const [allEvents, setAllEvents] = useState<EventResult[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (page: number, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const res = await fetch(`/api/events?page=${page}&page_size=8&order=-start_date`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: ApiResponse = await res.json();
      setAllEvents((prev) => (append ? [...prev, ...data.results] : data.results));
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load events.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const loadMore = () => {
    if (!pagination?.has_next) return;
    const next = currentPage + 1;
    setCurrentPage(next);
    fetchPage(next, true);
  };

  // ── Build timeline data from events ──────────────────────────────────────

  const timelineData = loading
    ? // Show 4 skeleton placeholders
    Array.from({ length: 4 }).map((_, i) => ({
      title: "──────",
      content: <EventCardSkeleton key={i} />,
    }))
    : [
      ...allEvents.map((event, index) => ({
        title: formatDate(event.start_date),
        icon: event.cropped_picture_url,
        href: `/event/${event.id}`,
        content: (
          <EventCard
            key={event.url}
            event={event}
            reversed={index % 2 !== 0}
          />
        ),
      })),
      // Footer entry
    ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full pl-5" >
      {error && (
        <div className="mx-auto max-w-xl mb-6 rounded-lg border border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      <Timeline data={timelineData} />

      {/* Load More */}
      {!loading && pagination?.has_next && (
        <div className="flex justify-center mt-6 mb-10">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-5 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loadingMore ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Loading…
              </>
            ) : (
              <>
                Load more events
                <span className="text-neutral-400 dark:text-neutral-500 text-xs">
                  ({pagination.total - allEvents.length} remaining)
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}