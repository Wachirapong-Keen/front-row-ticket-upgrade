import type { RankedEntry } from '../types/ticket';

export const chooseWinner = (rankedEntries: RankedEntry[]): { winner: RankedEntry | null; rankedEntries: RankedEntry[] } => {
  const sortedEntries = [...rankedEntries].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    const leftJoinedAt = new Date(left.entry.joinedQueueAt).getTime();
    const rightJoinedAt = new Date(right.entry.joinedQueueAt).getTime();
    if (leftJoinedAt !== rightJoinedAt) {
      return leftJoinedAt - rightJoinedAt;
    }

    if ((left.entry.loyaltyPoints ?? 0) !== (right.entry.loyaltyPoints ?? 0)) {
      return Number(right.entry.loyaltyPoints ?? 0) - Number(left.entry.loyaltyPoints ?? 0);
    }

    return left.entry.id.localeCompare(right.entry.id);
  });

  sortedEntries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return {
    winner: sortedEntries[0] ?? null,
    rankedEntries: sortedEntries,
  };
};
