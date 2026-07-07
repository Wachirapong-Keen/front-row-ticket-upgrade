import { useMemo, useState } from 'react';
import ExcludedEntryList from '../components/ExcludedEntryList';
import FanGroupList from '../components/FanGroupList';
import ModeSelector from '../components/ModeSelector';
import QueueControls from '../components/QueueControls';
import TopCandidates from '../components/TopCandidates';
import WinnerCard from '../components/WinnerCard';
import { sampleEntries } from '../data/sampleData';
import { buildFrontRowUpgradeQueue, type QueueMode } from '../services/buildFrontRowUpgradeQueue';
import type { TicketQueueEntry } from '../types/ticket';

function FrontRowUpgradeQueuePage() {
  const [entries, setEntries] = useState<TicketQueueEntry[]>(sampleEntries);
  const [now, setNow] = useState(new Date('2026-07-07T19:00:00.000Z'));
  const [mode, setMode] = useState<QueueMode>('standard');

  const result = useMemo(() => buildFrontRowUpgradeQueue(entries, now, { mode }), [entries, now, mode]);

  const advanceTime = (minutes: number) => {
    setNow((current) => new Date(current.getTime() + minutes * 60_000));
  };

  const updateLoyaltyPoints = (entryId: string, loyaltyPoints: number) => {
    setEntries((currentEntries) => currentEntries.map((entry) => (entry.id === entryId ? { ...entry, loyaltyPoints } : entry)));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Front Row Upgrade Queue</p>
              <h1 className="text-3xl font-semibold">Fair and deterministic fan selection</h1>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm">
              <div>Current time: {now.toISOString()}</div>
              <div className="mt-1 text-slate-400">Mode: {mode.replace('-', ' ')}</div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-sm text-slate-300">
            ระบบจะกรองผู้ที่ไม่ผ่านเกณฑ์ จัดกลุ่มแฟนที่เชื่อมโยงกัน และเลือกตัวแทนจากแต่ละกลุ่มเพื่อให้ผลลัพธ์เป็นธรรมและสอดคล้องกัน
          </div>

          <div className="mt-6">
            <ModeSelector currentMode={mode} onSelectMode={setMode} />
          </div>

          <div className="mt-4">
            <QueueControls onAdvanceTime={advanceTime} />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <WinnerCard winner={result.winner} />
            <TopCandidates rankedEntries={result.rankedEntries ?? []} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Entries</h2>
            <p className="mt-2 text-sm text-slate-500">ลองเปลี่ยน loyalty points หรือเลื่อนเวลาเพื่อดูว่าผลลัพธ์เปลี่ยนอย่างไร</p>
            <div className="mt-4 space-y-3">
              {entries.map((entry) => {
                const isExpired = new Date(entry.eventStartsAt) <= now;
                return (
                  <div key={entry.id} className={`rounded-xl border p-3 ${isExpired ? 'border-amber-300 bg-amber-50' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold">{entry.fanName}</div>
                        <div className="text-sm text-slate-500">{entry.id}</div>
                        {isExpired ? <div className="text-xs font-medium text-amber-700">Expired by current time</div> : null}
                      </div>
                      <label className="text-sm text-slate-600">
                        Loyalty
                        <input
                          type="number"
                          value={entry.loyaltyPoints ?? 0}
                          onChange={(event) => updateLoyaltyPoints(entry.id, Number(event.target.value))}
                          className="ml-2 w-20 rounded border border-slate-300 px-2 py-1"
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <FanGroupList fanGroups={result.fanGroups} />
          <ExcludedEntryList excludedEntries={result.excludedEntries} />
        </section>
      </div>
    </div>
  );
}

export default FrontRowUpgradeQueuePage;