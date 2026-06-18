import React from "react";
import { VelocityScroll } from "../ui/scroll-based-velocity";
const images = [
  "/images/gdg-allies/1.png",
  "/images/gdg-allies/2.png",
  "/images/gdg-allies/3.png",
];

function ScrollBasedVelocityDemo() {
  return (
    <VelocityScroll
      images={images}
      default_velocity={1}
      imageWidth={300} // Adjust as needed
      imageHeight={200} // Adjust as needed
    />
  );
}

const CommunityAllies = () => {
  return (
    <div className="">
      <div className="font-semibold text-center text-4xl m-10 ">
        Community Allies
      </div>
      <ScrollBasedVelocityDemo />
    </div>
  );
};

export default CommunityAllies;
