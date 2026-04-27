import { motion } from 'framer-motion';
import { useTelemetryStore } from '../store/useTelemetryStore';

export default function Header({ activeMode = 'normal' }) {
  const status = useTelemetryStore((s) => s.status);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="absolute top-0 left-0 w-full p-4 pl-6 pt-6 z-50 pointer-events-none flex justify-between items-start"
    >
      {/* Top Left: New integrated design */}
      <div className="flex flex-col relative pointer-events-auto">
        {/* Gray corner bracket */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white/40"></div>
        
        <div className="pl-3 relative mt-1">
          {/* Red line */}
          <div className="h-[2px] w-[200px] bg-threat-red mb-1 -ml-1"></div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] tracking-[0.2em] text-white/70 font-bold ml-1">
              TOP SECRET // SI-TK // NOFORN
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1.5 ml-1">
            {/* Logo icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow-md">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
              <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9" />
              <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            </svg>
            <div>
              <h1 className="text-3xl font-sans tracking-[0.15em] text-text-main font-bold drop-shadow-md leading-none">
                TERMINUS
              </h1>
              <p className="text-[10px] tracking-[0.15em] text-text-muted mt-1 uppercase font-medium">
                Global Logistics & Tactical Tracking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side pieces */}
      <div className="flex flex-col items-end gap-4 pointer-events-auto">
        <div className="flex flex-col items-end gap-2">
          {status === 'CONNECTING' && (
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></span>
              <span className="text-amber font-bold tracking-wider text-glow-amber">CONNECTING...</span>
            </div>
          )}

          {/* Active Style */}
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-text-muted tracking-wider">ACTIVE STYLE</span>
            <span className="text-amber font-bold tracking-wider text-glow-amber">{activeMode.toUpperCase()}</span>
          </div>
        </div>
        
        {/* Search */}
        <button className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </div>
    </motion.header>
  );
}
