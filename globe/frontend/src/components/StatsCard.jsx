import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

export default function StatsCard({ label, value, trend, colorClass = 'text-neon', delay = 0 }) {
  const animatedValue = useCountUp(value, 2200, delay * 1000 + 400);

  const trendPositive = trend && trend.startsWith('+');
  const trendColor = trendPositive ? 'text-neon/60' : 'text-threat-red/60';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="border border-neon/8 rounded-sm bg-surface-light/40 p-4 animate-pulse-glow group hover:border-neon/20 transition-colors duration-500"
    >
      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] tracking-[0.25em] text-text-muted uppercase">
          {label}
        </span>
        {trend && (
          <span className={`text-[10px] tracking-wider font-medium ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>

      {/* Value */}
      <div className={`text-3xl font-bold tracking-wider ${colorClass} transition-all duration-300`}>
        <span className="text-glow">{animatedValue.toLocaleString()}</span>
      </div>

      {/* Bottom Bar */}
      <div className="mt-3 flex items-center gap-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, delay: delay + 0.5, ease: 'easeOut' }}
          className="h-px bg-gradient-to-r from-neon/20 to-transparent"
        />
      </div>
    </motion.div>
  );
}
