import type { RankedEntry } from '../types/ticket';

interface TopCandidatesProps {
  rankedEntries: RankedEntry[];
}

const membershipBadgeClasses = {
  vip: 'bg-amber-100 text-amber-700',
  regular: 'bg-slate-100 text-slate-700',
  blocked: 'bg-rose-100 text-rose-700',
} as const;

function TopCandidates({ rankedEntries }: TopCandidatesProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Top 3 candidates</h3>
      <div className="mt-3 space-y-3">
        {rankedEntries.slice(0, 3).map((candidate) => {
          const membership = candidate.entry.membership ?? 'regular';

          return (
            <div key={candidate.entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{candidate.entry.fanName}</div>
                  <div className="text-sm text-slate-500">{candidate.entry.id}</div>
                </div>
                <div className="text-right text-sm font-semibold text-slate-700">{candidate.score.toFixed(1)}</div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${membershipBadgeClasses[membership]}`}>
                  {membership}
                </span>
                <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                  Rank #{candidate.rank}
                </span>
              </div>

              {candidate.scoreBreakdown ? (
                <div className="mt-3 grid gap-2 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-600 sm:grid-cols-3">
                  {Object.entries(candidate.scoreBreakdown).map(([label, value]) => (
                    <div key={label}>
                      <div className="uppercase tracking-wide text-slate-400">{label}</div>
                      <div className="font-medium text-slate-800">{value}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TopCandidates;
