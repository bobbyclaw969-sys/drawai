import { SpeciesKey } from './types';

export type AppStatus = 'applied' | 'drawn' | 'not_drawn' | 'pending';

export interface Application {
  id: string;
  year: number;
  stateId: string;
  stateName: string;
  species: SpeciesKey;
  seasonType: string;
  status: AppStatus;
  pointsBefore: number;
  pointsAfter: number;
  feeSpent: number;
  appliedDate: string;
  resultDate: string;
  notes: string;
}

export interface TrackerData {
  applications: Application[];
  updatedAt: string;
}

const STORAGE_KEY = 'taghunter_tracker';

export function loadTracker(): TrackerData {
  if (typeof window === 'undefined') return { applications: [], updatedAt: '' };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { applications: [], updatedAt: '' };
    return JSON.parse(raw) as TrackerData;
  } catch {
    return { applications: [], updatedAt: '' };
  }
}

export function saveTracker(data: TrackerData): void {
  if (typeof window === 'undefined') return;
  data.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addApplication(app: Omit<Application, 'id'>): Application {
  const data = loadTracker();
  const newApp: Application = { ...app, id: crypto.randomUUID() };
  data.applications = [newApp, ...data.applications];
  saveTracker(data);
  return newApp;
}

export function updateApplication(id: string, updates: Partial<Application>): void {
  const data = loadTracker();
  data.applications = data.applications.map(a =>
    a.id === id ? { ...a, ...updates } : a
  );
  saveTracker(data);
}

export function deleteApplication(id: string): void {
  const data = loadTracker();
  data.applications = data.applications.filter(a => a.id !== id);
  saveTracker(data);
}

// Derive current points per state from application history
export function deriveCurrentPoints(
  applications: Application[]
): Record<string, Record<string, number>> {
  // state -> species -> current points
  const points: Record<string, Record<string, number>> = {};

  // Sort oldest first so we apply in order
  const sorted = [...applications].sort((a, b) => a.year - b.year);

  for (const app of sorted) {
    if (!points[app.stateId]) points[app.stateId] = {};
    // Use pointsAfter as the latest known value
    if (app.pointsAfter >= 0) {
      points[app.stateId][app.species] = app.pointsAfter;
    }
  }

  return points;
}

export function getPointsHistory(
  applications: Application[],
  stateId: string,
  species: SpeciesKey
): { year: number; points: number }[] {
  return applications
    .filter(a => a.stateId === stateId && a.species === species)
    .sort((a, b) => a.year - b.year)
    .map(a => ({ year: a.year, points: a.pointsAfter }));
}

export const STATUS_LABELS: Record<AppStatus, string> = {
  applied: 'Applied',
  pending: 'Pending Result',
  drawn: 'Drawn ✓',
  not_drawn: 'Not Drawn',
};

export const STATUS_COLORS: Record<AppStatus, { bg: string; border: string; text: string }> = {
  applied:   { bg: '#1a2a3a', border: '#2a4a6a', text: '#7ab8e8' },
  pending:   { bg: '#2a2a1a', border: '#5a5a2a', text: '#d4c44a' },
  drawn:     { bg: '#1a3a1a', border: '#2a6a2a', text: '#4ade80' },
  not_drawn: { bg: '#2a1a1a', border: '#5a2a2a', text: '#f87171' },
};

export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 4 + i);

// ─── Manual Points Tracking ────────────────────────────────────────────────

export interface ManualPointsEntry {
  id: string;
  stateId: string;
  stateName: string;
  species: SpeciesKey;
  points: number;
  updatedYear: number;
  notes: string;
}

const POINTS_KEY = 'taghunter_manual_points';

export function loadManualPoints(): ManualPointsEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(POINTS_KEY);
    return raw ? (JSON.parse(raw) as ManualPointsEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveManualPoint(entry: Omit<ManualPointsEntry, 'id'>): void {
  const all = loadManualPoints();
  const existingIdx = all.findIndex(
    e => e.stateId === entry.stateId && e.species === entry.species
  );
  if (existingIdx >= 0) {
    all[existingIdx] = { ...entry, id: all[existingIdx].id };
  } else {
    all.push({ ...entry, id: crypto.randomUUID() });
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(POINTS_KEY, JSON.stringify(all));
  }
}

export function deleteManualPoint(id: string): void {
  const all = loadManualPoints().filter(e => e.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(POINTS_KEY, JSON.stringify(all));
  }
}

// Merge manual points with derived points — manual takes precedence when higher
export function getMergedPoints(
  applications: Application[],
  manualPoints: ManualPointsEntry[]
): Record<string, Record<string, number>> {
  const derived = deriveCurrentPoints(applications);
  for (const entry of manualPoints) {
    if (!derived[entry.stateId]) derived[entry.stateId] = {};
    const current = derived[entry.stateId][entry.species] ?? -1;
    if (entry.points > current) {
      derived[entry.stateId][entry.species] = entry.points;
    }
  }
  return derived;
}

// ─── Deadline Reminders ────────────────────────────────────────────────────

export interface DeadlineReminder {
  key: string; // `${stateId}-${species}`
  stateName: string;
  species: SpeciesKey;
  closeMonth: number;
  closeDay: number;
}

const REMINDERS_KEY = 'taghunter_reminders';

export function loadReminders(): DeadlineReminder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    return raw ? (JSON.parse(raw) as DeadlineReminder[]) : [];
  } catch {
    return [];
  }
}

