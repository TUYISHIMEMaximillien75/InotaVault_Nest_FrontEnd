import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import { LayoutDashboard, Search, Filter, X, Menu, LogIn } from "lucide-react";


const NavBar = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(localStorage.getItem("filter") || "all");

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
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const applyFilter = (cat: string) => {
    setSelectedCat(cat);
    localStorage.setItem("filter", cat);
    window.location.reload();
  };

  const openSearch = () => {
    localStorage.setItem("search_bar", "on");
    setMobileOpen(false);
    window.location.reload();
  };
const nextstep = window.location.href;
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .nav-font { font-family: 'DM Sans', sans-serif; }
        .nav-display { font-family: 'Playfair Display', serif; }
        @keyframes mobileIn {
          from { opacity:0; transform: translateX(100%); }
          to   { opacity:1; transform: translateX(0); }
        }
        .mobile-panel-in { animation: mobileIn .28s cubic-bezier(.4,0,.2,1) forwards; }
        .cat-select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 2rem;
          cursor: pointer;
        }
        .cat-select:focus { outline: none; }
      `}</style>

      {/* ── Main nav bar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 nav-font transition-all duration-300 ${
        scrolled
          ? "bg-[#f8f5f0]/95 backdrop-blur-md border-b border-gray-200 shadow-[0_2px_20px_rgba(0,0,0,.08)]"
          : "bg-[#f8f5f0] border-b border-gray-200"
      }`}>

        {/* Top red rule */}
        <div className="h-[3px] bg-red-600 w-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── LEFT: Logo ── */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <img src={logo} alt="InotaVault" className="h-8 w-auto transition-opacity group-hover:opacity-80" />
            </Link>

            {/* ── CENTER: Filter (md+) ── */}
            <div className="hidden md:flex items-center gap-2">
              {/* Styled select wrapper */}
              <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-gray-200 hover:border-gray-400 transition-colors duration-200">
                <Filter size={14} className="text-red-600 shrink-0" />
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="cat-select bg-transparent text-sm font-medium text-gray-700 hover:text-gray-900 max-w-[180px] focus:ring-0"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              {/* Separate apply button */}
              <button
                onClick={() => applyFilter(selectedCat)}
                className="px-5 py-2 bg-gray-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-700 transition-colors duration-200 active:scale-95"
              >
                Apply
              </button>
            </div>


            

            {/* ── RIGHT: Actions (md+) ── */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={openSearch}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-red-700 border border-transparent hover:border-gray-200 hover:bg-white text-sm font-medium transition-all duration-200"
              >
                <Search size={16} />
                <span>Search</span>
              </button>

              {localStorage.getItem("token") ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-950 text-white text-sm font-semibold hover:bg-red-700 transition-colors duration-200"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
              ) : (
                <button
                onClick={() => { localStorage.setItem("journey_to", nextstep); navigate("/login") }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-950 text-white text-sm font-semibold hover:bg-red-700 transition-colors duration-200"
                >
                  <LogIn size={15} />
                  Login
                </button>
              )}
            </div>

            {/* ── MOBILE: Hamburger ── */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 border border-gray-200 bg-white text-gray-700 hover:border-gray-400 transition-all"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div className="mobile-panel-in fixed top-0 right-0 bottom-0 z-[70] w-[80vw] max-w-xs bg-[#f8f5f0] flex flex-col shadow-2xl">

            {/* Panel top rule */}
            <div className="h-[3px] bg-red-600" />

            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <img src={logo} alt="InotaVault" className="h-7 w-auto" />
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter section */}
            <div className="px-5 py-6 border-b border-gray-200">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[.2em] mb-3">
                Filter by Category
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200">
                  <Filter size={13} className="text-red-600 shrink-0" />
                  <select
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                    className="cat-select bg-transparent text-sm font-medium text-gray-700 w-full"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => { applyFilter(selectedCat); setMobileOpen(false); }}
                  className="px-4 py-2.5 bg-gray-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-700 transition-colors shrink-0"
                >
                  Go
                </button>
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Panel footer actions */}
            <div className="px-5 py-5 border-t border-gray-200 flex flex-col gap-3">
              <button
                onClick={openSearch}
                className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 text-gray-700 text-sm font-semibold hover:border-gray-500 transition-colors"
              >
                <Search size={16} /> Search Songs
              </button>
              {localStorage.getItem("token") && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-950 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      {/* Spacer so content isn't under the nav */}
      <div className="h-[67px]" />
    </>
  );
};

export default NavBar;