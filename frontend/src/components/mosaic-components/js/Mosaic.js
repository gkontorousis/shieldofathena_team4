import React from "react";
import MosaicFrame from "./MosaicFrame";
import "../css/base.css";
import "../css/embla.css";
import "../css/mosaic-custom.css";

const OPTIONS = {
  loop: false,
  align: "start",
  skipSnaps: false,
  dragFree: false,
};

// Define your 5 images here - All from Unsplash (free to use)
const SLIDES = [
  {
    name: "Strength & Unity",
    url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=800&fit=crop&q=80", // Women supporting each other
  },
  {
    name: "Hope & Healing",
    url: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=800&h=800&fit=crop&q=80", // Hands reaching together
  },
  {
    name: "Community Support",
    url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=800&fit=crop&q=80", // Diverse women together
  },
  {
    name: "Empowerment",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=800&fit=crop&q=80", // Strong woman portrait
  },
  {
    name: "New Beginnings",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop&q=80", // Hopeful portrait
  },
];

const Mosaic = () => (
  <>
    <MosaicFrame slides={SLIDES} options={OPTIONS} />
  </>
);

export default Mosaic;
