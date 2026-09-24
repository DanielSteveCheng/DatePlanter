import { useMemo } from 'react';
import { computeStats } from '../../lib/stats';
import { Button } from '../ui/Field';
import { Panel } from '../ui/Panel';
import { StatRanking } from './StatRanking';
import { StatTile } from './StatTile';

const inDays = (days) => (days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`);
const daysAgo = (days) => (days === 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`);

export function StatsPanel({ dates, onBack, onClose }) {
  const stats = useMemo(() => computeStats(dates), [dates]);

  return (
    <Panel title="Garden stats" closeLabel="Close stats" onClose={onClose} footer={<Button onClick={onBack}>Back</Button>}>
      {stats.total === 0 ? (
        <p className="text-body">No dates planted yet. Stats will grow with your vine.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-1.5">
            <StatTile label="Dates planted" value={stats.total} />
            <StatTile label="Been on" value={stats.completed} />
            <StatTile label="Coming up" value={stats.upcoming} />
            <StatTile label="Per month" value={stats.perMonth.toFixed(1)} />
          </div>
          <div className="flex flex-col gap-0.5 text-body">
            {stats.next && (
              <p>
                Next: <b>{stats.next.title}</b> {inDays(stats.next.inDays)}
              </p>
            )}
            {stats.last && (
              <p>
                Last: <b>{stats.last.title}</b> {daysAgo(stats.last.daysAgo)}
              </p>
            )}
            {stats.unscheduled > 0 && <p>{stats.unscheduled} still waiting for a time</p>}
          </div>
          <StatRanking title="Favorite types" rows={stats.byType} />
          <StatRanking title="Favorite places" rows={stats.byLocation} />
          <StatRanking title="Favorite days" rows={stats.byWeekday} />
          <StatRanking title="Time of day" rows={stats.byTimeOfDay} />
          <StatRanking title="Busiest months" rows={stats.byMonth} />
          <StatRanking title="Planted by" rows={stats.byAuthor} />
        </div>
      )}
    </Panel>
  );
}
