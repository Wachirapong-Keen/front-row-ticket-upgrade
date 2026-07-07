import { SCORING } from '../constants/scoring';
import type { FanGroup, RankedEntry, TicketQueueEntry } from '../types/ticket';
import { parseTicketValue } from '../utils/parseTicketValue';
import type { QueueOptions } from './buildFrontRowUpgradeQueue';

const getWaitingMinutes = (entry: TicketQueueEntry, now: Date): number => {
  const joinedAt = new Date(entry.joinedQueueAt);
  const diffMs = now.getTime() - joinedAt.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60)));
};

const calculateScore = (entry: TicketQueueEntry, groupSize: number, now: Date, mode: QueueOptions['mode']): number => {
  const ticketValue = parseTicketValue(entry.ticketValue) ?? 0;
  const waitingMinutes = getWaitingMinutes(entry, now);
  const loyaltyPoints = Number(entry.loyaltyPoints ?? 0);
  const upgradesPenalty = Number(entry.upgradesLast30Days ?? 0) * SCORING.RECENT_UPGRADE_PENALTY;
  const vipBoost = entry.membership === 'vip' ? SCORING.VIP_BONUS : 0;
  const rushBonus = mode === 'rush-hour' ? waitingMinutes * SCORING.RUSH_HOUR_WAITING_WEIGHT : 0;
  const vipHourBoost = mode === 'vip-hour' && entry.membership === 'vip' ? SCORING.VIP_HOUR_BONUS : 0;
  const fairPenalty = mode === 'fair-queue' ? upgradesPenalty : 0;
  const groupPenalty = Math.max(0, groupSize - 1) * SCORING.GROUP_PENALTY;
  const loyaltyScore = loyaltyPoints * SCORING.LOYALTY_WEIGHT;
  const ticketScore = ticketValue * SCORING.TICKET_WEIGHT;
  const waitingScore = waitingMinutes * SCORING.WAITING_WEIGHT;

  return loyaltyScore + ticketScore + waitingScore + vipBoost + rushBonus + vipHourBoost - fairPenalty - groupPenalty;
};

export const calculateScores = (
  representatives: TicketQueueEntry[],
  fanGroups: FanGroup[],
  now: Date,
  options: QueueOptions,
): RankedEntry[] => {
  const rankedEntries: RankedEntry[] = [];

  representatives.forEach((representativeEntry, index) => {
    const group = fanGroups[index];
    if (!group) {
      return;
    }

    const mode = options.mode ?? 'standard';
    const waitingMinutes = getWaitingMinutes(representativeEntry, now);
    const score = calculateScore(representativeEntry, group.entries.length, now, mode);
    const reasons = [
      `Waited ${waitingMinutes} minutes`,
      `Loyalty points ${representativeEntry.loyaltyPoints ?? 0}`,
      `Ticket value ${parseTicketValue(representativeEntry.ticketValue) ?? 0}`,
      mode === 'rush-hour' ? 'Rush hour weighting applied' : 'Standard weighting',
      mode === 'vip-hour' && representativeEntry.membership === 'vip' ? 'VIP hour boost applied' : 'VIP hour boost not applied',
      mode === 'fair-queue' ? 'Fair queue penalty applied' : 'Fair queue penalty not applied',
    ].filter(Boolean);

    const rankedEntry: RankedEntry = {
      entry: representativeEntry,
      score,
      reasons,
      rank: 0,
      scoreBreakdown: {
        waiting: waitingMinutes,
        loyalty: Number(representativeEntry.loyaltyPoints ?? 0),
        ticket: parseTicketValue(representativeEntry.ticketValue) ?? 0,
        groupPenalty: Math.max(0, group.entries.length - 1) * SCORING.GROUP_PENALTY,
      },
    };

    group.representative = rankedEntry;
    rankedEntries.push(rankedEntry);
  });

  return rankedEntries;
};
