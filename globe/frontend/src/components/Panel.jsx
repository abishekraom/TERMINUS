import { motion } from 'framer-motion';

export default function Panel({ title, children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`
        relative border border-neon/10 rounded-sm bg-surface/60 backdrop-blur-sm
        animate-pulse-glow overflow-hidden
        ${className}
      `}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neon/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neon/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neon/30" />

      {/* Title Bar */}
      {title && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-neon/8">
          <div className="w-1.5 h-1.5 rounded-full bg-neon/50" />
          <span className="text-[10px] font-semibold tracking-[0.2em] text-neon/60 uppercase">
            {title}
          </span>
          <div className="flex-1" />
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-neon/20" />
            <div className="w-1 h-1 rounded-full bg-neon/20" />
            <div className="w-1 h-1 rounded-full bg-neon/20" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  );
}
