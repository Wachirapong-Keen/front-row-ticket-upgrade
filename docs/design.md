# Front Row Ticket Upgrade Challenge

## 1. Objective

Build a fair and deterministic queue system to select one winner for a front-row ticket upgrade.

The system must:

- Filter invalid queue entries
- Detect related accounts
- Group accounts into fan groups
- Select one representative per fan group
- Calculate priority scores
- Select one deterministic winner
- Return explanations for every decision

## 2. System Flow

Queue Entries
      │
      ▼
Validate Entries
      │
      ▼
Normalize Connection Data
      │
      ▼
Build Fan Groups
      │
      ▼
Select Representative
      │
      ▼
Calculate Score
      │
      ▼
Rank Representatives
      │
      ▼
Choose Winner
      │
      ▼
Return Result


## 3. Data Flow

TicketQueueEntry[]

↓

Valid Entries

↓

Fan Groups

↓

Representatives

↓

Ranked Entries

↓

Winner

## 4. Data Structure

TicketQueueEntry

↓

ExcludedEntry

↓

FanGroup

↓

RankedEntry

↓

FrontRowUpgradeResult

## 5. Fan Group Detection

To ensure fairness, related queue entries are grouped into a single fan group.

Two entries belong to the same group if they share at least one of the following:

- Phone number
- Payment token
- Device ID

The relationship is transitive.

Example:

A shares a phone number with B.

B shares a device ID with C.

Then A, B, and C belong to the same fan group.

A Union-Find (Disjoint Set Union) data structure will be used to efficiently build connected groups.

## 6. Representative Selection

Each fan group is represented by a single queue entry.

The representative is selected using the following priority:

1. Earliest queue join time
2. Highest loyalty level
3. Lowest entry ID (deterministic tie-break)

## 7. Scoring Strategy

Each representative receives a priority score.

The score is calculated from multiple factors:

- Waiting time
- Loyalty level
- VIP status
- Ticket quantity
- Event-specific bonuses

Each factor contributes a configurable weight to the final score.

The representative with the highest score becomes the winner.

## 8. Tie Break Strategy

If two representatives have the same score, the following rules are applied:

1. Earlier queue join time
2. Higher loyalty level
3. Lower entry ID

This guarantees deterministic results.

## 9. Time Complexity

Filtering:
O(n)

Grouping (Union-Find):
Almost O(n)

Scoring:
O(n)

Sorting:
O(n log n)

Overall:
O(n log n)

## 10. Project Structure

services/
Business logic

utils/
Reusable helper functions

types/
Shared interfaces

sample/
Sample queue data

tests/
Unit tests

components/
UI components

pages/
Application page

