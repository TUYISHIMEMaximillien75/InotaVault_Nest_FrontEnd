import { useNavigate } from "react-router-dom";
import animated404 from "../assets/dark Animatade 404 inotaVault logo.mp4";
import { ArrowLeft, Home, ShieldAlert, Terminal, Wifi } from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-mono">

            {/* === BACKGROUND EFFECTS === */}
            {/* Radial vignette */}
            <div className="pointer-events-none fixed inset-0 z-0"
                style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, #0a0a0a 100%)" }}
            />
            {/* Red corner flares */}
            <div className="pointer-events-none fixed top-0 left-0 w-96 h-96 rounded-full bg-red-700/10 blur-[120px] z-0" />
            <div className="pointer-events-none fixed bottom-0 right-0 w-96 h-96 rounded-full bg-red-900/10 blur-[120px] z-0" />

            {/* === TOP STATUS BAR === */}
            <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 border-b border-red-900/40 bg-black/60 backdrop-blur-sm text-[10px] text-red-500/70 tracking-[0.2em] uppercase">
                <div className="flex items-center gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    InotaVault OS v4.1.7
                </div>
                <div className="hidden sm:flex items-center gap-6">
                    <span>NODE: BREACH-404</span>
                    <span className="flex items-center gap-1.5">
                        <Wifi className="w-3 h-3" />
                        ENCRYPTED
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-red-400 animate-pulse">⬤ ALERT ACTIVE</span>
                </div>
            </div>

            {/* === MAIN CONTENT === */}
            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center pt-16">

                {/* Terminal log strip */}
                <div className="w-full max-w-2xl mb-8 text-left bg-black/80 border border-red-900/50 rounded-xl p-4 text-[10px] leading-relaxed text-red-400/70 tracking-widest overflow-hidden"
                    style={{ fontFamily: "'Courier New', monospace" }}>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-900/30">
                        <Terminal className="w-3 h-3 text-red-500" />
                        <span className="text-red-500 font-bold">VAULT TERMINAL — INCIDENT LOG</span>
                    </div>
                    <div className="space-y-0.5">
                        <p><span className="text-gray-600">03:41:17 </span><span className="text-yellow-500/80">[WARN]</span> Unregistered path detected: <span className="text-white/60">{window.location.pathname}</span></p>
                        <p><span className="text-gray-600">03:41:17 </span><span className="text-red-500">[ERR] </span> Asset index returned NULL. Sector not mapped.</p>
                        <p><span className="text-gray-600">03:41:18 </span><span className="text-red-500">[ERR] </span> Protocol 404 triggered. Locking sub-chamber.</p>
                        <p><span className="text-gray-600">03:41:18 </span><span className="text-green-500/70">[SYS] </span> Guard protocols active. Awaiting operator input_<span className="animate-pulse">█</span></p>
                    </div>
                </div>

                {/* Video Card */}
                <div className="w-full max-w-md mb-10 relative">
                    {/* Animated border glow */}
                    <div className="absolute -inset-[2px] rounded-3xl z-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-500 to-red-900 animate-spin"
                            style={{ animationDuration: "4s", transformOrigin: "center" }} />
                    </div>
                    <div className="relative z-10 bg-[#0f0f0f] p-3 rounded-3xl border border-red-900/30">
                        {/* Corner brackets */}
                        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-red-500/60 rounded-tl-lg z-20" />
                        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-red-500/60 rounded-tr-lg z-20" />
                        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-red-500/60 rounded-bl-lg z-20" />
                        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-red-500/60 rounded-br-lg z-20" />

                        <video
                            src={animated404}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-auto rounded-2xl relative z-10"
                            style={{ filter: "brightness(0.95) contrast(1.05)" }}
                        />

                        {/* Scan line overlay on video */}
                        <div className="absolute inset-3 rounded-2xl z-20 pointer-events-none opacity-20"
                            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.6) 3px, rgba(0,0,0,0.6) 4px)" }} />
                    </div>
                </div>

                {/* Breach badge */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-700" />
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-700/40 text-red-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                        <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                        Protocol 404 // Vault Breach
                    </div>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-700" />
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[0.95] mb-5 tracking-tight"
                    style={{ fontFamily: "'Georgia', serif", textShadow: "0 0 80px rgba(220,38,38,0.3)" }}>
                    The Vault is Open<span className="text-red-600">.</span>
                    <br />
                    <span className="text-red-600 italic" style={{ letterSpacing: "-0.02em" }}>
                        But It's Empty.
                    </span>
                </h1>

                {/* Subtext */}
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg mb-2"
                    style={{ fontFamily: "'Courier New', monospace" }}>
                    <span className="text-gray-600">//</span>{" "}
                    You've unlocked the sanctuary — but the page you're seeking has been moved, purged, or never existed in the vault registry.
                </p>
                <p className="text-[10px] text-gray-700 tracking-widest uppercase mb-12">
                    ERROR_CODE: 0x404 &nbsp;|&nbsp; SECTOR: UNMAPPED &nbsp;|&nbsp; STATUS: NULL_RETURN
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm sm:max-w-none justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 px-8 py-4 bg-transparent text-gray-400 border border-gray-700 hover:border-red-700 hover:text-red-400 hover:bg-red-950/30 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 w-full sm:w-auto justify-center"
                        style={{ fontFamily: "'Courier New', monospace" }}
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                        Retrace Steps
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="group relative flex items-center gap-3 px-10 py-4 bg-red-600 text-white hover:bg-red-500 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 w-full sm:w-auto justify-center overflow-hidden"
                        style={{ fontFamily: "'Courier New', monospace", boxShadow: "0 0 40px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.1)" }}
                    >
                        {/* shimmer */}
                        <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <Home className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Return to Vault</span>
                    </button>
                </div>
            </div>

            {/* === BOTTOM SIGNATURE === */}
            <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 border-t border-red-900/20 bg-black/40 backdrop-blur-sm text-[9px] text-gray-700 tracking-[0.25em] uppercase">
                <span>InotaVault Security Protocol</span>
                <span className="hidden sm:block">No Data Found in Sector</span>
                <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-700 animate-pulse" />
                    Standby
                </span>
            </div>
        </div>
    );
}