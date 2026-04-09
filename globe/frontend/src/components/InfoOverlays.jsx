import { motion } from 'framer-motion';

export default function InfoOverlays() {
  return (
    <>
      {/* Bottom-Right: Telemetry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute bottom-[90px] right-[240px] z-20 pointer-events-none text-right"
      >
        <p className="text-[9px] tracking-wider text-amber/60">
          GSD: 11731.95M NIRS: 0.0
        </p>
        <p className="text-[9px] tracking-wider text-amber/60">
          ALT: 31285196M SUN: -31.4° EL
        </p>
      </motion.div>
    </>
  );
}
