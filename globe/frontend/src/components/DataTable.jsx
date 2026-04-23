import { motion } from 'framer-motion';
import Panel from './Panel';
import { VESSEL_DATA } from '../data/mockData';

const COLUMNS = [
  { key: 'id', label: 'ID', width: 'w-[130px]' },
  { key: 'type', label: 'TYPE', width: 'w-[90px]' },
  { key: 'callsign', label: 'CALLSIGN', width: 'w-[80px]' },
  { key: 'name', label: 'NAME', width: 'w-[140px]' },
  { key: 'origin', label: 'ORIG', width: 'w-[60px]' },
  { key: 'destination', label: 'DEST', width: 'w-[60px]' },
  { key: 'status', label: 'STATUS', width: 'w-[90px]' },
  { key: 'lat', label: 'LAT', width: 'w-[70px]' },
  { key: 'lon', label: 'LON', width: 'w-[80px]' },
  { key: 'speed', label: 'SPD', width: 'w-[50px]' },
];

export default function DataTable() {
  return (
    <Panel title="Asset Tracking Console" delay={0.4}>
      <div className="overflow-x-auto overflow-y-auto max-h-[220px] custom-scrollbar">
        <table className="w-full text-[10px] font-mono">
          {/* Header */}
          <thead className="sticky top-0 z-10">
            <tr className="bg-surface-light/80 backdrop-blur-sm border-b border-neon/10">
              <th className="text-left px-2 py-2 text-[9px] tracking-[0.2em] text-neon/40 font-medium w-[20px]">
                #
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-2 py-2 text-[9px] tracking-[0.2em] text-neon/40 font-medium ${col.width}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {VESSEL_DATA.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.04 }}
                className="border-b border-border-dim/30 hover:bg-neon/[0.03] transition-colors duration-200 cursor-pointer group"
              >
                <td className="px-2 py-1.5 text-text-muted">
                  {String(index + 1).padStart(2, '0')}
                </td>
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    className={`px-2 py-1.5 ${getCellStyle(col.key, row[col.key])}`}
                  >
                    {formatCell(col.key, row[col.key])}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Bar */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-neon/8">
        <span className="text-[9px] tracking-wider text-text-muted">
          SHOWING {VESSEL_DATA.length} / {VESSEL_DATA.length} ENTRIES
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[9px] tracking-wider text-neon/30">
            AUTO-REFRESH: <span className="text-neon/50">ON</span>
          </span>
          <span className="text-[9px] tracking-wider text-neon/30">
            INTERVAL: <span className="text-neon/50">3s</span>
          </span>
        </div>
      </div>
    </Panel>
  );
}

function getCellStyle(key, value) {
  switch (key) {
    case 'id':
      return 'text-neon/60 font-medium';
    case 'type':
      return value === 'AIRCRAFT'
        ? 'text-status-blue/80'
        : value === 'TANKER'
        ? 'text-threat-amber/80'
        : 'text-gray-400';
    case 'status':
      return value === 'AIRBORNE'
        ? 'text-status-blue'
        : value === 'ANCHORED'
        ? 'text-threat-amber'
        : 'text-neon/60';
    case 'speed':
      return parseFloat(value) > 100 ? 'text-status-blue' : 'text-gray-400';
    case 'callsign':
      return 'text-neon/40';
    default:
      return 'text-gray-500';
  }
}

function formatCell(key, value) {
  if (key === 'status') {
    return (
      <span className="flex items-center gap-1.5">
        <span
          className={`inline-block w-1 h-1 rounded-full ${
            value === 'AIRBORNE'
              ? 'bg-status-blue'
              : value === 'ANCHORED'
              ? 'bg-threat-amber'
              : 'bg-neon/50'
          }`}
        />
        {value}
      </span>
    );
  }
  return value;
}
