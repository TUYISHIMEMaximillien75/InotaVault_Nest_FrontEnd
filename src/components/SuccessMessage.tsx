export default function SuccessMessage({ success_message }: { success_message: string }) {
  if (!success_message) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white/80 backdrop-blur-md border border-green-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl p-4 flex items-center space-x-4">
        
        {/* ICON CONTAINER */}
        <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-sm shadow-green-200">
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="3" 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>

        {/* TEXT CONTENT */}
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-900">Success</h3>
          <p className="text-xs font-medium text-green-700/80 leading-relaxed">
            {success_message}
          </p>
        </div>

        {/* OPTIONAL DECORATIVE ELEMENT */}
        <div className="absolute right-2 top-2 bottom-2 w-1 bg-green-500 rounded-r-2xl" />
      </div>
    </div>
  );
}