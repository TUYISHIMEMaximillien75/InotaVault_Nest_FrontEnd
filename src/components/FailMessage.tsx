export default function FailMessage({ fail_message }: { fail_message: string }) {
  if (!fail_message) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white/80 backdrop-blur-md border border-green-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl p-4 flex items-center space-x-4">
        
        {/* ICON CONTAINER */}
        <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-sm shadow-green-200">
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {/* ! icon */}
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="3" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>

        {/* TEXT CONTENT */}
        <div className="flex-1">
          <h3 className="text-sm font-bold text-amber-90">Advice</h3>
          <p className="text-xs font-medium text-amber-700/80 leading-relaxed">
            {fail_message}
          </p>
        </div>

        {/* OPTIONAL DECORATIVE ELEMENT */}
        <div className="absolute right-2 top-2 bottom-2 w-1 bg-amber-500 rounded-r-2xl" />
      </div>
    </div>
  );
}