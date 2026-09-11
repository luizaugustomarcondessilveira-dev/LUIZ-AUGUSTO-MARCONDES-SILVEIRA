export interface Child {
  id: string;
  name: string;
  age: string;
  avatar: string;
  level: string;
  weekPercent: number;
  balance: number;
  accumulated: number;
  spent: number;
  badgeNumber: string;
  badgeLabel?: string;
  streakDays: number;
  role?: 'child' | 'parent';
}

export type TaskStatus = 'todo' | 'pending' | 'approved' | 'rejected';
export type TaskCategory = string;

export interface RoutineTask {
  id: string;
  code: string; // e.g. #REG-1082
  tarCode: string; // e.g. TAR-001
  title: string;
  category: TaskCategory;
  childId: string;
  childName: string;
  avatar: string;
  points: number;
  basePoints: number;
  status: TaskStatus;
  onTime: boolean;
  timingLabel: string;
  criteria: string;
  limitTime: string;
  completedAt: string;
  duration: string;
  feedback: string;
  hasPenalty: boolean;
  penaltyAmount: number;
  proofPhotoUrl?: string;
  historyTimestamp?: string;
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  childId: string;
  childName: string;
  icon: string;
  status: 'pending' | 'delivered' | 'available';
  requestedAt?: string;
  deliveredAt?: string;
  description?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'routine' | 'reward' | 'system';
}

export interface PointTransaction {
  id: string;
  childId: string;
  childName: string;
  date: string;
  title: string;
  type: 'earned' | 'spent' | 'penalty';
  points: number;
  category: string;
}

export interface ParentProfile {
  fatherName: string;
  motherName: string;
  familyName: string;
  email: string;
  avatar?: string;
  fatherAvatar?: string;
  motherAvatar?: string;
  role: string;
}

export interface FamilyAuthUser {
  id: string;
  email: string;
  name: string;
  role: 'parent' | 'co_parent' | 'child';
  childId?: string;
  isDemo?: boolean;
}
