import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl font-extrabold text-gray-900">
          InotaVault
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          InotaVault is a digital platform designed to help musicians,
          choirs, and music lovers easily <strong>share, discover, and manage
            music sheets</strong> in one secure place.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            to="/songs"
            className="px-8 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Explore Songs
          </Link>

          <Link
            to="/upload"
            className="px-8 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            Upload Your Music
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Why InotaVault?
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-800">
              📄 Music Sheets Library
            </h3>
            <p className="mt-3 text-gray-600">
              Access a growing collection of music sheets shared by musicians
              and choirs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-800">
              🎶 Audio & Video Support
            </h3>
            <p className="mt-3 text-gray-600">
              Upload and listen to audio or watch video performances linked to
              each song.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-800">
              🔒 Secure & Organized
            </h3>
            <p className="mt-3 text-gray-600">
              Your files are safely stored and well organized for easy access
              anytime.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} InotaVault. All rights reserved.
      </footer>
    </div>
  );
}
