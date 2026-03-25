import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Panel from './Panel';
import { SYSTEM_INFO } from '../data/mockData';

export default function SystemInfoBox() {
  const [timestamp, setTimestamp] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTimestamp(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (date) => {
    return date.toISOString().replace('T', ' ').slice(0, 19) + 'Z';
  };

  return (
    <Panel title="System Overview" delay={0.1}>
      <div className="space-y-4">
        {/* Timestamp */}
        <div>
          <FieldRow
            label="SYS_TIMESTAMP"
            value={formatTimestamp(timestamp)}
            highlight
          />
          <FieldRow
            label="TOTAL_TRACKED"
            value={SYSTEM_INFO.totalTracked.toLocaleString()}
          />
          <FieldRow
            label="FETCHED_LOD"
            value={SYSTEM_INFO.fetchedLOD.toLocaleString()}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-neon/8" />

        {/* Breakdown */}
        <div>
          <div className="text-[9px] tracking-[0.25em] text-neon/40 uppercase mb-3 flex items-center gap-2">
            <div className="w-4 h-px bg-neon/20" />
            ESTIMATED BREAKDOWN
            <div className="flex-1 h-px bg-neon/8" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <BreakdownCard
              icon="✈"
              label="AIRPLANES"
              value={SYSTEM_INFO.airplanes.toLocaleString()}
              delay={0.3}
            />
            <BreakdownCard
              icon="⛴"
              label="SHIPS"
              value={SYSTEM_INFO.ships.toLocaleString()}
              delay={0.4}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neon/8" />

        {/* Source Status */}
        <div>
          <div className="text-[9px] tracking-[0.25em] text-neon/40 uppercase mb-2 flex items-center gap-2">
            <div className="w-4 h-px bg-neon/20" />
            SOURCE STATUS
            <div className="flex-1 h-px bg-neon/8" />
          </div>
          <div className="space-y-1.5">
            <SourceRow name="GDELT" status="active" interval="3m" />
            <SourceRow name="ACLED" status="active" interval="10m" />
            <SourceRow name="OWM" status="active" interval="45s" />
            <SourceRow name="USGS" status="active" interval="3m" />
            <SourceRow name="NOTAM" status="degraded" interval="10m" />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function FieldRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[10px] tracking-wider text-text-muted">{label}</span>
      <span className={`text-[11px] font-medium tracking-wider ${highlight ? 'text-neon text-glow' : 'text-gray-300'}`}>
        {value}
      </span>
    </div>
  );
}

function BreakdownCard({ icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="border border-neon/8 rounded-sm bg-surface-light/50 p-3 text-center"
    >
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-[14px] font-bold text-gray-200 tracking-wider">{value}</div>
      <div className="text-[8px] tracking-[0.2em] text-text-muted mt-1">{label}</div>
    </motion.div>
  );
}

function SourceRow({ name, status, interval }) {
  const statusColor = status === 'active' ? 'bg-neon' : status === 'degraded' ? 'bg-threat-amber' : 'bg-threat-red';
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
      <span className="text-text-muted w-14">{name}</span>
      <span className="text-neon/30 text-[9px]">{interval}</span>
      <div className="flex-1" />
      <span className={`text-[9px] tracking-wider ${status === 'active' ? 'text-neon/50' : 'text-threat-amber/70'}`}>
        {status.toUpperCase()}
      </span>
    </div>
  );
}
