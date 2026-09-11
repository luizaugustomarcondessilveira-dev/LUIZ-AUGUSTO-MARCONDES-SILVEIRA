import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Child,
  RoutineTask,
  RewardItem,
  NotificationItem,
  PointTransaction,
} from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

// Database Row Types (snake_case in Supabase PostgreSQL)
export interface DbFamilyMember {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
  balance: number;
  accumulated: number;
  spent: number;
  stars: number;
  streak_days: number;
  created_at?: string;
  updated_at?: string;
}

export interface DbRoutineTask {
  id: string;
  code: string;
  tar_code: string;
  title: string;
  category: string;
  child_id: string;
  child_name: string;
  avatar?: string;
  points: number;
  base_points: number;
  status: string;
  on_time: boolean;
  timing_label?: string;
  criteria?: string;
  limit_time?: string;
  completed_at?: string;
  duration?: string;
  feedback?: string;
  has_penalty: boolean;
  penalty_amount: number;
  proof_photo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbRewardItem {
  id: string;
  title: string;
  description?: string;
  cost: number;
  category: string;
  icon?: string;
  available: boolean;
  child_id: string;
  status: string;
  requested_at?: string;
  delivered_at?: string;
  created_at?: string;
}

export interface DbNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: string;
  created_at?: string;
}

export interface DbPointTransaction {
  id: string;
  child_id: string;
  child_name: string;
  date: string;
  title: string;
  type: string;
  points: number;
  category: string;
  created_at?: string;
}

// Data Mappers: Supabase PostgreSQL <-> App Types
export function mapDbToChild(row: DbFamilyMember): Child {
  return {
    id: row.id,
    name: row.name,
    age: row.id === 'beatriz' ? '7 anos' : '10 anos',
    avatar:
      row.avatar_url ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtHDj_fZ4F1-SYxJp2YTb2SiQFXqzcO2IDSmTcV7xE1tFYlYR1lMFIWiXEhWRJ2PYA6SM4R1gNUcESOkjs-beJr6FhRFPtBDbuOI76eLSeV1Vzc7u9AYb78Gn6cpcihbknAHu1f1Tp3Iabp_vPmdiVVWdekArlQsvtXlWX24faQWOV1LGoQDMusiXS_WFroP9yBXZxjVRCaAc2FJygA6ysK3daGqDHhWEYDozPuCNQOOX0JE_3vada',
    level: row.balance > 250 ? 'Nível 4 - Explorador' : 'Nível 3 - Guardião',
    weekPercent: Math.min(100, Math.round(((row.balance ?? 0) / 350) * 100)),
    balance: row.balance ?? 0,
    accumulated: row.accumulated ?? 0,
    spent: row.spent ?? 0,
    badgeNumber: String(row.stars ?? 12),
    badgeLabel: 'Estrelas de Conquista',
    streakDays: row.streak_days ?? 0,
  };
}

export function mapDbToTask(row: DbRoutineTask): RoutineTask {
  return {
    id: row.id,
    code: row.code,
    tarCode: row.tar_code,
    title: row.title,
    category: row.category as any,
    childId: row.child_id,
    childName: row.child_name,
    avatar: row.avatar || '',
    points: row.points ?? 0,
    basePoints: row.base_points ?? 0,
    status: (row.status as any) || 'todo',
    onTime: Boolean(row.on_time),
    timingLabel: row.timing_label || '',
    criteria: row.criteria || '',
    limitTime: row.limit_time || '20:00',
    completedAt: row.completed_at || '',
    duration: row.duration || '',
    feedback: row.feedback || '',
    hasPenalty: Boolean(row.has_penalty),
    penaltyAmount: row.penalty_amount ?? 0,
    proofPhotoUrl: row.proof_photo_url,
  };
}

export function mapTaskToDb(task: RoutineTask): DbRoutineTask {
  return {
    id: task.id,
    code: task.code,
    tar_code: task.tarCode,
    title: task.title,
    category: task.category,
    child_id: task.childId,
    child_name: task.childName,
    avatar: task.avatar,
    points: task.points,
    base_points: task.basePoints,
    status: task.status,
    on_time: task.onTime,
    timing_label: task.timingLabel,
    criteria: task.criteria,
    limit_time: task.limitTime,
    completed_at: task.completedAt,
    duration: task.duration,
    feedback: task.feedback,
    has_penalty: task.hasPenalty,
    penalty_amount: task.penaltyAmount,
    proof_photo_url: task.proofPhotoUrl,
  };
}

