import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";

const NavBar = () => {
  const [categories, setCategories] = useState<string[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/songs/categories");
      setCategories(res.data.categories); // ✅ correct
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    localStorage.setItem("filter", newFilter);
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-4">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center bg-gray-50 shadow-xl rounded-lg px-4 py-2 hover:shadow-2xl transition-all duration-300"
      >
        <img src={logo} alt="Logo" className="h-12 w-auto mr-2" />
      </Link>

      {/* Filter */}
      <div className="flex gap-2 items-center bg-gray-50 border border-red-950/25 rounded-lg px-4 py-2 shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-950"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0114 13v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5a1 1 0 01-.293-.293L3.293 6.707A1 1 0 013 6V4z"
          />
        </svg>

        <select
          onChange={(e) => {
            const newfilter = e.target.value;
            localStorage.setItem("filter", newfilter);
            
           }}
          className="text-red-950 focus:outline-none bg-transparent"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
                // window.location.reload();
          }}
          className="bg-red-600/75 py-2 px-4 rounded-sm text-white"
        >
          Find
        </button>
      </div>
    </div>
  );
};

export default NavBar;
