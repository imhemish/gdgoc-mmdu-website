import React from "react";

const RounderBorderAbout = () => {
  return (
    <div className="bg-white flex flex-col sm:flex-row justify-between">
      {/* Left Border */}
      <div className="bg-zinc-900/95 w-10 h-32 sm:h-72 rounded-t-full p-2 -ml-5 hidden sm:block"></div>

      {/* Content Section */}
      <div className="flex flex-col items-center justify-center w-full sm:h-72 bg-zinc-900/95">
        <div className="pt-6 sm:pt-10 h-full bg-white flex flex-col justify-between items-center rounded-b-3xl pb-6 sm:pb-10 mb-6 sm:mb-10 w-full sm:w-auto">
          <p className="px-5 sm:px-40 text-sm sm:text-xl font-semibold text-center">
            In short, it's a community of developers who are interested in
            Google's developer technologies from the Android, Chrome, Drive, and
            Google Cloud platforms to product APIs like the Cast API, Maps API,
            YouTube API, and many more.
          </p>
          <p className="text-xs sm:text-lg px-5 sm:px-20 text-center">
            GDG On Campus MM(DU) is a student-led community supported by Google
            that fosters learning, collaboration, and innovation in technical
            areas among university students.
          </p>
        </div>
      </div>

      {/* Right Border */}
      <div className="bg-zinc-900/95 w-10 h-32 sm:h-72 rounded-t-full p-2 -mr-5 hidden sm:block"></div>
    </div>
  );
};

export default RounderBorderAbout;
