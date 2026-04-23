import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FILTER_MODES = [
  { id: 'crt', label: 'CRT', icon: '▦' },
  { id: 'nvg', label: 'NVG', icon: '☽' },
  { id: 'flir', label: 'FLIR', icon: '◐' },
  { id: 'anime', label: 'Anime', icon: '✦' },
  { id: 'noir', label: 'Noir', icon: '◑' },
  { id: 'snow', label: 'Snow', icon: '❄' },
];

export default function ViewModeSelector({ activeMode, setActiveMode }) {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const isFilterActive = FILTER_MODES.some(m => m.id === activeMode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="flex flex-col items-center gap-0 w-[500px]"
    >
      {/* View Mode Toolbar */}
      <div className="glass-panel-solid rounded-xl flex flex-col items-center gap-2 p-2 w-full justify-between">
        <div className="flex items-center w-full justify-between gap-1">
          
          {/* Normal Button */}
          <button
            onClick={() => { setActiveMode('normal'); setFilterMenuOpen(false); }}
            className={`flex-1 flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 relative ${
              activeMode === 'normal'
                ? 'bg-cyan/15 text-cyan'
                : 'text-white/25 hover:text-white/45 hover:bg-white/[0.03]'
            }`}
          >
            <span className="text-[16px]">○</span>
            <span className={`text-[8px] tracking-[0.15em] uppercase font-mono ${
              activeMode === 'normal' ? 'text-white font-bold' : 'text-white/40'
            }`}>
              Normal
            </span>
            {activeMode === 'normal' && (
              <motion.div
                layoutId="viewModeIndicator"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan"
                style={{ boxShadow: '0 0 6px rgba(77, 200, 255, 0.8)' }}
              />
            )}
          </button>

          {/* Apply Filter Button */}
          <button
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            className={`flex-1 flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 relative ${
              isFilterActive || filterMenuOpen
                ? 'bg-cyan/15 text-cyan'
                : 'text-white/25 hover:text-white/45 hover:bg-white/[0.03]'
            }`}
          >
            <span className="text-[16px]">✧</span>
            <span className={`text-[8px] tracking-[0.15em] uppercase font-mono ${
              isFilterActive || filterMenuOpen ? 'text-white font-bold' : 'text-white/40'
            }`}>
              Apply Filter
            </span>
            {(isFilterActive || filterMenuOpen) && activeMode !== 'normal' && activeMode !== 'ai' && (
              <motion.div
                layoutId="viewModeIndicator"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan"
                style={{ boxShadow: '0 0 6px rgba(77, 200, 255, 0.8)' }}
              />
            )}
          </button>

          {/* AI Button */}
          <button
            onClick={() => { setActiveMode('ai'); setFilterMenuOpen(false); }}
            className={`flex-1 flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 relative ${
              activeMode === 'ai'
                ? 'bg-cyan/15 text-cyan'
                : 'text-white/25 hover:text-white/45 hover:bg-white/[0.03]'
            }`}
          >
            <span className="text-[16px]">⚙</span>
            <span className={`text-[8px] tracking-[0.15em] uppercase font-mono ${
              activeMode === 'ai' ? 'text-white font-bold' : 'text-white/40'
            }`}>
              AI
            </span>
            {activeMode === 'ai' && (
              <motion.div
                layoutId="viewModeIndicator"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan"
                style={{ boxShadow: '0 0 6px rgba(77, 200, 255, 0.8)' }}
              />
            )}
          </button>

        </div>
        
        {/* Filters Dropdown */}
        <AnimatePresence>
          {filterMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 4 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="w-full overflow-hidden flex justify-center flex-wrap gap-2 border-t border-white/10 pt-2 pb-1"
            >
              {FILTER_MODES.map((mode) => {
                const isActive = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => { setActiveMode(mode.id); setFilterMenuOpen(false); }}
                    className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-md transition-all duration-200 ${
                      isActive
                        ? 'bg-amber/20 text-amber'
                        : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-[14px]">{mode.icon}</span>
                    <span className={`text-[7px] tracking-widest uppercase font-mono ${isActive ? 'text-amber font-bold' : ''}`}>
                      {mode.label}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gemini Commander Terminal dropdown when AI is selected */}
      <AnimatePresence>
        {activeMode === 'ai' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass-panel-solid mt-2 border border-white/10 flex flex-col font-mono w-full overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="border-b border-white/20 px-4 py-3 bg-white/5">
              <span className="text-[12px] font-bold tracking-widest text-white/90">
                [ GEMINI 2.0 COMMANDER ROUTING ]
              </span>
            </div>
            
            {/* Terminal Body */}
            <div className="p-5 flex flex-col gap-6">
              <div className="text-[11px] tracking-wider text-cyan">
                &gt; SYSTEM ONLINE. AWAITING NATURAL LANGUAGE REROUTING COMMANDS.
              </div>
              
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  placeholder="e.g. Block the Red Sea and detour all transit..." 
                  className="flex-1 bg-black/50 border border-white/20 px-3 py-2 text-[11px] text-white outline-none placeholder:text-white/20 transition-colors focus:border-cyan"
                />
                <button className="border border-cta px-5 py-2 text-[11px] font-bold text-cta tracking-widest hover:bg-cta/20 hover:shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all duration-200 cursor-pointer">
                  [ EXEC ]
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
