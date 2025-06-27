import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import PlaceCard from "../components/PlaceCard";
import API from "../utils/axios";
import { FaUpload, FaSadTear, FaUserLock } from "react-icons/fa";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      API.get(`/places/my-uploads`)
        .then((res) => {
          setMyPosts(res.data);
          setError(null);
        })
        .catch((err) => {
          console.log(err);
          setError("Failed to fetch your places. Please try again later.");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage your uploaded places and activities
            </p>
          </div>
          <Link
            to="/upload"
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FaUpload />
            Upload New Place
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <PulseLoader color="#3B82F6" size={15} />
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : myPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myPosts.map((place) => (
              <PlaceCard key={place._id} place={place} showActions={true} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaSadTear className="text-5xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No Places Uploaded Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't uploaded any places yet. Get started by uploading your
              first place!
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaUpload />
              Upload Your First Place
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