export function mapDbToReward(row: DbRewardItem): RewardItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    cost: row.cost ?? 0,
    childId: row.child_id,
    childName: row.child_id === 'beatriz' ? 'Beatriz' : 'Lucas',
    icon: row.icon || 'card_giftcard',
    status: (row.status as any) || 'available',
    requestedAt: row.requested_at,
    deliveredAt: row.delivered_at,
  };
}

export function mapRewardToDb(reward: RewardItem): DbRewardItem {
  return {
    id: reward.id,
    title: reward.title,
    description: reward.description || '',
    cost: reward.cost,
    category: 'Geral',
    icon: reward.icon || 'redeem',
    available: reward.status !== 'delivered',
    child_id: reward.childId,
    status: reward.status,
    requested_at: reward.requestedAt,
    delivered_at: reward.deliveredAt,
  };
}

export function mapDbToNotification(row: DbNotification): NotificationItem {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    time: row.time,
    unread: Boolean(row.unread),
    type: (row.type as any) || 'routine',
  };
}

export function mapDbToTransaction(row: DbPointTransaction): PointTransaction {
  return {
    id: row.id,
    childId: row.child_id,
    childName: row.child_name,
    date: row.date,
    title: row.title,
    type: (row.type as any) || 'earned',
    points: row.points ?? 0,
    category: row.category,
  };
}

// Supabase Async Fetchers & Mutators
export async function syncFetchAll() {
  const client = getSupabase();
  if (!client) return null;

  try {
    const [childrenRes, tasksRes, rewardsRes, notifsRes, txRes] = await Promise.all([
      client.from('family_members').select('*').order('name'),
      client.from('routine_tasks').select('*').order('created_at', { ascending: false }),
      client.from('reward_items').select('*'),
      client.from('notifications').select('*').order('created_at', { ascending: false }),
      client.from('point_transactions').select('*').order('created_at', { ascending: false }),
    ]);

    return {
      children: childrenRes.data ? childrenRes.data.map(mapDbToChild) : null,
      tasks: tasksRes.data ? tasksRes.data.map(mapDbToTask) : null,
      rewards: rewardsRes.data ? rewardsRes.data.map(mapDbToReward) : null,
      notifications: notifsRes.data ? notifsRes.data.map(mapDbToNotification) : null,
      transactions: txRes.data ? txRes.data.map(mapDbToTransaction) : null,
    };
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    return null;
  }
}

export async function syncUpsertTask(task: RoutineTask) {
  const client = getSupabase();
  if (!client) return false;
  try {
    const dbTask = mapTaskToDb(task);
    const { error } = await client.from('routine_tasks').upsert(dbTask);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to upsert task to Supabase:', e);
    return false;
  }
}

export async function syncInsertNotification(notif: NotificationItem) {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('notifications').insert({
      id: notif.id,
      title: notif.title,
      message: notif.message,
      time: notif.time,
      unread: notif.unread,
      type: notif.type,
    });
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to insert notification into Supabase:', e);
    return false;
  }
}

export async function syncUpdateChildBalance(
  childId: string,
  balance: number,
  accumulated: number,
  spent: number
) {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client
      .from('family_members')
      .update({ balance, accumulated, spent, updated_at: new Date().toISOString() })
      .eq('id', childId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to update child balance in Supabase:', e);
    return false;
  }
}

