import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaHeart, FaRegHeart, FaFlag, FaTrashAlt } from "react-icons/fa";
import API from "../utils/axios";
import toast from "react-hot-toast";

export default function PlaceCard({ place, onPlaceDeleted }) {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(place.likes.length);
  const [reporting, setReporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (user) {
      setLiked(place.likes.includes(user.userId));
      setHasReported(place.reports.includes(user.userId));
    }
  }, [user, place.likes, place.reports]);

  const handleLike = async () => {
    const wasLiked = liked;
    const endpoint = wasLiked ? "unlike" : "like";

    try {
      const res = await API.put(`/places/${place._id}/${endpoint}`);
      const updatedLikes = res.data.likes;
      const userLiked = updatedLikes.includes(user.userId);

      setLiked(userLiked);
      setLikeCount(updatedLikes.length);

      toast.success(userLiked ? "Liked!" : "Like removed");
    } catch (err) {
      console.error("Like/Unlike Error:", err);
      toast.error("Failed to update like.");
    }
  };

  const handleReport = async () => {
    try {
      const res = await API.put(`/places/${place._id}/report`);
      toast.success(res.data.message || `Reported (${res.data.reports})`);
      setHasReported(true);
    } catch (err) {
      console.error("Report Error:", err);
      toast.error("Failed to report place.");
    } finally {
      setReporting(false);
      setShowReportConfirm(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/places/${place._id}`);
      toast.success("Place deleted successfully.");
      if (onPlaceDeleted) onPlaceDeleted(place._id);
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to delete place.");
    } finally {
      setDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 relative overflow-hidden">
      <div className="overflow-hidden">
        <img
          src={place.image}
          alt={place.title}
          className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          {place.title}
        </h2>
        <p className="text-sm text-blue-500 font-medium mb-2">{place.city}</p>
        <p className="text-sm text-gray-600">
          {place.description?.length > 120
            ? `${place.description.slice(0, 120)}...`
            : place.description}
        </p>

        <div className="flex items-center justify-between mt-5">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition ${
              liked
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            {likeCount}
          </button>

          <button
            onClick={() => setShowReportConfirm(true)}
            disabled={reporting || hasReported}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              hasReported
                ? "bg-yellow-200 text-yellow-800"
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            } transition`}
          >
            <FaFlag />
            {hasReported ? "Reported" : "Report"}
          </button>

          {user?.userId === (place.postedBy?._id || place.postedBy) && (
            <button
              onClick={() => setShowConfirmDialog(true)}
              disabled={deleting}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200 transition"
            >
              <FaTrashAlt />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this place?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportConfirm && !hasReported && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Report Place
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Reporting is irreversible and flags the content as inappropriate.
              Are you sure you want to report this place?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowReportConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                {reporting ? "Reporting..." : "Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
