import { motion } from 'framer-motion';
import Panel from './Panel';
import { THREAT_LOG } from '../data/mockData';

export default function ThreatFeed() {
  return (
    <Panel title="Threat Intelligence Feed" delay={0.35}>
      <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
        {THREAT_LOG.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.06 }}
            className="flex items-start gap-2 py-1.5 px-2 rounded-sm hover:bg-neon/[0.02] transition-colors duration-200 border-l-2"
            style={{
              borderLeftColor:
                entry.level === 'ERROR'
                  ? 'rgba(255, 51, 51, 0.6)'
                  : entry.level === 'WARN'
                  ? 'rgba(255, 170, 0, 0.6)'
                  : entry.level === 'INFO'
                  ? 'rgba(0, 255, 159, 0.2)'
                  : 'rgba(74, 74, 74, 0.3)',
            }}
          >
            {/* Timestamp */}
            <span className="text-[9px] text-text-muted tracking-wider shrink-0 w-[60px]">
              {entry.time}
            </span>

            {/* Level Badge */}
            <span
              className={`text-[8px] tracking-[0.15em] font-bold shrink-0 w-[38px] text-center rounded-sm px-1 py-0.5 ${
                entry.level === 'ERROR'
                  ? 'text-threat-red bg-threat-red/10'
                  : entry.level === 'WARN'
                  ? 'text-threat-amber bg-threat-amber/10'
                  : entry.level === 'INFO'
                  ? 'text-neon/60 bg-neon/5'
                  : 'text-text-muted bg-surface-lighter/50'
              }`}
            >
              {entry.level}
            </span>

            {/* Source */}
            <span className="text-[9px] text-neon/30 tracking-wider shrink-0 w-[80px]">
              {entry.source}
            </span>

            {/* Message */}
            <span className="text-[9px] text-gray-500 leading-relaxed">
              {entry.message}
            </span>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}
