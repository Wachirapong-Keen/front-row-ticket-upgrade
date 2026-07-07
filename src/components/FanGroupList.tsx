import type { FanGroup } from '../types/ticket';

interface FanGroupListProps {
  fanGroups: FanGroup[];
}

const membershipBadgeClasses = {
  vip: 'bg-amber-100 text-amber-700',
  regular: 'bg-slate-100 text-slate-700',
  blocked: 'bg-rose-100 text-rose-700',
} as const;

function FanGroupList({ fanGroups }: FanGroupListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Fan groups</h2>
      <div className="mt-4 space-y-4">
        {fanGroups.map((group) => {
          const representative = group.representative;
          const membership = representative?.entry.membership ?? 'regular';

          return (
            <div key={group.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">{group.id}</div>
                <div className="text-sm text-slate-500">{group.entries.length} members</div>
              </div>

              <div className="mt-3 rounded-lg bg-slate-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Representative</div>
                    <div className="text-sm text-slate-600">{representative?.entry.fanName ?? 'None'}</div>
                  </div>
                  {representative ? (
                    <div className="text-right text-sm">
                      <div className="font-semibold text-slate-800">#{representative.rank}</div>
                      <div className="text-slate-500">{representative.score.toFixed(1)} pts</div>
                    </div>
                  ) : null}
                </div>

                {representative ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${membershipBadgeClasses[membership]}`}>
                      {membership}
                    </span>
                    <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-700">
                      Rank #{representative.rank}
                    </span>
                  </div>
                ) : null}

                {representative?.reasons?.length ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                    {representative.reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                ) : null}

                {representative?.scoreBreakdown ? (
                  <div className="mt-3 grid gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600 sm:grid-cols-3">
                    {Object.entries(representative.scoreBreakdown).map(([label, value]) => (
                      <div key={label}>
                        <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
                        <div className="font-medium text-slate-800">{value}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-3 text-sm text-slate-600">Members: {group.entries.map((entry) => entry.id).join(', ')}</div>
              <div className="mt-2 text-sm text-slate-600">Connected accounts: {group.connectionReasons.length > 0 ? 'Yes' : 'No'}</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {group.connectionReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FanGroupList;
