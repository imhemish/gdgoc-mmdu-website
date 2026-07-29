import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { IconBrandLinkedin, IconBrandTwitter, IconMapPin, IconUsers, IconVideo, IconX, IconChevronLeft, IconChevronRight, IconCalendar, IconExternalLink } from "@tabler/icons-react";
import type {
  GDGEvent,
  EventPerson,
  EventPartnerSponsor,
  EventWrapupPhoto,
} from "@/types/event";

// ─── Helpers ────────────────────────────────────────────────────────────────

function toIST(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const sameDay =
    s.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }) ===
    e.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });

  const dateOpts: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const timeOpts: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  if (sameDay) {
    return `${s.toLocaleDateString("en-IN", dateOpts)}, ${s.toLocaleTimeString(
      "en-IN",
      timeOpts
    )} – ${e.toLocaleTimeString("en-IN", timeOpts)} IST`;
  }
  return `${s.toLocaleDateString("en-IN", dateOpts)}, ${s.toLocaleTimeString(
    "en-IN",
    timeOpts
  )} – ${e.toLocaleDateString("en-IN", dateOpts)}, ${e.toLocaleTimeString(
    "en-IN",
    timeOpts
  )} IST`;
}

function getCTALabel(event: GDGEvent, now: Date): string {
  const start = new Date(event.start_date);
  const end = new Date(event.end_date);

  if (now > end) return "View on Event Page";
  if (now >= start && now <= end) {
    if (event.audience_type === "VIRTUAL") return "Join Now";
    return "Register";
  }
  return "Register";
}

