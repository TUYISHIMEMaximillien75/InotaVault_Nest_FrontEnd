import Sidebar from "./Sidebar";
import { Bell, UserCircle } from "lucide-react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();

  const name: string = user?.user?.name || user?.name || "Musician";
  const email: string = user?.user?.email || user?.email || "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .dl-display { font-family: 'Playfair Display', serif; }
        .dl-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes dlFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dl-page-in { animation: dlFadeIn .35s cubic-bezier(.4,0,.2,1) both; }
      `}</style>

      <div className="flex min-h-screen bg-[#f8f5f0] dl-body">

        {/* ── Sidebar ── */}
        <Sidebar />

        {/* ── Main column ── */}
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">

          {/* ── Top header ── */}
          <header className="sticky h-18 top-0 z-30 bg-[#f8f5f0] border-b border-gray-200">
            {/* Red top rule */}
            <div className="h-[3px] bg-red-600" />

            <div className="h-14 flex items-center justify-between px-5 sm:px-8">

              {/* Left: page context label */}
              <div className="flex items-center gap-3">
                {/* <p className="dl-display text-base font-bold text-gray-900 hidden sm:block leading-none"> */}
                {/* InotaVault */}
                {/* </p> */}
                {/* <span className="hidden sm:block w-px h-4 bg-gray-300" /> */}
                {/* <p className="dl-body text-xs font-medium text-gray-400 uppercase tracking-[.18em]"> */}
                {/* Dashboard */}
                {/* </p> */}
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-2 sm:gap-3">

                {/* Bell */}
                <button
                  className="relative w-9 h-9 flex items-center justify-center border border-transparent hover:border-gray-200 hover:bg-white text-gray-400 hover:text-red-600 transition-all"
                  aria-label="Notifications"
                >
                  <Bell size={17} />
                  {/* Notification dot */}
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-600 rounded-full" />
                </button>

                {/* Divider */}
                <span className="hidden sm:block w-px h-5 bg-gray-200" />

                {/* User chip */}
                <div className="flex items-center gap-2.5">
                  <div className="hidden sm:block text-right">
                    <p className="dl-body text-xs font-semibold text-gray-800 leading-none">{name}</p>
                    {email && (
                      <p className="dl-body text-[10px] text-gray-400 mt-0.5 truncate max-w-[140px]">{email}</p>
                    )}
                  </div>
                  <div className="w-8 h-8 bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors cursor-pointer">
                    <UserCircle size={20} />
                  </div>
                </div>

              </div>
            </div>
          </header>

          {/* ── Page content ── */}
          <main className="flex-1 overflow-y-auto">
            <div className="dl-page-in">
              <Outlet />
            </div>
          </main>

        </div>
      </div>
    </>
  );
};

export default DashboardLayout;