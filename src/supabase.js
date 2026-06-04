import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = supabaseEnabled
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const TABLE = 'sop_quiz_scores';

export async function submitScore({ name, email, score, total }) {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ name, email, score, total }])
    .select()
    .single();
  if (error) console.error('Failed to submit score:', error);
  return { data, error };
}

export async function loadLeaderboard() {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, name, email, score, total, created_at')
    .order('created_at', { ascending: false })
    .limit(2000);
  if (error) console.error('Failed to load leaderboard:', error);
  return { data: data || [], error };
}

/**
 * Collapse multiple attempts per person to their best percentage.
 * (Used by the in-quiz scoreboard, which shows best-per-person.)
 */
export function bestPerPerson(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = (row.name || '').trim().toLowerCase();
    if (!key) continue;
    const existing = map.get(key);
    const rowPct = row.score / row.total;
    const existingPct = existing ? existing.score / existing.total : -1;
    if (
      !existing ||
      rowPct > existingPct ||
      (rowPct === existingPct &&
        new Date(row.created_at) < new Date(existing.created_at))
    ) {
      map.set(key, row);
    }
  }
  return [...map.values()].sort((a, b) => {
    const aPct = a.score / a.total;
    const bPct = b.score / b.total;
    if (bPct !== aPct) return bPct - aPct;
    return new Date(a.created_at) - new Date(b.created_at);
  });
}
