import RounderBorderEvents from "@/components/events/RounderBorderEvents";
import { TenureEvents } from "@/components/events/TenureEvents";
import React from "react";

const Events = () => {
  return (
    <div style={{ backgroundColor: "#fef2f2" }}>
      <TenureEvents />
      <RounderBorderEvents />
    </div>
  );
};

export default Events;
