"use client";

import React from "react";
import {
  Mail,
  MapPin,
  Twitter,
  Instagram,
  Github,
  Linkedin,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer
      className="bg-black text-white py-8 px-4 sm:px-6 relative overflow-hidden"
      style={{
        backgroundImage: 'url("/images/footer-bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-zinc-900/40" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Logo and Description */}
          <div className="w-full lg:w-2/3">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-shrink-0">
                  <Image
                    src="/images/colored-gdg.png"
                    alt="logo"
                    width={50}
                    height={50}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    Google Developer Groups
                  </h2>
                  <p className="text-sm text-gray-400">
                    On Campus • Maharishi Markandeshwar (Deemed to be
                    University)
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-300 max-w-xl">
                GDSC MM(DU) is a student-led community supported by Google that
                foster learning, collaboration, and innovation in technical
                areas among university students.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Reach out to us:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-gray-400 flex-shrink-0" />
                  <a
                    href="mailto:mmdu.dsc@gmail.com"
                    className="text-gray-300 hover:text-white break-all"
                  >
                    mmdu.dsc@gmail.com
                  </a>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin
                    size={16}
                    className="text-gray-400 mt-1 flex-shrink-0"
                  />
                  <p className="text-gray-300">
                    MM Education Complex,MM(DU),Mullana
                    <br />
                    (Ambala),Mullana,Haryana,
                    <br />
                    India, 133207
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="w-full lg:w-auto">
            <h3 className="text-sm font-semibold mb-4">Follow us on:</h3>
            <div className="flex flex-wrap gap-6 sm:gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Github"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
