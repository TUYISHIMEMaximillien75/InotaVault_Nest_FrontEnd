import { X } from "lucide-react";

export default function SuccessMessage({ success_message, onClose }: { success_message: string; onClose?: () => void }) {
  if (!success_message) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-12px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 24; }
          to   { stroke-dashoffset: 0;  }
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(200%);  }
        }
        .toast-in  { animation: toastIn .32s cubic-bezier(.34,1.4,.64,1) forwards; }
        .check-draw {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: checkDraw .35s .2s cubic-bezier(.4,0,.2,1) forwards;
        }
        .toast-shimmer {
          animation: shimmer 1.4s .4s ease-in-out;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
          pointer-events: none;
        }
      `}</style>

      <div
        className="toast-in pointer-events-auto"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        role="status"
        aria-live="polite"
      >
        <div className="relative overflow-hidden flex items-center gap-3 pl-4 pr-5 py-3.5 bg-white border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,.10),0_2px_8px_rgba(0,0,0,.06)]"
          style={{ minWidth: 260, maxWidth: 360 }}>

          {/* Left green accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-green-500" />

          {/* Icon */}
          <div className="shrink-0 w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path className="check-draw" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-green-600 uppercase tracking-[.14em] leading-none mb-0.5">
              Success
            </p>
            <p className="text-sm font-medium text-gray-800 leading-snug truncate">
              {success_message}
            </p>
          </div>

          {/* Shimmer sweep */}
          <div className="toast-shimmer absolute inset-0 w-1/3 skew-x-[-20deg]" />

          {/* Close button */}
          {onClose && (
            <button 
              onClick={onClose}
              className="ml-2 p-1 rounded-full hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}