import type { QueueMode } from '../services/buildFrontRowUpgradeQueue';

interface ModeSelectorProps {
  currentMode: QueueMode;
  onSelectMode: (mode: QueueMode) => void;
}

function ModeSelector({ currentMode, onSelectMode }: ModeSelectorProps) {
  const modes: QueueMode[] = ['standard', 'rush-hour', 'vip-hour', 'fair-queue'];

  return (
    <div className="flex flex-wrap gap-3">
      {modes.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelectMode(option)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${currentMode === option ? 'bg-cyan-500 text-white shadow-md ring-2 ring-cyan-300' : 'bg-slate-700 text-slate-200 hover:bg-cyan-600 hover:text-white active:scale-95'}`}
        >
          {option.replace('-', ' ')}
        </button>
      ))}
    </div>
  );
}

export default ModeSelector;
