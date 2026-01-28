import { NavLink } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Music, 
  UploadCloud, 
  Library, 
  User, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import icon from "../assets/icon.png";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Songs", path: "/dashboard/songs", icon: Music },
    { name: "Upload Song", path: "/dashboard/upload", icon: UploadCloud },
    { name: "Repertoires", path: "/dashboard/repertoires", icon: Library },
    { name: "Profile", path: "/dashboard/profile", icon: User },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
      isActive 
        ? "bg-red-700 text-white shadow-md shadow-red-200" 
        : "text-gray-600 hover:bg-red-50 hover:text-red-700"
    }`;

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="flex flex-row absolute top-0 left-0 z-50 items-center gap-2">
        <div className="">
          <div className=" p-1.5 rounded-lg">
            <img src={icon} alt="" className="w-10 h-10" />
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* OVERLAY (mobile only) */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* LOGO SECTION */}
        <div className="p-8 hidden lg:flex items-center gap-3">
          <div className="bg-red-700 p-2 rounded-xl shadow-lg shadow-red-200">
            <Music size={24} className="text-white" />
          </div>
          <h1 className="font-bold text-2xl tracking-tight text-gray-900">
            InotaVault
          </h1>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-2 mt-4 lg:mt-0">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)} // Close on mobile click
              className={linkClass}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* FOOTER / LOGOUT */}
        <div className="p-4 border-t border-gray-50">
          <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("search_bar");
            localStorage.removeItem("filter");
            navigate("/login");
          }}
           className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-500 font-medium hover:bg-red-50 hover:text-red-700 transition-all duration-200">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;