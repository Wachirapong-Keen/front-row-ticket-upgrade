import type { FrontRowUpgradeResult, TicketQueueEntry } from '../types/ticket';
import { calculateScores } from './calculateScore';
import { chooseWinner } from './chooseWinner';
import { filterEntries } from './filterEntries';
import { groupFans } from './groupFans';
import { selectRepresentative } from './selectRepresentative';

export type QueueMode = 'standard' | 'rush-hour' | 'vip-hour' | 'fair-queue';

export interface QueueOptions {
  mode?: QueueMode;
}

export const buildFrontRowUpgradeQueue = (
  entries: TicketQueueEntry[],
  now: Date,
  options: QueueOptions = {},
): FrontRowUpgradeResult => {
  const { validEntries, excludedEntries } = filterEntries(entries, now);
  const fanGroups = groupFans(validEntries);
  const representatives = selectRepresentative(fanGroups);
  const scoredEntries = calculateScores(
    representatives.map((entry) => entry.entry),
    fanGroups,
    now,
    options,
  );
  const { winner, rankedEntries } = chooseWinner(scoredEntries);

  return {
    winner,
    rankedEntries,
    fanGroups,
    excludedEntries,
  };
};
