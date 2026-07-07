import { ExclusionReasonCode, ExclusionReasonLabel, type ExcludedEntry, type TicketQueueEntry } from '../types/ticket';
import { parseTicketValue } from '../utils/parseTicketValue';

export const filterEntries = (
  entries: TicketQueueEntry[],
  now: Date,
): { validEntries: TicketQueueEntry[]; excludedEntries: ExcludedEntry[] } => {
  const excludedEntries: ExcludedEntry[] = [];
  const validEntries: TicketQueueEntry[] = [];
  const normalizedEntries = entries.map((entry) => ({ ...entry }));

  for (const entry of normalizedEntries) {
    const ticketValue = parseTicketValue(entry.ticketValue);
    const eventStartsAt = new Date(entry.eventStartsAt);

    if (entry.status === 'cancelled') {
      excludedEntries.push({ entry, reason: ExclusionReasonLabel[ExclusionReasonCode.CancelledEntry], excludedAt: now.toISOString() });
      continue;
    }

    if (entry.status === 'upgraded') {
      excludedEntries.push({ entry, reason: ExclusionReasonLabel[ExclusionReasonCode.AlreadyUpgraded], excludedAt: now.toISOString() });
      continue;
    }

    if (Number.isNaN(eventStartsAt.getTime()) || eventStartsAt <= now) {
      excludedEntries.push({ entry, reason: ExclusionReasonLabel[ExclusionReasonCode.ConcertAlreadyStarted], excludedAt: now.toISOString() });
      continue;
    }

    if (entry.membership === 'blocked') {
      excludedEntries.push({ entry, reason: ExclusionReasonLabel[ExclusionReasonCode.BlockedMember], excludedAt: now.toISOString() });
      continue;
    }

    if (ticketValue === null || ticketValue <= 0) {
      excludedEntries.push({ entry, reason: ExclusionReasonLabel[ExclusionReasonCode.InvalidTicketValue], excludedAt: now.toISOString() });
      continue;
    }

    validEntries.push(entry);
  }

  return { validEntries, excludedEntries };
};
