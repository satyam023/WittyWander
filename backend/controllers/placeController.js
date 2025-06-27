const Place = require("../models/Place");
const mongoose = require("mongoose");

exports.createPlace = async (req, res) => {
  try {
    const { title, city, type, category, description, lat, lng } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const imageUrl = req.file.path;

    const place = await Place.create({
      title,
      city,
      type,
      category,
      description,
      image: imageUrl,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      postedBy: req.user.userId,
    });

    res.status(201).json(place);
  } catch (err) {
    console.error("Create Place Error:", err);
    res.status(500).json({ error: "Could not create place" });
  }
};

exports.getCityPlaces = async (req, res) => {
  const { city, type } = req.query;
  try {
    const query = { isBanned: false };
    if (city) query.city = { $regex: city, $options: "i" };
    if (type) query.type = type;

    const places = await Place.find(query)
      .sort({ likes: -1 })
      .populate("postedBy", "username");

    res.json(places);
  } catch (err) {
    console.error("Fetch Places Error:", err);
    res.status(500).json({ error: "Failed to fetch places" });
  }
};

exports.getNearbyPlaces = async (req, res) => {
  const { lat, lng, radius = 5000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  try {
    const places = await Place.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radius),
        },
      },
      isBanned: false,
    }).populate("postedBy", "username");

    res.json(places);
  } catch (err) {
    console.error("Nearby Places Error:", err);
    res.status(500).json({ error: "Failed to fetch nearby places" });
  }
};

exports.getMyUploads = async (req, res) => {
  try {
    const places = await Place.find({ postedBy: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(places);
  } catch (err) {
    console.error("Get My Uploads Error:", err);
    res.status(500).json({ error: "Failed to fetch your uploads." });
  }
};

exports.likePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place.likes.includes(req.user.userId)) {
      place.likes.push(req.user.userId);
      await place.save();
    }
    res.json({ likes: place.likes });
  } catch (err) {
    console.error("Like Error:", err);
    res.status(500).json({ error: "Failed to like place" });
  }
};

exports.unlikePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    place.likes = place.likes.filter(
      (userId) => userId.toString() !== req.user.userId
    );

    await place.save();
    res.json({ likes: place.likes });
  } catch (err) {
    console.error("Unlike Error:", err);
    res.status(500).json({ error: "Failed to unlike place" });
  }
};

exports.reportPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: "Place not found" });

    place.reports = place.reports.filter((id) => id !== null);

    const alreadyReported = place.reports.some(
      (userId) => userId && userId.toString() === req.user.userId
    );

    if (!alreadyReported) {
      place.reports.push(req.user.userId);

      if (place.reports.length >= 5) {
        place.isBanned = true;
        await Place.findByIdAndDelete(req.params.id);
        return res.status(200).json({
          message: "Place automatically deleted due to multiple reports",
        });
      }

      await place.save();
    }

    return res.status(200).json({
      message: alreadyReported
        ? "You already reported this place."
        : "Reported successfully.",
      reports: place.reports.length,
    });
  } catch (err) {
    console.error("Report Error:", err);
    return res.status(500).json({ error: "Failed to report place." });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const placeId = req.params?.id;

    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return res.status(400).json({ error: "Invalid place ID" });
    }

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    const placeOwnerId = place.postedBy?.toString();
    const currentUserId = req.user?.userId;

    if (!placeOwnerId) {
      console.warn(`Place ${placeId} has no postedBy field.`);
    }

    if (placeOwnerId !== currentUserId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this place." });
    }

    await Place.deleteOne({ _id: placeId });
    res.status(200).json({ message: "Place deleted successfully." });
  } catch (err) {
    console.error("Delete Place Error:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the place." });
  }
};
