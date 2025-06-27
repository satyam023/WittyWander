const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  title: String,
  city: String,
  type: { type: String, enum: ["hidden", "best"] },
  category: String,
  description: String,
  image: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isBanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
placeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Place", placeSchema);