export async function syncUpdateFamilyMemberName(id: string, newName: string) {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client
      .from('family_members')
      .update({ name: newName, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;

    // Update child_name in routine_tasks if applicable
    await client
      .from('routine_tasks')
      .update({ child_name: newName, updated_at: new Date().toISOString() })
      .eq('child_id', id);

    return true;
  } catch (e) {
    console.error('Failed to update family member name in Supabase:', e);
    return false;
  }
}

export async function syncDeleteTask(taskId: string) {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('routine_tasks').delete().eq('id', taskId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to delete task from Supabase:', e);
    return false;
  }
}

export async function syncUpsertReward(reward: RewardItem) {
  const client = getSupabase();
  if (!client) return false;
  try {
    const dbReward = mapRewardToDb(reward);
    const { error } = await client.from('reward_items').upsert(dbReward);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to upsert reward to Supabase:', e);
    return false;
  }
}

export async function syncDeleteReward(rewardId: string) {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('reward_items').delete().eq('id', rewardId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to delete reward from Supabase:', e);
    return false;
  }
}

export async function syncUpsertFamilyMember(
  member: {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
    balance?: number;
    accumulated?: number;
    spent?: number;
    stars?: number;
    streakDays?: number;
  }
) {
  const client = getSupabase();
  if (!client) return false;
  try {
    const payload: Partial<DbFamilyMember> = {
      id: member.id,
      name: member.name,
      role: member.role || 'child',
      avatar_url: member.avatarUrl,
      updated_at: new Date().toISOString(),
    };
    if (member.balance !== undefined) payload.balance = member.balance;
    if (member.accumulated !== undefined) payload.accumulated = member.accumulated;
    if (member.spent !== undefined) payload.spent = member.spent;
    if (member.stars !== undefined) payload.stars = member.stars;
    if (member.streakDays !== undefined) payload.streak_days = member.streakDays;

    const { error } = await client.from('family_members').upsert(payload);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to upsert family member to Supabase:', e);
    return false;
  }
}

export async function syncDeleteFamilyMember(memberId: string) {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('family_members').delete().eq('id', memberId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to delete family member from Supabase:', e);
    return false;
  }
}

export function subscribeToSupabaseRealtime(onDataChanged: () => void) {
  const client = getSupabase();
  if (!client) return () => {};

  try {
    const channel = client
      .channel('family-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'routine_tasks' },
        () => {
          onDataChanged();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reward_items' },
        () => {
          onDataChanged();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'family_members' },
        () => {
          onDataChanged();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => {
          onDataChanged();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.error('Realtime subscription error:', err);
    return () => {};
  }
}

// ---------------------------------------------------------------------------
// Supabase Authentication Methods
// ---------------------------------------------------------------------------

export async function signUpWithSupabase(
  email: string,
  password: string,
  metadata: { name: string; role: string; childId?: string }
) {
  const client = getSupabase();
  if (!client) {
    return {
      data: {
        user: {
          id: `demo-${Date.now()}`,
          email,
          user_metadata: metadata,
        },
      },
      error: null,
      isDemo: true,
    };
  }

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error, isDemo: false };
  } catch (err: any) {
    return { data: null, error: err, isDemo: false };
  }
}

export async function signInWithSupabase(email: string, password: string) {
  const client = getSupabase();
  if (!client) {
    return {
      data: {
        user: {
          id: `demo-${email.split('@')[0]}`,
          email,
          user_metadata: {
            name: email.split('@')[0].toUpperCase(),
            role: 'parent',
          },
        },
      },
      error: null,
      isDemo: true,
    };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error, isDemo: false };
  } catch (err: any) {
    return { data: null, error: err, isDemo: false };
  }
}

export async function signOutSupabase() {
  const client = getSupabase();
  if (!client) return { error: null };
  try {
    const { error } = await client.auth.signOut();
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

export async function getSupabaseSessionUser() {
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data } = await client.auth.getUser();
    return data?.user || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Supabase Storage Photo Upload
// ---------------------------------------------------------------------------

export async function uploadProfilePhoto(file: File, pathPrefix: string = 'avatar'): Promise<string | null> {
  const client = getSupabase();

  // Helper for data URL fallback
  const getBase64Fallback = (): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  if (!client) {
    return getBase64Fallback();
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `avatars/${pathPrefix}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await client.storage
      .from('family-avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.warn('Storage bucket upload failed or bucket does not exist, using base64 fallback:', uploadError.message);
      return getBase64Fallback();
    }

    const { data } = client.storage.from('family-avatars').getPublicUrl(filePath);
    return data?.publicUrl || (await getBase64Fallback());
  } catch (err) {
    console.warn('Error during photo upload, using fallback:', err);
    return getBase64Fallback();
  }
}

export async function syncSaveFamilyProfile(profile: {
  familyName?: string;
  fatherName?: string;
  motherName?: string;
  fatherAvatar?: string;
  motherAvatar?: string;
  email?: string;
}) {
  const client = getSupabase();
  if (!client) return false;

  try {
    const rowsToUpsert = [];
    if (profile.fatherName) {
      rowsToUpsert.push({
        id: 'pai',
        name: profile.fatherName,
        role: 'parent',
        avatar_url: profile.fatherAvatar,
        updated_at: new Date().toISOString(),
      });
    }
    if (profile.motherName) {
      rowsToUpsert.push({
        id: 'mae',
        name: profile.motherName,
        role: 'parent',
        avatar_url: profile.motherAvatar,
        updated_at: new Date().toISOString(),
      });
    }

    if (rowsToUpsert.length > 0) {
      await client.from('family_members').upsert(rowsToUpsert);
    }
    return true;
  } catch (e) {
    console.error('Failed to sync family profile to Supabase:', e);
    return false;
  }
}

