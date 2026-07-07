import type { TicketQueueEntry } from '../types/ticket';

export const parseTicketValue = (value: TicketQueueEntry['ticketValue']): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
};
