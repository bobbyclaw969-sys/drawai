import { HunterProfile } from './types';
import { createClient } from '@/lib/supabase/client';

export interface SavedPlan {
  id: string;
  name: string;
  profile: HunterProfile;
  strategy: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'taghunter_saved_plans';

// ── localStorage helpers (always available, used as fallback) ───────────────

export function loadPlansLocal(): SavedPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePlansLocal(plans: SavedPlan[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

// ── Supabase helpers (authenticated users) ──────────────────────────────────

async function getUser() {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
}

async function loadPlansRemote(userId: string): Promise<SavedPlan[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('saved_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    name: row.name,
    profile: row.profile as HunterProfile,
    strategy: row.strategy,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

async function upsertPlanRemote(userId: string, plan: SavedPlan): Promise<void> {
  const supabase = createClient();
  await supabase.from('saved_plans').upsert({
    id: plan.id,
    user_id: userId,
    name: plan.name,
    profile: plan.profile,
    strategy: plan.strategy,
    created_at: plan.createdAt,
    updated_at: plan.updatedAt,
  });
}

async function deletePlanRemote(planId: string): Promise<void> {
  const supabase = createClient();
  await supabase.from('saved_plans').delete().eq('id', planId);
}

// ── Merge: push localStorage plans to Supabase on first login ───────────────

async function mergeLocalToRemote(userId: string): Promise<void> {
  const localPlans = loadPlansLocal();
  if (localPlans.length === 0) return;

  const remotePlans = await loadPlansRemote(userId);
  const remoteIds = new Set(remotePlans.map(p => p.id));

  const newPlans = localPlans.filter(p => !remoteIds.has(p.id));
  for (const plan of newPlans) {
    await upsertPlanRemote(userId, plan);
  }

  // Clear localStorage after successful merge
  if (newPlans.length > 0) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/** Load plans — from Supabase if authenticated, localStorage otherwise. */
export async function loadPlans(): Promise<SavedPlan[]> {
  const user = await getUser();
  if (user) {
    await mergeLocalToRemote(user.id);
    return loadPlansRemote(user.id);
  }
  return loadPlansLocal();
}

/** Save a new plan. */
export async function savePlan(
  plan: Omit<SavedPlan, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SavedPlan> {
  const newPlan: SavedPlan = {
    ...plan,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const user = await getUser();
  if (user) {
    await upsertPlanRemote(user.id, newPlan);
  } else {
    const plans = loadPlansLocal();
    savePlansLocal([newPlan, ...plans]);
  }

  return newPlan;
}

/** Delete a plan by ID. */
export async function deletePlan(id: string): Promise<void> {
  const user = await getUser();
  if (user) {
    await deletePlanRemote(id);
  } else {
    const plans = loadPlansLocal().filter(p => p.id !== id);
    savePlansLocal(plans);
  }
}

/** Display name for a plan. */
export function planDisplayName(plan: SavedPlan): string {
  const species = plan.profile.species.join(', ').replace(/_/g, ' ');
  const year = new Date(plan.createdAt).getFullYear();
  return plan.name || `${species} — ${year}`;
}
