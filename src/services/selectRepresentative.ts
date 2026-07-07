import type { FanGroup, RankedEntry, TicketQueueEntry } from '../types/ticket';

const getMembershipScore = (membership: TicketQueueEntry['membership']): number => {
  switch (membership) {
    case 'vip':
      return 3;
    case 'regular':
      return 2;
    default:
      return 1;
  }
};

export const selectRepresentative = (fanGroups: FanGroup[]): RankedEntry[] => {
  return fanGroups.map((group) => {
    const sortedEntries = [...group.entries].sort((left, right) => {
      const leftJoinedAt = new Date(left.joinedQueueAt).getTime();
      const rightJoinedAt = new Date(right.joinedQueueAt).getTime();
      if (leftJoinedAt !== rightJoinedAt) {
        return leftJoinedAt - rightJoinedAt;
      }

      const leftMembershipScore = getMembershipScore(left.membership);
      const rightMembershipScore = getMembershipScore(right.membership);
      if (leftMembershipScore !== rightMembershipScore) {
        return rightMembershipScore - leftMembershipScore;
      }

      return left.id.localeCompare(right.id);
    });

    const representative = sortedEntries[0];
    if (!representative) {
      return null;
    }

    group.representative = {
      entry: representative,
      score: 0,
      reasons: [],
      rank: 0,
    };

    return group.representative;
  }).filter((entry): entry is RankedEntry => Boolean(entry));
};