export function toggleReminder(reminder: DeadlineReminder): boolean {
  const all = loadReminders();
  const idx = all.findIndex(r => r.key === reminder.key);
  let nowWatching: boolean;
  if (idx >= 0) {
    all.splice(idx, 1);
    nowWatching = false;
  } else {
    all.push(reminder);
    nowWatching = true;
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(all));
  }
  return nowWatching;
}

export function isWatched(key: string): boolean {
  return loadReminders().some(r => r.key === key);
}

// ─── Hunt Logbook ─────────────────────────────────────────────────────────

export interface HuntLog {
  id: string;
  year: number;
  stateId: string;
  stateName: string;
  species: SpeciesKey;
  seasonType: string;
  unitOrArea: string;
  startDate: string;
  endDate: string;
  daysAfield: number;
  harvested: boolean;
  animalNotes: string; // points, weight, description
  huntNotes: string;   // conditions, lessons learned
  companions: string;
  totalCost: number;   // tag + travel + other
  createdAt: string;
}

const LOGBOOK_KEY = 'taghunter_logbook';

export function loadLogbook(): HuntLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOGBOOK_KEY);
    return raw ? (JSON.parse(raw) as HuntLog[]) : [];
  } catch {
    return [];
  }
}

export function addHuntLog(log: Omit<HuntLog, 'id' | 'createdAt'>): HuntLog {
  const all = loadLogbook();
  const entry: HuntLog = { ...log, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  all.unshift(entry);
  if (typeof window !== 'undefined') localStorage.setItem(LOGBOOK_KEY, JSON.stringify(all));
  return entry;
}

export function updateHuntLog(id: string, updates: Partial<HuntLog>): void {
  const all = loadLogbook().map(l => l.id === id ? { ...l, ...updates } : l);
  if (typeof window !== 'undefined') localStorage.setItem(LOGBOOK_KEY, JSON.stringify(all));
}

export function deleteHuntLog(id: string): void {
  const all = loadLogbook().filter(l => l.id !== id);
  if (typeof window !== 'undefined') localStorage.setItem(LOGBOOK_KEY, JSON.stringify(all));
}

// ─── License Renewal Tracker ──────────────────────────────────────────────

export interface LicenseEntry {
  id: string;
  stateId: string;
  stateName: string;
  licenseType: string; // "Base License", "Conservation License", etc.
  purchaseDate: string;
  expiryDate: string;
  cost: number;
  notes: string;
}

const LICENSES_KEY = 'taghunter_licenses';

export function loadLicenses(): LicenseEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LICENSES_KEY);
    return raw ? (JSON.parse(raw) as LicenseEntry[]) : [];
  } catch {
    return [];
  }
}

export function addLicense(entry: Omit<LicenseEntry, 'id'>): void {
  const all = loadLicenses();
  all.unshift({ ...entry, id: crypto.randomUUID() });
  if (typeof window !== 'undefined') localStorage.setItem(LICENSES_KEY, JSON.stringify(all));
}

export function deleteLicense(id: string): void {
  const all = loadLicenses().filter(l => l.id !== id);
  if (typeof window !== 'undefined') localStorage.setItem(LICENSES_KEY, JSON.stringify(all));
}

export function getExpiringLicenses(daysAhead = 60): LicenseEntry[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() + daysAhead * 86400000);
  return loadLicenses().filter(l => {
    const exp = new Date(l.expiryDate);
    return exp >= now && exp <= cutoff;
  });
}

export function getUpcomingReminders(daysAhead = 30): DeadlineReminder[] {
  const reminders = loadReminders();
  const now = new Date();
  return reminders.filter(r => {
    let year = now.getFullYear();
    let d = new Date(year, r.closeMonth - 1, r.closeDay);
    if (d < now) {
      year += 1;
      d = new Date(year, r.closeMonth - 1, r.closeDay);
    }
    const days = Math.ceil((d.getTime() - now.getTime()) / 86400000);
    return days <= daysAhead;
  });
}

export function exportToCSV(applications: Application[]): void {
  if (applications.length === 0) return;

  const headers = [
    'Year', 'State', 'Species', 'Method', 'Status',
    'Points Before', 'Points After', 'Fee Spent ($)',
    'Applied Date', 'Result Date', 'Notes',
  ];

  const rows = applications
    .sort((a, b) => b.year - a.year || a.stateName.localeCompare(b.stateName))
    .map(a => [
      a.year,
      a.stateName,
      a.species.replace(/_/g, ' '),
      a.seasonType,
      STATUS_LABELS[a.status],
      a.pointsBefore,
      a.pointsAfter,
      a.feeSpent,
      a.appliedDate,
      a.resultDate,
      `"${(a.notes ?? '').replace(/"/g, '""')}"`,
    ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taghunter-applications-${CURRENT_YEAR}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
