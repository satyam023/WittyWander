import { Link } from "react-router-dom";
import {
  FaCompass,
  FaMapMarkerAlt,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover <span className="text-indigo-600">Hidden Gems</span> 🌎
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join a community of explorers sharing the world's best kept
              secrets. Find authentic experiences beyond the tourist trails.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg"
              >
                Start Exploring <FaArrowRight />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 transition transform hover:scale-105"
              >
                I Have an Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Explore With Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-xl text-center">
              <div className="flex justify-center mb-4">
                <FaCompass className="text-4xl text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Curated Discoveries</h3>
              <p className="text-gray-600">
                Handpicked locations from experienced travelers who know the
                area best.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-xl text-center">
              <div className="flex justify-center mb-4">
                <FaMapMarkerAlt className="text-4xl text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Off-the-Beaten-Path</h3>
              <p className="text-gray-600">
                Find spots most tourists miss but locals love.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-xl text-center">
              <div className="flex justify-center mb-4">
                <FaUsers className="text-4xl text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trusted Community</h3>
              <p className="text-gray-600">
                Connect with fellow explorers who share your passion for
                adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of explorers discovering the world's best hidden
            gems.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg"
          >
            Get Started Now <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
