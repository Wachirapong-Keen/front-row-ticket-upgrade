import type { FanGroup, TicketQueueEntry } from '../types/ticket';
import { normalizePhone } from '../utils/normalizePhone';
import { UnionFind } from '../utils/unionFind';

const normalizeIdentifier = (value: string | number | null | undefined, kind: 'phone' | 'device' | 'account'): string | null => {
  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }

    if (kind === 'phone') {
      return normalizePhone(trimmed) ?? trimmed.toLowerCase();
    }

    return trimmed.toLowerCase();
  }

  return null;
};

const buildConnectionReasons = (entriesInGroup: TicketQueueEntry[]): string[] => {
  const reasons: string[] = [];
  const seen = new Set<string>();

  for (let leftIndex = 0; leftIndex < entriesInGroup.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < entriesInGroup.length; rightIndex += 1) {
      const leftEntry = entriesInGroup[leftIndex];
      const rightEntry = entriesInGroup[rightIndex];
      const sharedIdentifiers = [
        [leftEntry.phoneNumber, rightEntry.phoneNumber],
        [leftEntry.deviceId, rightEntry.deviceId],
        [leftEntry.paymentAccount, rightEntry.paymentAccount],
      ]
        .map(([leftValue, rightValue]) => [normalizeIdentifier(leftValue, 'phone'), normalizeIdentifier(rightValue, 'phone')] as const)
        .filter(([leftValue, rightValue]) => Boolean(leftValue) && Boolean(rightValue) && leftValue === rightValue);

      if (sharedIdentifiers.length === 0) {
        continue;
      }

      const [leftValue] = sharedIdentifiers[0] ?? [];
      const reasonKey = `${leftEntry.id}:${rightEntry.id}:${leftValue ?? ''}`;
      if (seen.has(reasonKey)) {
        continue;
      }

      seen.add(reasonKey);
      reasons.push(`${leftEntry.id} and ${rightEntry.id} share ${leftValue ?? 'an identifier'}`);
    }
  }

  return reasons;
};

export const groupFans = (entries: TicketQueueEntry[]): FanGroup[] => {
  const unionFind = new UnionFind(entries.length);
  const identifierToIndices = new Map<string, number[]>();

  entries.forEach((entry, index) => {
    const identifiers = [
      normalizeIdentifier(entry.phoneNumber, 'phone'),
      normalizeIdentifier(entry.deviceId, 'device'),
      normalizeIdentifier(entry.paymentAccount, 'account'),
    ].filter((value): value is string => Boolean(value));

    identifiers.forEach((identifier) => {
      const matchingIndices = identifierToIndices.get(identifier) ?? [];
      matchingIndices.push(index);
      identifierToIndices.set(identifier, matchingIndices);
    });
  });

  identifierToIndices.forEach((indices) => {
    if (indices.length <= 1) {
      return;
    }

    const [firstIndex, ...rest] = indices;
    rest.forEach((index) => unionFind.union(firstIndex, index));
  });

  const groupsByRoot = new Map<number, TicketQueueEntry[]>();
  entries.forEach((entry, index) => {
    const root = unionFind.find(index);
    const bucket = groupsByRoot.get(root) ?? [];
    bucket.push(entry);
    groupsByRoot.set(root, bucket);
  });

  return Array.from(groupsByRoot.entries()).map(([, groupedEntries], index) => ({
    id: `group-${index + 1}`,
    entries: groupedEntries,
    representative: null,
    connectionReasons: buildConnectionReasons(groupedEntries),
  }));
};
