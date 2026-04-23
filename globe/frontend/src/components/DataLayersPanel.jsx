import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DATA_LAYERS = [
  { id: 'airports', icon: '✈', label: 'Airports', defaultOn: false, colorClass: 'text-white/80' },
  { id: 'conflict', icon: '⚔', label: 'Conflict', defaultOn: false, colorClass: 'text-threat-red' },
  { id: 'chokepoints', icon: '⚠', label: 'Chokepoints', defaultOn: false, colorClass: 'text-amber' },
  { id: 'seismic', icon: '⚡', label: 'Seismic', defaultOn: false, colorClass: 'text-white' },
  { id: 'satellites', icon: '☀', label: 'Satellites', defaultOn: false, colorClass: 'text-amber' },
  { id: 'vessels', icon: '🚢', label: 'Vessels', defaultOn: true, colorClass: 'text-green-active' },
  { id: 'aircraft', icon: '✈', label: 'Aircraft', defaultOn: true, colorClass: 'text-amber', toggleColor: 'border-amber text-amber' },
  { id: 'threats', icon: '⚠', label: 'Threats (Zones)', defaultOn: true, colorClass: 'text-threat-red', toggleColor: 'border-threat-red text-threat-red' },
];

export default function DataLayersPanel({ onLayersChange }) {
  const [layers, setLayers] = useState(
    DATA_LAYERS.reduce((acc, l) => ({ ...acc, [l.id]: l.defaultOn }), {})
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleLayer = (id) => {
    setLayers((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (onLayersChange) {
        onLayersChange(next);
      }
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-surface border border-white/20 p-0 w-[250px] overflow-hidden flex flex-col"
    >
      {/* Header / Toggle */}
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/[0.05] border-b border-white/20 transition-colors"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <span className="text-[12px] tracking-[0.1em] text-white font-bold">
          DATA STREAMS
        </span>
        <motion.div
          animate={{ rotate: isMinimized ? -90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Search */}
            <div className="px-3 pt-3 pb-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/[0.04] border border-white/[0.06]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20 shrink-0">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="CCTV MESH"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-[10px] text-white/60 tracking-wider placeholder:text-white/20 outline-none w-full font-mono"
                />
                <button className="p-0.5 rounded hover:bg-white/5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white/20">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Layer Items */}
            <div className="px-3 py-3 space-y-1">
              {DATA_LAYERS.map((layer) => {
                const isOn = layers[layer.id];
                const baseToggleColor = isOn ? (layer.toggleColor || 'border-white/60 text-white/80') : 'border-white/20 text-white/40';
                
                return (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-white/[0.05] transition-colors"
                    onClick={() => toggleLayer(layer.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-[12px] opacity-70 ${layer.colorClass}`}>{layer.icon}</span>
                      <span className={`text-[11px] font-mono tracking-wide ${layer.colorClass}`}>
                        {layer.label}
                      </span>
                    </div>

                    <button
                      className={`text-[9px] px-2 py-0.5 border bg-transparent font-mono transition-colors ${baseToggleColor}`}
                      onClick={(e) => { e.stopPropagation(); toggleLayer(layer.id); }}
                    >
                      {isOn ? 'ON ' : 'OFF'}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
