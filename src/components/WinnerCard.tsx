import type { RankedEntry } from '../types/ticket';

interface WinnerCardProps {
  winner: RankedEntry | null;
}

const membershipBadgeClasses = {
  vip: 'bg-amber-100 text-amber-700',
  regular: 'bg-slate-100 text-slate-700',
  blocked: 'bg-rose-100 text-rose-700',
} as const;

function WinnerCard({ winner }: WinnerCardProps) {
  if (!winner) {
    return (
      <div>
        <h2 className="text-xl font-semibold">Current winner</h2>
        <p className="mt-4 text-sm text-slate-500">No eligible winner was found.</p>
      </div>
    );
  }

  const membership = winner.entry.membership ?? 'regular';

  return (
    <div>
      <h2 className="text-xl font-semibold">Current winner</h2>
      <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-cyan-700">{winner.entry.fanName}</div>
            <div className="text-sm text-slate-600">Entry {winner.entry.id}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-700">{winner.score.toFixed(1)}</div>
            <div className="text-sm text-slate-500">score</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${membershipBadgeClasses[membership]}`}>
            {membership}
          </span>
          <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-700">
            Rank #{winner.rank}
          </span>
        </div>

        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {winner.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>

        {winner.scoreBreakdown ? (
          <div className="mt-4 grid gap-2 rounded-lg border border-cyan-100 bg-white/80 p-3 text-sm text-slate-600 sm:grid-cols-3">
            {Object.entries(winner.scoreBreakdown).map(([label, value]) => (
              <div key={label}>
                <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
                <div className="font-medium text-slate-800">{value}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default WinnerCard;
