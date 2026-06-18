"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const GlobeComponent = dynamic(() => import("react-globe.gl"), { ssr: false });

const Globe = () => {
  const [rise, setRise] = useState(true);

  useEffect(() => {
    setTimeout(() => setRise(false), 6000);
  }, []);

  const N_PATHS = 10;
  const MAX_POINTS_PER_LINE = 10000;
  const MAX_STEP_DEG = 1;
  const MAX_STEP_ALT = 0.015;
  const gData = useMemo(
    () =>
      [...Array(N_PATHS).keys()].map(() => {
        let lat = (Math.random() - 0.5) * 90;
        let lng = (Math.random() - 0.5) * 360;
        let alt = 0;

        return [
          [lat, lng, alt],
          ...[
            ...Array(Math.round(Math.random() * MAX_POINTS_PER_LINE)).keys(),
          ].map(() => {
            lat += (Math.random() * 2 - 1) * MAX_STEP_DEG;
            lng += (Math.random() * 2 - 1) * MAX_STEP_DEG;
            alt += (Math.random() * 2 - 1) * MAX_STEP_ALT;
            alt = Math.max(0, alt);

            return [lat, lng, alt];
          }),
        ];
      }),
    []
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-between h-screen px-6 md:px-20 lg:px-80 space-y-10 md:space-y-0 bg-gradient-to-b from-white to-white">
      {/* Left Section */}
      <div className=" max-w-lg mt-10 md:mt-0">
        <Image
          src="/images/gdg-on-campus-bw.png"
          alt="GDG Logo"
          width={400}
          height={500}
        />
        <p className="text-sm md:text-lg max-w-lg px-12 text-gray-600 leading-relaxed">
          <span className="font-semibold">
            Google Developer Groups on Campus
          </span>{" "}
          Maharishi Markandeshwar (Deemed to be University) - Mullana (GDG on
          Campus MM(DU)) is a young community of developers with the motive{" "}
          <span className="font-medium">
            by the developers, for the developers, and from developers.
          </span>
        </p>
      </div>

      {/* Right Section - Globe */}
      <div className="md:w-1/2 w-full flex justify-center items-center ">
        <div className="w-auto md:w-96">
          <GlobeComponent
            width={500}
            height={500}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            pathsData={gData}
            pathColor={() => ["rgba(255,255,255,0.6)", "rgba(255,0,0,0.6)"]}
            pathDashLength={0.01}
            pathDashGap={0.004}
            pathDashAnimateTime={100000}
            pathPointAlt={rise ? (pnt) => pnt[2] : undefined}
            pathTransitionDuration={rise ? 4000 : undefined}
            backgroundColor="#ffffff"
          />
        </div>
      </div>
    </div>
  );
};

export default Globe;
