import { describe, expect, it } from 'vitest';
import { buildFrontRowUpgradeQueue } from '../services/buildFrontRowUpgradeQueue';
import type { TicketQueueEntry } from '../types/ticket';

const baseNow = new Date('2026-07-07T19:00:00.000Z');

const createEntry = (overrides: Partial<TicketQueueEntry> = {}): TicketQueueEntry => ({
  id: overrides.id ?? 'entry-1',
  fanId: overrides.fanId ?? 'fan-1',
  fanName: overrides.fanName ?? 'Fan One',
  ticketValue: overrides.ticketValue ?? 100,
  joinedQueueAt: overrides.joinedQueueAt ?? '2026-07-07T18:00:00.000Z',
  eventStartsAt: overrides.eventStartsAt ?? '2026-07-07T21:00:00.000Z',
  status: overrides.status ?? 'waiting',
  loyaltyPoints: overrides.loyaltyPoints ?? 10,
  upgradesLast30Days: overrides.upgradesLast30Days ?? 0,
  membership: overrides.membership ?? 'regular',
  phoneNumber: overrides.phoneNumber ?? null,
  deviceId: overrides.deviceId ?? null,
  paymentAccount: overrides.paymentAccount ?? null,
});

describe('buildFrontRowUpgradeQueue', () => {
  it('keeps cancelled entries out of the winner pool', () => {
    const entries = [createEntry({ id: 'a', status: 'cancelled' }), createEntry({ id: 'b' })];

    const result = buildFrontRowUpgradeQueue(entries, baseNow);

    expect(result.winner?.entry.id).toBe('b');
    expect(result.excludedEntries.some((entry) => entry.entry.id === 'a')).toBe(true);
  });

  it('keeps entries after the concert start time out of the winner pool', () => {
    const entries = [
      createEntry({ id: 'a', eventStartsAt: '2026-07-07T18:30:00.000Z' }),
      createEntry({ id: 'b', eventStartsAt: '2026-07-07T21:00:00.000Z' }),
    ];

    const result = buildFrontRowUpgradeQueue(entries, baseNow);

    expect(result.winner?.entry.id).toBe('b');
    expect(result.excludedEntries.some((entry) => entry.entry.id === 'a')).toBe(true);
  });

  it('keeps blocked fans out of the winner pool', () => {
    const entries = [createEntry({ id: 'a', membership: 'blocked' }), createEntry({ id: 'b', membership: 'regular' })];

    const result = buildFrontRowUpgradeQueue(entries, baseNow);

    expect(result.winner?.entry.id).toBe('b');
    expect(result.excludedEntries.some((entry) => entry.entry.id === 'a')).toBe(true);
  });

  it('keeps invalid or zero ticket values out of the winner pool', () => {
    const entries = [createEntry({ id: 'a', ticketValue: 0 }), createEntry({ id: 'b', ticketValue: '150' })];

    const result = buildFrontRowUpgradeQueue(entries, baseNow);

    expect(result.winner?.entry.id).toBe('b');
    expect(result.excludedEntries.some((entry) => entry.entry.id === 'a')).toBe(true);
  });

  it('connects entries that share a phone number even with different formatting', () => {
    const entries = [
      createEntry({ id: 'a', phoneNumber: '081-234-5678' }),
      createEntry({ id: 'b', phoneNumber: '081 234 5678' }),
    ];

    const result = buildFrontRowUpgradeQueue(entries, baseNow);

    expect(result.fanGroups).toHaveLength(1);
    expect(result.fanGroups[0]?.entries.map((entry) => entry.id).sort()).toEqual(['a', 'b']);
  });

  it('creates one fan group for indirect connections', () => {
    const entries = [
      createEntry({ id: 'a', phoneNumber: '111' }),
      createEntry({ id: 'b', deviceId: '111' }),
      createEntry({ id: 'c', paymentAccount: '222' }),
    ];

    const result = buildFrontRowUpgradeQueue(entries, baseNow);

    expect(result.fanGroups).toHaveLength(2);
    expect(result.fanGroups.some((group) => group.entries.some((entry) => entry.id === 'a') && group.entries.some((entry) => entry.id === 'b'))).toBe(true);
    expect(result.fanGroups.some((group) => group.entries.some((entry) => entry.id === 'c'))).toBe(true);
  });

  it('returns the same winner for identical input', () => {
    const entries = [
      createEntry({ id: 'a', ticketValue: 120, loyaltyPoints: 40 }),
      createEntry({ id: 'b', ticketValue: 150, loyaltyPoints: 30 }),
    ];

    const first = buildFrontRowUpgradeQueue(entries, baseNow);
    const second = buildFrontRowUpgradeQueue(entries, baseNow);

    expect(first.winner?.entry.id).toBe(second.winner?.entry.id);
    expect(first.winner?.score).toBe(second.winner?.score);
  });

  it('does not connect entries when the shared identifier is empty', () => {
    const entries = [createEntry({ id: 'a', deviceId: '' }), createEntry({ id: 'b', deviceId: '' })];

    const result = buildFrontRowUpgradeQueue(entries, baseNow);

    expect(result.fanGroups).toHaveLength(2);
  });

  it('returns no winner for empty input', () => {
    const result = buildFrontRowUpgradeQueue([], baseNow);

    expect(result.winner).toBeNull();
    expect(result.rankedEntries).toEqual([]);
  });

  it('returns no winner when all entries are invalid and excludes every entry', () => {
    const entries = [
      createEntry({ id: 'a', ticketValue: 0 }),
      createEntry({ id: 'b', status: 'cancelled' }),
      createEntry({ id: 'c', eventStartsAt: '2026-07-07T18:30:00.000Z' }),
    ];

    const result = buildFrontRowUpgradeQueue(entries, baseNow);

    expect(result.winner).toBeNull();
    expect(result.excludedEntries.map((entry) => entry.entry.id).sort()).toEqual(['a', 'b', 'c']);
  });

  it('accepts numeric ticket values provided as strings', () => {
    const result = buildFrontRowUpgradeQueue([createEntry({ id: 'a', ticketValue: '220' })], baseNow);

    expect(result.winner?.entry.id).toBe('a');
  });
});
