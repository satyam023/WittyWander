const router = require("express").Router();
const { authenticate } = require("../middleware/authMiddleware");
const {
  createPlace,
  getCityPlaces,
  likePlace,
  unlikePlace,
  reportPlace,
  deletePlace,
  getNearbyPlaces,
  getMyUploads,
} = require("../controllers/placeController");

const { upload } = require("../middleware/cloudinary");

router.get("/", getCityPlaces);
router.get("/nearby", getNearbyPlaces);
router.get("/my-uploads", authenticate, getMyUploads);
router.post("/", authenticate, upload.single("image"), createPlace);
router.put("/:id/like", authenticate, likePlace);
router.put("/:id/unlike", authenticate, unlikePlace);
router.put("/:id/report", authenticate, reportPlace);
router.delete("/:id", authenticate, deletePlace);

module.exports = router;
