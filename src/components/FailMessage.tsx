import { X } from "lucide-react";

export default function FailMessage({ fail_message, onClose }: { fail_message: string; onClose?: () => void }) {
  if (!fail_message) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes toastInFail {
          from { opacity: 0; transform: translateY(-12px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes exclamDrop {
          0%   { opacity: 0; transform: translateY(-4px); }
          60%  { transform: translateY(2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerFail {
          from { transform: translateX(-100%); }
          to   { transform: translateX(200%);  }
        }
        .toast-in-fail  { animation: toastInFail .32s cubic-bezier(.34,1.4,.64,1) forwards; }
        .exclaim-drop   { animation: exclamDrop .35s .15s cubic-bezier(.4,0,.2,1) both; }
        .toast-shimmer-fail {
          animation: shimmerFail 1.4s .4s ease-in-out;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
          pointer-events: none;
        }
      `}</style>

      <div
        className="toast-in-fail pointer-events-auto"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        role="alert"
        aria-live="assertive"
      >
        <div className="relative overflow-hidden flex items-center gap-3 pl-4 pr-5 py-3.5 bg-white border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,.10),0_2px_8px_rgba(0,0,0,.06)]"
          style={{ minWidth: 260, maxWidth: 360 }}>

          {/* Left amber accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-400" />

          {/* Icon */}
          <div className="exclaim-drop shrink-0 w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-amber-500 uppercase tracking-[.14em] leading-none mb-0.5">
              Notice
            </p>
            <p className="text-sm font-medium text-gray-800 leading-snug truncate">
              {fail_message}
            </p>
          </div>

          {/* Shimmer sweep */}
          <div className="toast-shimmer-fail absolute inset-0 w-1/3 skew-x-[-20deg]" />

          {/* Close button */}
          {onClose && (
            <button 
              onClick={onClose}
              className="ml-2 p-1 rounded-full hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}