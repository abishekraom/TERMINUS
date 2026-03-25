import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ControlsPanel({ assetCount = 0 }) {
  const [bloom, setBloom] = useState(true);
  const [bloomVal, setBloomVal] = useState(100);
  const [sharpen, setSharpen] = useState(true);
  const [sharpenVal, setSharpenVal] = useState(54);
  const [hud, setHud] = useState(true);
  const [layout, setLayout] = useState('Tactical');
  const [panoptic, setPanoptic] = useState(true);
  const [severity, setSeverity] = useState(65);
  const [cleanUI, setCleanUI] = useState(false);
  const [pixelation, setPixelation] = useState(30);
  const [distortion, setDistortion] = useState(50);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel p-0 w-[220px] overflow-hidden flex flex-col"
    >
      {/* Header / Toggle */}
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/[0.05] border-b border-white/20 transition-colors"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <span className="text-[12px] tracking-[0.1em] text-white font-bold">
          COMMAND AUTHORITY
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
            className="overflow-hidden space-y-0"
          >
            <div className="px-3 py-4 space-y-3">
              <button className="w-full text-center py-2 border border-border-dim text-text-main text-[10px] font-mono hover:bg-white/10 hover:border-cta hover:text-cta transition-all duration-200">
                [ OPTIMIZE FLEET ]
              </button>
              <button className="w-full text-center py-2 border border-threat-red text-threat-red text-[10px] font-mono hover:bg-threat-red/20 transition-all duration-200">
                [ RED ALERT ]
              </button>
              <button className="w-full text-center py-2 border border-border-dim text-text-main text-[10px] font-mono hover:bg-white/10 hover:border-cta hover:text-cta transition-all duration-200">
                [ SIMULATE DETOUR ]
              </button>
            </div>

            <div className="border-t border-white/20 mx-3 my-2" />

            <div className="px-4 py-3">
              <span className="text-[10px] tracking-widest text-white/60 font-bold block mb-4">
                TELEMETRY
              </span>
              <div className="flex flex-col gap-1 font-mono text-[11px] font-bold">
                <div className="text-white/80">ASSETS: <span className="text-green-active">{assetCount}</span></div>
                <div className="text-white/80">ZONES: <span className="text-threat-red">3</span></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
