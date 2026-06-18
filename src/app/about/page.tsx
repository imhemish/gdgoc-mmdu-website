import React from "react";
import FluidAnimation from "@/components/custom/FluidAnimation";
import { TeamCarousel } from "@/components/custom/TeamCarousel";
import Globe from "@/components/custom/Globe";
import RounderBorderAbout from "@/components/custom/RounderBorderWapper";

const About = () => {
  return (
    <div className="w-full justify-center bg-gradient-to-b from-[#0a0a0a] to-[#373737] overflow-hidden">
      {/* Faculty Advisor Section */}
      <div className="flex w-full mx-auto max-w-4xl justify-between items-center gap-6 p-6 flex-col md:flex-row">
        {/* Left */}
        <FluidAnimation path={"/images/vishalsir.jpeg"} />
        {/* Right */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 mb-3">
            Dr. Vishal Gupta
          </h1>
          <p className="text-white text-sm md:text-base mt-2">
            Faculty Advisor
          </p>
        </div>
      </div>

      {/* GDG Lead Section */}
      <div className="flex w-full mx-auto max-w-4xl justify-between items-center gap-6 p-6 flex-col-reverse md:flex-row">
        {/* Left */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 mb-3">
            Mr. Parag Sharma
          </h1>
          <p className="text-white text-sm md:text-base mt-2">
            GDGoC Organizer
          </p>
        </div>
        {/* Right */}
        <FluidAnimation path={"/images/parag.jpeg"} />
      </div>

      {/* Team Carousel */}
      <div className="p-16">
        <TeamCarousel />
      </div>
      {/* <GlobeDemo /> */}
      <Globe />
      {/* description */}
      <RounderBorderAbout />
    </div>
  );
};

export default About;
