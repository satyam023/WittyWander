import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout({ onLogout }) {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/");
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDialog(false);
                  handleLogout();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
