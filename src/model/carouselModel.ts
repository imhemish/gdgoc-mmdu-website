import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    image: { type: String, required: true },
    black: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Carousel =
  mongoose.models.Carousel || mongoose.model("Carousel", carouselSchema);
export default Carousel;
