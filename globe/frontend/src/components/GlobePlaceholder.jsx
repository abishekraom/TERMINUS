import { motion } from 'framer-motion';

export default function GlobePlaceholder() {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200, 150, 50, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 150, 50, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(77, 200, 255, 0.02) 0%, transparent 50%)',
        }}
      />

      {/* Concentric Circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[200, 300, 400].map((size, i) => (
          <motion.div
            key={size}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
            className="absolute rounded-full border border-white/[0.03]"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      {/* Scanning arc */}
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        style={{
          border: '1px solid transparent',
          borderTopColor: 'rgba(255, 170, 50, 0.12)',
          borderRightColor: 'rgba(255, 170, 50, 0.05)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Satellite Labels */}
      {[
        { label: 'SAT-31795', top: '12%', left: '45%' },
        { label: 'SAT-20465', top: '10%', left: '60%' },
        { label: 'SAT-28430', top: '18%', left: '30%' },
        { label: 'SAT-27001', top: '25%', left: '70%' },
        { label: 'SAT-54216', top: '55%', left: '35%' },
        { label: 'SAT-19679', top: '30%', left: '80%' },
        { label: 'SAT-27386', top: '50%', left: '72%' },
        { label: 'SAT-29228', top: '65%', left: '75%' },
      ].map((sat, i) => (
        <motion.div
          key={sat.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          className="absolute text-[7px] tracking-wider text-amber/30"
          style={{ top: sat.top, left: sat.left }}
        >
          {sat.label}
        </motion.div>
      ))}

      {/* Dot Markers */}
      {[
        { top: '25%', left: '32%', color: 'bg-amber' },
        { top: '40%', left: '55%', color: 'bg-amber' },
        { top: '55%', left: '42%', color: 'bg-cyan' },
        { top: '35%', left: '68%', color: 'bg-amber' },
        { top: '60%', left: '28%', color: 'bg-cyan' },
        { top: '48%', left: '62%', color: 'bg-amber' },
        { top: '70%', left: '50%', color: 'bg-cyan' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: 1 }}
          transition={{
            opacity: { duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 0.5, delay: 0.8 + i * 0.1 },
          }}
          className={`absolute w-1 h-1 rounded-full ${pos.color}`}
          style={{
            top: pos.top,
            left: pos.left,
            boxShadow: pos.color === 'bg-amber'
              ? '0 0 4px rgba(212, 148, 58, 0.5)'
              : '0 0 4px rgba(77, 200, 255, 0.5)',
          }}
        />
      ))}

      {/* Center Label */}
      <div className="relative z-10 text-center">
        <div className="text-[10px] tracking-[0.4em] text-white/10 uppercase mb-1">
          3D Globe
        </div>
        <div className="text-[8px] tracking-[0.3em] text-white/5 uppercase">
          Pending Integration
        </div>
      </div>
    </div>
  );
}
