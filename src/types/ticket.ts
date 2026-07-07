export const ExclusionReasonCode = {
  CancelledEntry: 'cancelled_entry',
  AlreadyUpgraded: 'already_upgraded',
  ConcertAlreadyStarted: 'concert_already_started',
  BlockedMember: 'blocked_member',
  InvalidTicketValue: 'invalid_ticket_value',
} as const;

export type ExclusionReason = (typeof ExclusionReasonCode)[keyof typeof ExclusionReasonCode];

export const ExclusionReasonLabel: Record<ExclusionReason, string> = {
  [ExclusionReasonCode.CancelledEntry]: 'Cancelled entry',
  [ExclusionReasonCode.AlreadyUpgraded]: 'Already upgraded',
  [ExclusionReasonCode.ConcertAlreadyStarted]: 'Concert already started',
  [ExclusionReasonCode.BlockedMember]: 'Blocked member',
  [ExclusionReasonCode.InvalidTicketValue]: 'Invalid ticket value',
};

export type TicketMembership = 'regular' | 'vip' | 'blocked';
export type TicketStatus = 'waiting' | 'upgraded' | 'cancelled';
export type TicketValue = string | number | null;

/**
 * Represents the original queue submission data.
 */
export interface TicketQueueEntry {
  id: string;
  fanId: string;
  fanName: string;
  ticketValue: TicketValue;
  joinedQueueAt: string;
  eventStartsAt: string;
  status: TicketStatus;
  loyaltyPoints?: number | null;
  upgradesLast30Days?: number | null;
  membership?: TicketMembership;
  phoneNumber?: string | null;
  deviceId?: string | null;
  paymentAccount?: string | null;
}

/**
 * Captures an entry excluded from the upgrade process.
 */
export interface ExcludedEntry {
  entry: TicketQueueEntry;
  reason: string;
  excludedAt?: string;
}

/**
 * Represents a connected set of related queue entries treated as one fan group.
 */
export interface FanGroup {
  id: string;
  entries: TicketQueueEntry[];
  representative: RankedEntry | null;
  connectionReasons: string[];
}

/**
 * Represents the computed ranking result for a queue entry.
 */
export interface RankedEntry {
  entry: TicketQueueEntry;
  score: number;
  reasons: string[];
  rank: number;
  scoreBreakdown?: Record<string, number>;
  tieBreakReason?: string;
}

/**
 * Contains the final winner and the supporting details for the upgrade decision.
 */
export interface FrontRowUpgradeResult {
  winner: RankedEntry | null;
  rankedEntries?: RankedEntry[];
  fanGroups: FanGroup[];
  excludedEntries: ExcludedEntry[];
}
