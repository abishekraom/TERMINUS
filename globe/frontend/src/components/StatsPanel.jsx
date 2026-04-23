import Panel from './Panel';
import StatsCard from './StatsCard';
import { STATS } from '../data/mockData';

const colorMap = {
  neon: 'text-neon',
  'status-blue': 'text-status-blue',
  'threat-red': 'text-threat-red',
};

export default function StatsPanel() {
  return (
    <Panel title="Live Metrics" delay={0.2}>
      <div className="space-y-3">
        {STATS.map((stat, index) => (
          <StatsCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            colorClass={colorMap[stat.color] || 'text-neon'}
            delay={0.1 * (index + 1)}
          />
        ))}
      </div>
    </Panel>
  );
}
