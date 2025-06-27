import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

export default function Upload() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    title: "",
    city: "",
    type: "hidden",
    category: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`
        );
        const data = await res.json();
        const address = data.address;
        const detectedCity =
          address.city ||
          address.town ||
          address.village ||
          address.county ||
          address.state ||
          "Unknown";

        setForm((prev) => ({ ...prev, city: detectedCity }));
      } catch (err) {
        console.error("Reverse geocode error:", err);
      }
    });
  };

  const fetchLatLngFromCity = async (city) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          city
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } catch (err) {
      console.error("Geolocation fetch failed:", err);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    const { title, city, category, description, type } = form;

    if (!title || !city || !category || !description || !imageFile) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      setIsSubmitting(false);
      return;
    }

    const coords = await fetchLatLngFromCity(city);
    if (!coords) {
      setMessage({ type: "error", text: "City not found." });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("city", city);
    formData.append("type", type);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("image", imageFile);
    formData.append("lat", coords.lat);
    formData.append("lng", coords.lng);

    try {
      const res = await API.post("/places", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201 || res.status === 200) {
        setMessage({ type: "success", text: "Place uploaded!" });
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage({ type: "error", text: "Upload failed. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Upload New Place
        </h2>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            type="text"
            placeholder="Place title"
            className="w-full border p-2 rounded"
          />
          <div className="flex gap-2 items-center">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              type="text"
              placeholder="City"
              className="w-full border p-2 rounded"
            />
            <button
              type="button"
              onClick={detectLocation}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
            >
              Use My Location
            </button>
          </div>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="hidden">Hidden Gem</option>
            <option value="best">Must-Visit Spot</option>
          </select>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            type="text"
            placeholder="Category (e.g. food, hotel)"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded h-24"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-2 rounded font-semibold ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Uploading..." : "Upload Place"}
          </button>
        </form>
      </div>
    </div>
  );
}
