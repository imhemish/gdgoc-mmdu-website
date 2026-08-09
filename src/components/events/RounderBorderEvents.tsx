import React from "react";

const RounderBorderEvents = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between overflow-hidden">
      {/* Left Border */}
      <div className="bg-zinc-900/95 w-10 h-32 sm:h-72 rounded-t-full -ml-5 hidden sm:block"></div>

      {/* Content Section */}
      <div className="flex flex-col items-center justify-center w-full sm:h-72 bg-zinc-900/95">
        <div className="pt-6 sm:pt-10 h-full bg-[#fef2f2] flex flex-col justify-between items-center rounded-b-3xl pb-6 sm:pb-10 mb-6 sm:mb-10 w-full sm:w-auto">
          <p className="px-5 sm:px-40 text-sm sm:text-xl  text-center mb-10">
            GDG On Campus {process.env.NEXT_PUBLIC_INST_NAME_SHORT} is a student-led community supported by Google
            that fosters learning, collaboration, and innovation in technical
            areas among university students.
          </p>
        </div>
      </div>

      {/* Right Border */}
      <div className="bg-zinc-900/95 w-10 h-32 sm:h-72 rounded-t-full -mr-5 hidden sm:block"></div>
    </div>
  );
};

export default RounderBorderEvents;
