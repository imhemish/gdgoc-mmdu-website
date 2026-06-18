import Image from "next/image";
import React from "react";

const FluidAnimation = ({ path }: any) => {
  return (
    <div className="w-[200px] md:w-[300px] items-center  py-3 px-1 sm:px-6 lg:px-8 justify-between animate-fluid-morph">
      {/* Left - Image Container */}
      <div className="">
        <Image
          width={300}
          height={300}
          src={path}
          alt="about"
          className=" rounded-full "
        />
      </div>

      {/* Right - Text Container */}
    </div>
  );
};

export default FluidAnimation;
