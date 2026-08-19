"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";

const HIRING_FORM_PATH = "/hiring"; // adjust to wherever your hiring form page lives

interface HiringPopupProps {
  /** Whether hiring is currently active. Pass this from a Server Component
   *  that reads process.env.NEXT_PUBLIC_HIRING_ACTIVE */
  active: boolean;
}

const HiringPopup = ({ active }: HiringPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    if (!isOpen) return;

    // Lock background scroll while the popup is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!active || !isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
      onMouseDown={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hiring-popup-title"
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-md bg-neutral-900/95 backdrop-blur-lg border border-gray-800/50 shadow-2xl rounded-3xl p-8 sm:p-10"
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors rounded-full p-1.5 hover:bg-neutral-800/70"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-5">
          <Sparkles size={22} className="text-blue-400" />
        </div>

        <h2
          id="hiring-popup-title"
          className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 mb-3"
        >
          We're Hiring
        </h2>
        <p className="text-gray-400 mb-8">
          We're looking for new members to join the club. If you're
          interested in building, designing, or organizing with us, we'd love
          to hear from you.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={HIRING_FORM_PATH}
            onClick={() => setIsOpen(false)}
            className="flex-1 text-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300"
          >
            Apply Now
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 px-6 py-3 rounded-full border border-gray-700/50 text-gray-300 hover:bg-neutral-800/50 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default HiringPopup;