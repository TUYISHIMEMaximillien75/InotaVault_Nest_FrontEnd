import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Music, Video, ShieldCheck, Layers, ChevronRight, PlayCircle, BookOpen, Youtube, ChevronLeft, ArrowUpRight } from "lucide-react";
import logo from "../assets/icon.png";

const SLIDESHOW_IMAGES = [
  "/slideshow pictures/AFRI IMAGE(10).jpg",
  "/slideshow pictures/AFRI IMAGES(204).jpg",
  "/slideshow pictures/AFRI IMAGES(27).jpg",
  "/slideshow pictures/AFRI IMAGES(30).jpg",
  "/slideshow pictures/AFRI IMAGES(300).jpg",
  "/slideshow pictures/AFRI IMAGES(53).jpg",
  "/slideshow pictures/AFRI IMAGES(57).jpg",
  "/slideshow pictures/AFRI IMAGES(58).jpg",
];

const ARTISTS = [
  { name: "Denys NYITURIKI", image: "/Artists/Denys NYITURIKI.jpg", choir: "Chorale st Paul KICUKIRO", songs: ["Yezu mwiza, Yezu nshuti yanjye", "Kwibuka by Rodrigue"], youtube: "https://www.youtube.com/@DenysNyituriki" },
  { name: "GACANIZI Bernabe", image: "/Artists/GACANIZI Bernabe ISHIMWE.jpg", choir: "Chorale le Bon Berger Kigali", songs: ["Kyrie", ], youtube: "https://www.youtube.com/@Gibarna" },
  { name: "Maximillien TUYISHIME", image: "/Artists/Maximillien TUYISHIME.jpg", choir: "Chorale Le Bon Berger RAMBURA", songs: ["Ntama zanjye", "Les amis de la croix"], youtube: "https://www.youtube.com/@choralelebonbergerrambura9023" },
  { name: "Oreste NIYONZIMA", image: "/Artists/Oreste NIYONZIMA.jpg", choir: "Chorale Christus Regnat", songs: ["Nyakira Ndaje", "Gloria (Imana nisingizwe mu Ijuru)"], youtube: "https://www.youtube.com/@niyonzimaoreste2436" },
  { name: "Pacifiques TUNEZERWE", image: "/Artists/Pacifiques TUNEZERWE.jpg", choir: "Chorale de Kigali", songs: ["Umukiza yatuvukiye", "Kuko ari igihangage"], youtube: "https://www.youtube.com/@tunezerwepacifique7906" },
  { name: "Sadiki Banicet", image: "/Artists/Sadiki B anicet.jpg", choir: "Chorale de Kigali", songs: ["Uhoraho yambiye ijambo", "Urukundo ni ubuzima"], youtube: "https://www.youtube.com/@sadikib" },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  const scrollArtists = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -420 : 420, behavior: "smooth" });
  };

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % SLIDESHOW_IMAGES.length);
    }, 5500);
    return () => clearInterval(t);
  }, [currentSlide]);

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-lora    { font-family: 'Lora', Georgia, serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        .slide-in { animation: fadeSlide 1.2s cubic-bezier(.4,0,.2,1) forwards; }
        @keyframes floatUp {
          from { opacity:0; transform: translateY(28px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .hero-text-1 { animation: floatUp .9s .2s both; }
        .hero-text-2 { animation: floatUp .9s .45s both; }
        .hero-text-3 { animation: floatUp .9s .65s both; }
        .hero-text-4 { animation: floatUp .9s .85s both; }
        .diagonal-divider {
          clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
        }
        .diagonal-divider-up {
          clip-path: polygon(0 12%, 100% 0, 100% 100%, 0 100%);
        }
        .card-hover { transition: transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s ease; }
        .card-hover:hover { transform: translateY(-6px) rotate(-0.3deg); }
        .ink-underline {
          background-image: linear-gradient(to right, #dc2626, #dc2626);
          background-size: 0% 3px;
          background-position: left bottom;
          background-repeat: no-repeat;
          transition: background-size .4s ease;
        }
        .ink-underline:hover { background-size: 100% 3px; }
        .grain-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: .35;
          mix-blend-mode: overlay;
          z-index: 2;
        }
        .step-num {
          font-family: 'Playfair Display', serif;
          font-size: 6rem;
          line-height: 1;
          color: #dc2626;
          opacity: .12;
          position: absolute;
          top: -1.5rem;
          left: -0.75rem;
          font-weight: 900;
          pointer-events: none;
          user-select: none;
        }
      `}</style>

      <div className="min-h-screen bg-[#f8f5f0] flex flex-col font-body overflow-x-hidden">

        {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
        <section className="relative h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden diagonal-divider grain-overlay">
          {/* Slideshow */}
          {SLIDESHOW_IMAGES.map((img, i) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? "opacity-100 z-0 slide-in" : "opacity-0 -z-10"}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover object-center" />
            </div>
          ))}

          {/* Layered overlay — warm tint at bottom, dark at top */}
          <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(15,10,5,.72) 0%, rgba(15,10,5,.38) 40%, rgba(15,10,5,.82) 100%)" }} />

          {/* Thin top rule */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-600 z-30" />

          {/* Floating logo + wordmark */}
          <div className="absolute top-6 left-6 z-30 flex items-center gap-3">
            <img src={logo} alt="InotaVault" className="w-9 h-9 drop-shadow-md" />
            <span className="font-display text-white text-xl font-bold tracking-wide hidden sm:block">InotaVault</span>
          </div>

          {/* Hero copy */}
          <div className="relative z-20 px-6 max-w-5xl mx-auto w-full flex flex-col items-center text-center mt-8">

            {/* Overline label */}
            <div className="hero-text-1 flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-red-500" />
              <span className="font-body text-red-400 text-xs font-semibold tracking-[.22em] uppercase">Sacred Music Archive</span>
              <span className="h-px w-10 bg-red-500" />
            </div>

            <h1 className="hero-text-2 font-display text-white text-5xl sm:text-7xl md:text-8xl leading-[.92] font-black mb-6 tracking-tight">
              The Sound<br />
              <em className="text-red-500 not-italic">of Rwanda</em><br />
              <span className="text-white/70 text-4xl sm:text-5xl md:text-6xl font-bold">Preserved.</span>
            </h1>

            <p className="hero-text-3 font-lora text-white/75 text-lg md:text-xl max-w-xl leading-relaxed italic mb-10">
              Discover, share, and safeguard the sacred music of Rwandan choirs — sheets, audio, and performances in one living vault.
            </p>

            <div className="hero-text-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/songs" onClick={() => localStorage.setItem("filter","all")}
                className="group relative px-8 py-4 bg-red-600 text-white font-semibold rounded-sm text-sm tracking-wide uppercase overflow-hidden transition-all duration-300 hover:bg-red-700 flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(220,38,38,.4)]">
                <span className="relative z-10 flex items-center gap-2">Explore Library <Music size={16} /></span>
              </Link>
              <Link to="/dashboard" onClick={() => localStorage.setItem("journey_to","/dashboard")}
                className="px-8 py-4 bg-transparent border border-white/40 text-white font-semibold rounded-sm text-sm tracking-wide uppercase hover:bg-white/10 hover:border-white/70 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm">
                Dashboard <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-2">
            {SLIDESHOW_IMAGES.map((_, idx) => (
              <button key={idx} onClick={() => goToSlide(idx)}
                className={`transition-all duration-500 rounded-full ${idx === currentSlide ? "w-8 h-2 bg-red-500" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
                aria-label={`Slide ${idx+1}`} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════ INTRO ═══════════════════════════════ */}
        <section className="bg-[#f8f5f0] py-24 px-6 relative diagonal-divider-up">

          {/* Big decorative number */}
          <div className="absolute right-8 top-8 font-display text-[12rem] leading-none font-black text-red-600/5 select-none pointer-events-none hidden lg:block">IV</div>

          <div className="max-w-6xl mx-auto">
            {/* Section header — left-aligned, editorial style */}
            <div className="mb-16 max-w-2xl">
              <p className="text-red-600 text-xs font-semibold tracking-[.22em] uppercase mb-3">New Here?</p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
                Three steps<br />to harmony.
              </h2>
              <p className="font-lora text-gray-500 text-lg leading-relaxed italic">
                Whether you lead a 60-voice chorale or practice solo at dawn — InotaVault fits your workflow.
              </p>
            </div>

            {/* Steps — staggered layout */}
            <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
              {[
                { n:"1", icon: <BookOpen size={28}/>, color:"text-red-600 bg-red-50", title:"Discover Music", desc:"Browse curated, community-uploaded sheets spanning genres, difficulty levels, and liturgical seasons." },
                { n:"2", icon: <Layers size={28}/>, color:"text-indigo-600 bg-indigo-50", title:"Build Repertoires", desc:"Organize favorites into named sets for services, concerts, or rehearsal sessions — shareable with one link." },
                { n:"3", icon: <PlayCircle size={28}/>, color:"text-emerald-600 bg-emerald-50", title:"Learn & Practice", desc:"Pair sheets with audio tracks or embedded YouTube performances for fast, focused learning." },
              ].map(({ n, icon, color, title, desc }) => (
                <div key={n} className="relative pt-12 pl-2">
                  <span className="step-num">{n}</span>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${color}`}>{icon}</div>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">{title}</h3>
                  <p className="font-body text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ FEATURES ═══════════════════════════════ */}
        <section className="py-24 px-6 bg-gray-950 text-white relative overflow-hidden">
          {/* texture lines */}
          <div className="absolute inset-0 opacity-[.035]" style={{ backgroundImage:"repeating-linear-gradient(0deg,#fff,#fff 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#fff,#fff 1px,transparent 1px,transparent 60px)" }} />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <p className="text-red-500 text-xs font-semibold tracking-[.22em] uppercase mb-3">What We Offer</p>
                <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight">
                  Everything you need<br className="hidden sm:block" /> to perform.
                </h2>
              </div>
              <p className="font-lora text-gray-400 max-w-xs text-lg italic leading-relaxed">
                One platform. Infinite possibilities for your musical ensemble.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-800">
              {[
                { icon: <Music size={26}/>, title:"Music Library", desc:"A growing archive of PDF sheets filtered by genre, voice part, language, and difficulty." },
                { icon: <Video size={26}/>, title:"Media Support", desc:"Attach YouTube links and audio files to any song for a comprehensive learning resource." },
                { icon: <Layers size={26}/>, title:"Smart Repertoires", desc:"Curate sets and share a single link so your ensemble rehearses the same version." },
                { icon: <ShieldCheck size={26}/>, title:"Secure & Structured", desc:"Industry-grade security ensures your arrangements and private collections stay protected." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-gray-950 p-8 group hover:bg-red-950/40 transition-colors duration-400 cursor-default">
                  <div className="text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">{icon}</div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="font-body text-gray-400 leading-relaxed text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ ARTISTS ═══════════════════════════════ */}
        <section className="py-24 px-6 bg-[#f8f5f0] overflow-hidden">
          <div className="max-w-7xl mx-auto">

            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
              <div>
                <p className="text-red-600 text-xs font-semibold tracking-[.22em] uppercase mb-3">The Voices</p>
                <h2 className="font-display text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
                  Featured<br />Artists.
                </h2>
              </div>
              <div className="flex items-center gap-3 self-end">
                <button onClick={() => scrollArtists("left")}
                  className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  aria-label="Scroll left"><ChevronLeft size={20}/></button>
                <button onClick={() => scrollArtists("right")}
                  className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  aria-label="Scroll right"><ChevronRight size={20}/></button>
              </div>
            </div>

            {/* Horizontal scroll */}
            <div ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory">
              {ARTISTS.map((artist, idx) => (
                <div key={idx}
                  className="card-hover min-w-[82vw] sm:min-w-[320px] lg:min-w-[300px] shrink-0 snap-center bg-white rounded-none overflow-hidden shadow-sm group flex flex-col border border-gray-100">

                  {/* Photo */}
                  <div className="h-72 sm:h-80 overflow-hidden relative">
                    <img src={artist.image} alt={artist.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                    {/* Bottom gradient */}
                    <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 55%)" }} />
                    {/* Index number */}
                    <span className="absolute top-4 left-4 font-display text-white/30 text-5xl font-black leading-none select-none">
                      {String(idx+1).padStart(2,"0")}
                    </span>
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="text-red-400 text-[10px] font-semibold tracking-[.18em] uppercase mb-1">{artist.choir}</p>
                      <h3 className="font-display text-white text-xl font-bold leading-tight">{artist.name}</h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-[10px] font-semibold tracking-[.18em] text-gray-400 uppercase mb-3">Songs</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {artist.songs.map((s, si) => (
                        <li key={si} className="flex items-center gap-2.5 font-body text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />{s}
                        </li>
                      ))}
                    </ul>
                    <a href={artist.youtube} target="_blank" rel="noopener noreferrer"
                      className="group/btn flex items-center justify-between px-5 py-3.5 bg-gray-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-600 transition-colors duration-300">
                      <span className="flex items-center gap-2"><Youtube size={16}/> Watch on YouTube</span>
                      <ArrowUpRight size={15} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ STATS STRIP ═══════════════════════════════ */}
        <section className="bg-red-600 py-14 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { n:"2+", label:"Choral Communities" },
              { n:"100+", label:"Music Sheets" },
              { n:"6+", label:"Featured Artists" },
              { n:"∞", label:"Possibilities" },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="font-display text-5xl font-black mb-1">{n}</p>
                <p className="font-body text-red-200 text-sm tracking-wide uppercase">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════ CTA ═══════════════════════════════ */}
        <section className="py-28 px-6 bg-[#1a1208] text-white relative overflow-hidden">
          {/* Background accent image */}
          <div className="absolute inset-0 opacity-10">
            <img src={SLIDESHOW_IMAGES[2]} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0" style={{ background:"linear-gradient(135deg, rgba(26,18,8,.97) 40%, rgba(120,20,20,.6) 100%)" }} />

          {/* Decorative side text */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[10rem] font-black text-white/[.03] select-none rotate-90 translate-x-1/3 hidden lg:block">INOTA</div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-red-400 text-xs font-semibold tracking-[.22em] uppercase mb-4">Join the Community</p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
              Elevate your<br /><em className="text-red-500">musical journey.</em>
            </h2>
            <p className="font-lora text-gray-400 text-lg italic leading-relaxed mb-12 max-w-xl mx-auto">
              Thousands of musicians already organizing, discovering, and mastering their craft with InotaVault.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/upload"
                className="px-10 py-4 bg-red-600 text-white font-semibold text-sm uppercase tracking-wider hover:bg-red-500 transition-colors duration-300 rounded-sm shadow-[0_8px_30px_rgba(220,38,38,.35)]">
                Start Uploading
              </Link>
              <Link to="/songs"
                className="px-10 py-4 border border-white/30 text-white font-semibold text-sm uppercase tracking-wider hover:bg-white/8 hover:border-white/60 transition-all duration-300 rounded-sm">
                Browse Library
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ FOOTER ═══════════════════════════════ */}
        <footer className="bg-[#0e0c08] text-gray-500 pt-16 pb-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-12 pb-12 border-b border-gray-800 mb-10">

              {/* Brand */}
              <div className="sm:col-span-2 md:col-span-2 pr-0 md:pr-12">
                <div className="flex items-center gap-3 mb-5">
                  <img src={logo} alt="InotaVault" className="w-10 h-10 brightness-0 invert opacity-80" />
                  <span className="font-display text-white text-2xl font-bold">InotaVault</span>
                </div>
                <p className="font-body text-gray-500 text-sm leading-relaxed max-w-sm">
                  The premier digital archive for Rwandan sacred music — sheets, repertoires, and audio-visual learning, built by musicians for choirs and soloists.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-body text-white font-semibold text-sm uppercase tracking-wider mb-5">Navigate</h4>
                <div className="flex flex-col gap-3 text-sm">
                  {[{ to:"/dashboard", l:"Dashboard" },{ to:"/songs", l:"Library" },{ to:"/upload", l:"Upload Music" }].map(({ to, l }) => (
                    <Link key={l} to={to} className="ink-underline pb-0.5 w-fit hover:text-white transition-colors">{l}</Link>
                  ))}
                </div>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-body text-white font-semibold text-sm uppercase tracking-wider mb-5">Legal</h4>
                <div className="flex flex-col gap-3 text-sm">
                  {["Privacy Policy","Terms of Service","Contact"].map(l => (
                    <a key={l} href="#" className="ink-underline pb-0.5 w-fit hover:text-white transition-colors">{l}</a>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600">
              <p>© {new Date().getFullYear()} InotaVault. All rights reserved.</p>
              <p className="text-center">
                By <a href="http://matycodes.atwebpages.com" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 font-medium transition-colors">MATY Codes</a>
                {" · "}Chorales <strong className="text-gray-500">Le Bon Berger</strong> &amp; <strong className="text-gray-500">St Paul Kicukiro</strong>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}