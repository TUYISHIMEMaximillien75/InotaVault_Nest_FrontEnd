import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";

const NavBar = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const currentFilter = localStorage.getItem("filter") || "All Categories";

  const fetchCategories = async () => {
    try {
      const res = await api.get("/songs/categories");
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-6 flex items-center justify-between max-w-7xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-1 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Logo Container */}
        <Link
          to="/"
          className="flex items-center bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm rounded-2xl px-4 py-2 hover:bg-white hover:shadow-md transition-all duration-300"
        >
          <img src={logo} alt="Logo" className="h-9 w-auto" />
        </Link>

        {/* Filter Pill */}
        <div className="hidden md:flex items-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-1 shadow-sm">
          <div className="flex items-center px-3 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0114 13v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5a1 1 0 01-.293-.293L3.293 6.707A1 1 0 013 6V4z" />
            </svg>

            <select
              defaultValue={currentFilter}
              onChange={(e) => localStorage.setItem("filter", e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer pr-4 appearance-none hover:text-red-700 transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-xl transition-all active:scale-95"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            localStorage.setItem("search_bar", "on");
            window.location.reload();
          }}
          className="bg-white/80 backdrop-blur-md border border-gray-200 p-3 rounded-2xl shadow-sm hover:shadow-md hover:bg-white text-gray-600 hover:text-red-700 transition-all active:scale-90"
          title="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;