function audienceBadge(type: string) {
  const map: Record<string, { label: string; color: string }> = {
    VIRTUAL: { label: "Virtual", color: "#4285F4" },
    IN_PERSON: { label: "In Person", color: "#34A853" },
    HYBRID: { label: "Hybrid", color: "#FBBC05" },
  };
  return map[type] ?? { label: type, color: "#9AA0A6" };
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function PersonCard({ person }: { person: EventPerson }) {
  return (
    <div className="person-card">
      <div className="person-avatar">
        {person.picture?.thumbnail_url ? (
          <img
            src={person.picture.thumbnail_url}
            alt={`${person.first_name} ${person.last_name}`}
          />
        ) : (
          <div className="person-avatar-fallback">
            {person.first_name[0]}
            {person.last_name[0]}
          </div>
        )}
      </div>
      <div className="person-info">
        <h4 className="person-name">
          {person.first_name} {person.last_name}
        </h4>
        {person.title && <p className="person-title">{person.title}</p>}
        {person.company && <p className="person-company">{person.company}</p>}
        {person.bio && <p className="person-bio">{person.bio}</p>}
        <div className="person-links">
          {person.personal_linkedin_page && (
            <a
              href={person.personal_linkedin_page}
              target="_blank"
              rel="noopener noreferrer"
              className="person-link"
            >
              <IconBrandLinkedin size={15} />
              LinkedIn
            </a>
          )}
          {person.personal_twitter && (
            <a
              href={`https://twitter.com/${person.personal_twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="person-link"
            >
              <IconBrandTwitter size={15} />@{person.personal_twitter}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SponsorCard({ item }: { item: EventPartnerSponsor }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="sponsor-card"
    >
      {item.logo?.url && (
        <img src={item.logo.url} alt={item.name} className="sponsor-logo" />
      )}
      <span className="sponsor-name">{item.name}</span>
    </a>
  );
}

function PhotoGallery({ photos }: { photos: EventWrapupPhoto[] }) {
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
        <div
          className="lightbox-backdrop"
          onClick={() => setOpen(false)}
        >
          <button
            className="lightbox-close"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <IconX size={22} />
          </button>

          <button
            className="lightbox-nav lightbox-prev"
            onClick={prev}
            aria-label="Previous"
          >
            <IconChevronLeft size={28} />
          </button>

          <div
            className="lightbox-img-wrap"
            onClick={(e) => e.stopPropagation()}
          >
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

          <button
            className="lightbox-nav lightbox-next"
            onClick={next}
            aria-label="Next"
          >
            <IconChevronRight size={28} />
          </button>
        </div>
      )}
    </>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-heading">
      <h2>{children}</h2>
      <div className="section-rule" />
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function EventPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<GDGEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/event/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setEvent)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="page-state">
        <div className="spinner" />
        <p>Loading event…</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page-state">
        <p className="error-text">Event not found.</p>
      </div>
    );
  }

  const badge = audienceBadge(event.audience_type);
  const ctaLabel = getCTALabel(event, now);
  const isLive =
    now >= new Date(event.start_date) && now <= new Date(event.end_date);
  const isPast = now > new Date(event.end_date);

  const peopleSections: { label: string; people: EventPerson[] }[] = [
    { label: "Speakers", people: event.speakers },
    { label: "Hosts", people: event.hosts },
    { label: "Facilitators", people: event.facilitators },
    { label: "Moderators", people: event.moderators },
    { label: "Panelists", people: event.panelists },
    { label: "Mentors", people: event.mentors },
    { label: "Judges", people: event.judges },
  ].filter((s) => s.people?.length);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .event-page {
          min-height: 100vh;
          background: linear-gradient(160deg, #0a0a0a 0%, #111 40%, #1a1a1a 70%, #373737 100%);
          color: #e8e8e8;
          font-family: 'Inter', system-ui, sans-serif;
          padding-bottom: 80px;
        }

        /* ── Hero ── */
.hero {
  position: relative;
  width: 100%;
  max-height: 480px;
  overflow: hidden;
}

.hero-img {
  width: 100%;
  height: 480px;
  object-fit: cover;
  display: block;
  opacity: 0.55;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 20%, #0a0a0a 100%);
}

@media (max-width: 768px) {
  .hero {
    width: calc(100% - 32px);
    margin: 0 auto;
    padding-top: 16px;
    border-radius: 16px;
    overflow: hidden;
    max-height: none;
    height: auto;
  }

  .hero-img {
    display: block;
    width: 100%;
    height: auto;
    opacity: 0.85;
    border-radius: 16px;
  }

  .hero-overlay {
    inset: auto 0 0 0;   /* only cover the bottom */
    height: 40%;
    background: linear-gradient(
      to bottom,
      transparent,
      #0a0a0a
    );
  }
}
        /* ── Container ── */
        .container {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Meta strip ── */
        .meta-strip {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 36px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: 1px solid;
          opacity: 0.92;
        }
        .badge-live {
          background: rgba(234,67,53,0.18);
          border-color: #EA4335;
          color: #ff7b74;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.92; }
          50% { opacity: 0.6; }
        }

        .event-title {
          font-size: clamp(1.8rem, 5vw, 3rem);
          font-weight: 800;
          line-height: 1.15;
          background: linear-gradient(100deg, #f0f0f0 30%, #888 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-top: 16px;
          letter-spacing: -0.02em;
        }

        /* ── Info row ── */
        .info-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 20px;
          padding: 18px 22px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: #bbb;
        }
        .info-item svg { flex-shrink: 0; color: #888; }
        .info-item strong { color: #e0e0e0; font-weight: 500; }

        /* ── CTA ── */
        .cta-wrap {
          margin-top: 28px;
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 30px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-decoration: none;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        .cta-btn-primary {
          background: linear-gradient(135deg, #4285F4, #0d47a1);
          color: #fff;
          box-shadow: 0 0 24px rgba(66,133,244,0.35);
        }
        .cta-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 32px rgba(66,133,244,0.5);
        }
        .cta-btn-secondary {
          background: rgba(255,255,255,0.07);
          color: #ccc;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .cta-btn-secondary:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }
        .cta-btn-live {
          background: linear-gradient(135deg, #EA4335, #b71c1c);
          color: #fff;
          box-shadow: 0 0 24px rgba(234,67,53,0.4);
        }
        .cta-btn-live:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 32px rgba(234,67,53,0.55);
        }

        /* ── Description ── */
        .description-block {
          margin-top: 44px;
          font-size: 15px;
          line-height: 1.8;
          color: #c0c0c0;
          white-space: pre-line;
          text-align: justify;
        }

        .description-block a {
          color: #4285F4; /* Google Blue */
          text-decoration: underline;
        }

        .description-block a:hover {
          color: #6ea8ff;
        }

        /* ── Sections ── */
        .section {
          margin-top: 52px;
        }
        .section-heading {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .section-heading h2 {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #888;
          white-space: nowrap;
        }
        .section-rule {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        /* ── People ── */
        .people-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .person-card {
          display: flex;
          gap: 14px;
          padding: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          transition: border-color 0.2s, background 0.2s;
        }
        .person-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.15);
        }
        .person-avatar {
          flex-shrink: 0;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          overflow: hidden;
          background: rgba(255,255,255,0.08);
        }
        .person-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .person-avatar-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          color: #888;
        }
        .person-info { flex: 1; min-width: 0; }
        .person-name {
          font-size: 14px;
          font-weight: 700;
          color: #e8e8e8;
          line-height: 1.3;
        }
        .person-title {
          font-size: 12px;
          color: #9AA0A6;
          margin-top: 2px;
        }
        .person-company {
          font-size: 12px;
          color: #4285F4;
          margin-top: 1px;
        }
        .person-bio {
          font-size: 12px;
          color: #888;
          margin-top: 6px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .person-links {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .person-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #888;
          text-decoration: none;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.15s;
        }
        .person-link:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.06);
        }

        /* ── Gallery ── */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 8px;
        }
        .gallery-thumb {
          aspect-ratio: 1;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          padding: 0;
          position: relative;
          background: rgba(255,255,255,0.04);
          transition: transform 0.15s, border-color 0.15s;
        }
        .gallery-thumb:hover { transform: scale(1.03); border-color: rgba(255,255,255,0.25); }
        .gallery-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .gallery-thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.2);
          opacity: 0;
          transition: opacity 0.15s;
        }
        .gallery-thumb:hover .gallery-thumb-overlay { opacity: 1; }

        /* ── Lightbox ───────────────────────────────────────────────────────── */

.lightbox-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(6px);
}

.lightbox-img-wrap {
  position: relative;

  width: min(92vw, 1000px);
  height: min(84vh, 850px);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 12px;
  padding: 12px;
}

.lightbox-spinner {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 2;
  pointer-events: none;
}

.lightbox-img {
  max-width: 100%;
  max-height: calc(100% - 30px);

  object-fit: contain;

  border-radius: 10px;
  box-shadow: 0 18px 64px rgba(0, 0, 0, 0.7);

  user-select: none;
  -webkit-user-drag: none;
}

.lightbox-counter {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);

  user-select: none;
}

.lightbox-close {
  position: fixed;
  top: 20px;
  right: 20px;

  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.08);
  color: #fff;

  cursor: pointer;
  transition: background .18s, transform .18s;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: scale(1.06);
}

.lightbox-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);

  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.08);
  color: #fff;

  cursor: pointer;
  z-index: 10000;

  transition:
    background .18s,
    transform .18s;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-50%) scale(1.08);
}

.lightbox-nav:active {
  transform: translateY(-50%) scale(0.96);
}

.lightbox-prev {
  left: 24px;
}

.lightbox-next {
  right: 24px;
}

@media (max-width: 768px) {
  .lightbox-img-wrap {
    width: 96vw;
    height: 80vh;
    padding: 8px;
  }

  .lightbox-nav {
    width: 44px;
    height: 44px;
  }

  .lightbox-prev {
    left: 8px;
  }

  .lightbox-next {
    right: 8px;
  }

  .lightbox-close {
    top: 12px;
    right: 12px;
  }
}

        /* ── Sponsors ── */
        .sponsor-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .sponsor-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 14px 20px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
          transition: all 0.2s;
          min-width: 110px;
        }
        .sponsor-card:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .sponsor-logo {
          height: 40px;
          max-width: 100px;
          object-fit: contain;
          filter: brightness(0.85) invert(0);
        }
        .sponsor-name {
          font-size: 12px;
          color: #888;
          text-align: center;
        }

        /* ── Venue ── */
        .venue-block {
          padding: 20px 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .venue-block svg { flex-shrink: 0; color: #EA4335; margin-top: 2px; }
        .venue-name { font-size: 15px; font-weight: 600; color: #e0e0e0; }
        .venue-address { font-size: 13px; color: #888; margin-top: 4px; line-height: 1.5; }

        /* ── Video ── */
        .video-wrap {
          border-radius: 14px;
          overflow: hidden;
          aspect-ratio: 16/9;
          background: #000;
        }
        .video-wrap iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* ── Loading / error ── */
        .page-state {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: #666;
          background: #0a0a0a;
        }
        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #4285F4;
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .error-text { color: #888; }

        @media (max-width: 600px) {
          .people-grid { grid-template-columns: 1fr; }
          .lightbox-prev { left: 6px; }
          .lightbox-next { right: 6px; }
          .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); }
        }
      `}</style>

      <div className="event-page">
        {/* Hero banner */}
        {(event.cropped_banner_url || event.cropped_picture_url) && (
          <div className="hero">
            <img
              src={event.cropped_banner_url || event.cropped_picture_url}
              alt={event.title}
              className="hero-img"
            />
            <div className="hero-overlay" />
          </div>
        )}

        <div className="container">
          {/* Meta badges */}
          <div className="meta-strip">
            <span
              className="badge"
              style={{
                backgroundColor: badge.color + "22",
                borderColor: badge.color + "66",
                color: badge.color,
              }}
            >
              {event.audience_type === "VIRTUAL" ? (
                <IconVideo size={12} />
              ) : (
                <IconMapPin size={12} />
              )}
              {badge.label}
            </span>
            {isLive && (
              <span className="badge badge-live">
                ● Live now
              </span>
            )}
            {isPast && (
              <span
                className="badge"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.1)",
                  color: "#666",
                }}
              >
                Past event
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="event-title">{event.title}</h1>

          {/* Info row */}
          <div className="info-row">
            <div className="info-item">
              <IconCalendar size={16} />
              <span>
                <strong>{formatDateRange(event.start_date, event.end_date)}</strong>
              </span>
            </div>
            {event.total_attendees > 0 && (
              <div className="info-item">
                <IconUsers size={16} />
                <span>
                  <strong>{event.total_attendees.toLocaleString()}</strong> attendees
                </span>
              </div>
            )}
            {event.venue_name && (
              <div className="info-item">
                <IconMapPin size={16} />
                <span>{event.venue_name}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="cta-wrap">
            <a
              href={event.static_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`cta-btn ${isPast
                ? "cta-btn-secondary"
                : isLive && event.audience_type === "VIRTUAL"
                  ? "cta-btn-live"
                  : "cta-btn-primary"
                }`}
            >
              {ctaLabel}
              <IconExternalLink size={15} />
            </a>
          </div>

          {/* Description */}
          {event.description && (
            <div className="section">
              <SectionHeading>About this event</SectionHeading>
              <p className="description-block"
                dangerouslySetInnerHTML={{ __html: event.description }}
              ></p>
            </div>
          )}

          {/* Venue details */}
          {event.venue_name && event.audience_type !== "VIRTUAL" && (
            <div className="section">
              <SectionHeading>Venue</SectionHeading>
              <div className="venue-block">
                <IconMapPin size={20} />
                <div>
                  <p className="venue-name">{event.venue_name}</p>
                  <p className="venue-address">
                    {[
                      event.venue_address,
                      event.venue_city,
                      event.venue_state,
                      event.venue_zip_code,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* People sections */}
          {peopleSections.map(({ label, people }) => (
            <div key={label} className="section">
              <SectionHeading>{label}</SectionHeading>
              <div className="people-grid">
                {people.map((p) => (
                  <PersonCard key={p.event_person_id} person={p} />
                ))}
              </div>
            </div>
          ))}

          {/* Gallery */}
          {event.event_wrapup_photos?.length > 0 && (
            <div className="section">
              <SectionHeading>
                Photos ({event.event_wrapup_photos.length})
              </SectionHeading>
              <PhotoGallery photos={event.event_wrapup_photos} />
            </div>
          )}

          {/* Video recording */}
          {event.video_url && (
            <div className="section">
              <SectionHeading>Featured Video</SectionHeading>
              <div className="video-wrap">
                <iframe
                  src={event.video_url.replace("watch?v=", "embed/")}
                  allowFullScreen
                  title="Event recording"
                />
              </div>
            </div>
          )}

          {/* Sponsors */}
          {event.sponsors?.length ? (
            <div className="section">
              <SectionHeading>Sponsors</SectionHeading>
              <div className="sponsor-grid">
                {event.sponsors.map((s) => (
                  <SponsorCard key={s.id} item={s} />
                ))}
              </div>
            </div>
          ) : null}

          {/* Partners */}
          {event.partners?.length ? (
            <div className="section">
              <SectionHeading>Partners</SectionHeading>
              <div className="sponsor-grid">
                {event.partners.map((p) => (
                  <SponsorCard key={p.id} item={p} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}