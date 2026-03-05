import Sidebar from "./Sidebar";
import { Bell, UserCircle } from "lucide-react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* 1. Sidebar - Fixed/Sticky via its own internal logic */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* 3. Top Header - Professional Navbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            {/* Search Bar - Hidden on small mobile
            <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg w-full max-w-md border border-transparent focus-within:border-red-200 focus-within:bg-white transition-all">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search songs, repertoires..." 
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div> */}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-none">Admin User</p>
                <p className="text-xs text-gray-500 mt-1">Premium Plan</p>
              </div>
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 border-2 border-white shadow-sm">
                <UserCircle size={28} />
              </div>
            </div>
          </div>
        </header>

        {/* 4. Page Content Wrapper */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
            {/* Fade-in Animation wrapper (optional) */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            </div>
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;