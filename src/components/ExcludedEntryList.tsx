import type { ExcludedEntry } from '../types/ticket';

interface ExcludedEntryListProps {
  excludedEntries: ExcludedEntry[];
}

function ExcludedEntryList({ excludedEntries }: ExcludedEntryListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Excluded entries</h2>
      <div className="mt-4 space-y-3">
        {excludedEntries.map((item) => (
          <div key={item.entry.id} className="rounded-xl border border-slate-200 p-3">
            <div className="font-semibold">{item.entry.id}</div>
            <div className="text-sm text-slate-600">{item.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExcludedEntryList;
