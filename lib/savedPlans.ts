import { HunterProfile } from './types';

export interface SavedPlan {
  id: string;
  name: string;
  profile: HunterProfile;
  strategy: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'taghunter_saved_plans';

export function loadPlans(): SavedPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePlan(plan: Omit<SavedPlan, 'id' | 'createdAt' | 'updatedAt'>): SavedPlan {
  const plans = loadPlans();
  const newPlan: SavedPlan = {
    ...plan,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newPlan, ...plans]));
  return newPlan;
}

export function deletePlan(id: string): void {
  const plans = loadPlans().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function planDisplayName(plan: SavedPlan): string {
  const species = plan.profile.species.join(', ').replace(/_/g, ' ');
  const year = new Date(plan.createdAt).getFullYear();
  return plan.name || `${species} — ${year}`;
}
