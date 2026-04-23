import { useState } from 'react';
import { motion } from 'framer-motion';

const LOCATIONS = [
  { name: 'Austin', lat: 30.2672, lon: -97.7431 },
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
  { name: 'New York (Test)', lat: 40.64, lon: -74.07 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'India (Test)', lat: 28.61, lon: 77.20 },
  { name: 'Africa (0,0)', lat: 0, lon: 0 }
];

export default function LocationBar({ onLocationSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex items-center justify-center"
    >
      {/* Label */}
      <span className="text-[8px] tracking-[0.3em] text-text-muted uppercase mr-4">
        Locations
      </span>

      {/* Location Pills */}
      <div className="flex items-center gap-1.5">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.name}
            onClick={() => {
              setSelected(loc.name === selected ? null : loc.name);
              if (onLocationSelect) {
                onLocationSelect({ lat: loc.lat, lon: loc.lon });
              }
            }}
            className={`px-3 py-1.5 rounded-full text-[10px] tracking-wider transition-all duration-200 border ${
              selected === loc.name
                ? 'bg-white/10 border-white/20 text-white/80'
                : 'bg-white/[0.03] border-white/[0.06] text-white/35 hover:bg-white/[0.06] hover:text-white/50 hover:border-white/10'
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
