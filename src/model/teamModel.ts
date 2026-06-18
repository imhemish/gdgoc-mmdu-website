import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  batch: {
    type: String,
    enum: ["2022-2026", "2023-2027", "2024-2028"],
    required: true,
  },
  image: { type: String, required: true },
  quote: {
    type: String,
    required: true,
  },
});

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

export default Team;
