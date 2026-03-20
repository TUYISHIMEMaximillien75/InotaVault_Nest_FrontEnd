import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Music, UploadCloud, Library,
  User, LogOut, Menu, X, Search,
} from "lucide-react";

import logo from "../assets/logo.png";

const NAV_ITEMS = [
  { name: "Dashboard",    path: "/dashboard",              icon: LayoutDashboard },
  { name: "Songs",        path: "/dashboard/songs",        icon: Music           },
  { name: "Upload Song",  path: "/dashboard/upload",       icon: UploadCloud     },
  { name: "Repertoires",  path: "/dashboard/repertoires",  icon: Library         },
  { name: "Profile",      path: "/dashboard/profile",      icon: User            },
  { name: "Explore",      path: "/songs",                  icon: Search          },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    ["token","user","search_bar","filter"].forEach(k => localStorage.removeItem(k));
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .sb2-display { font-family: 'Playfair Display', serif; }
        .sb2-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes sb2SlideIn {
          from { opacity:0; transform: translateX(-100%); }
          to   { opacity:1; transform: translateX(0); }
        }
        .sb2-slide-in { animation: sb2SlideIn .26s cubic-bezier(.4,0,.2,1) forwards; }

        .sb2-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .04em;
          color: #6b7280;
          border-left: 3px solid transparent;
          transition: color .15s, background .15s, border-color .15s;
          white-space: nowrap;
        }
        .sb2-link:hover {
          background: #fef2f2;
          color: #dc2626;
          border-left-color: #fca5a5;
        }
        .sb2-link.active {
          background: #fef2f2;
          color: #dc2626;
          border-left-color: #dc2626;
          font-weight: 700;
        }
        .sb2-link .sb2-icon {
          transition: transform .2s;
          shrink-0: true;
        }
        .sb2-link:hover .sb2-icon,
        .sb2-link.active .sb2-icon {
          transform: translateX(2px);
        }
      `}</style>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-4 h-14 bg-[#f8f5f0] border-b border-gray-200 sb2-body">
        <div className="h-[3px] bg-red-600 absolute top-0 left-0 right-0" />
        {/* <img src={icon} alt="InotaVault" className="w-8 h-8" /> */}
        <img src={logo} alt="" className="h-6 w-auto" />
        <button
          onClick={() => setOpen(true)}
          className="ml-auto w-9 h-9 flex items-center justify-center border border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile spacer */}
      <div className="lg:hidden h-14" />

      {/* ── Overlay ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-[70] h-screen w-64 bg-[#f8f5f0]
          border-r border-gray-200 flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Red top rule */}
        <div className="h-[3px] bg-red-600 shrink-0" />

        {/* Logo */}
        <div className="hidden lg:flex items-center justify-between px-5 py-5 border-b border-gray-200 shrink-0">
          <img src={logo} alt="InotaVault" className="h-8 w-auto" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
        </div>

        {/* Mobile sidebar header */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <img src={logo} alt="InotaVault" className="h-7 w-auto" />
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Section label */}
        <div className="px-5 pt-5 pb-2 shrink-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[.22em] sb2-body">Navigation</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto pb-4 sb2-body">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `sb2-link ${isActive ? "active" : ""}`
              }
            >
              <item.icon size={16} className="sb2-icon shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Divider + user section */}
        <div className="shrink-0 border-t border-gray-200 sb2-body">
          {/* Logout */}
          <button
            onClick={logout}
            className="sb2-link w-full text-left hover:!bg-red-50 hover:!text-red-600 hover:!border-l-red-600"
          >
            <LogOut size={16} className="sb2-icon shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;