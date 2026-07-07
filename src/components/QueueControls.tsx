interface QueueControlsProps {
  onAdvanceTime: (minutes: number) => void;
}

function QueueControls({ onAdvanceTime }: QueueControlsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={() => onAdvanceTime(5)} className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-cyan-600 active:scale-95">
        +5 min
      </button>
      <button type="button" onClick={() => onAdvanceTime(15)} className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-cyan-600 active:scale-95">
        +15 min
      </button>
      <button type="button" onClick={() => onAdvanceTime(60)} className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-cyan-600 active:scale-95">
        +1 hour
      </button>
    </div>
  );
}

export default QueueControls;
