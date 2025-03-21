export type GoalType = 'habit' | 'one-time';
export type FrequencyType = 'daily' | 'weekly' | 'monthly';
export type NotificationType = 'push' | 'email' | 'both';
export type PartnerStatus = 'pending' | 'accepted' | 'rejected';

export interface Frequency {
  type: FrequencyType;
  days?: number[];  // for weekly: [1,3,5] means Mon, Wed, Fri
  time?: string;    // reminder time in HH:mm format
}

export interface Streak {
  current: number;
  best: number;
  lastCompleted: string; // ISO date string
}

export interface Reminder {
  enabled: boolean;
  times: string[];  // Array of HH:mm times
  type: NotificationType;
}

export interface MilestoneUpdate {
  id: string;
  text: string;
  timestamp: string; // ISO date string or formatted string
}

export interface Milestone {
  id: string;
  text: string;
  completed: boolean;
  updates?: MilestoneUpdate[];
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: GoalType;
  icon: string;
  deadline?: string;  // ISO date string, for one-time goals
  frequency?: Frequency;
  progress: number;
  streak: Streak;
  reminders: Reminder;
  created: string;    // ISO date string
  category?: string;
  lastUpdated: string; // ISO date string
  // Optional fields for extra functionality
  milestones?: Milestone[];
  completed?: boolean;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  createdAt: string;  // ISO date string
  photoURL?: string;
}

export interface Partner {
  id: string;
  userId: string;
  status: PartnerStatus;
  goals: string[];    // Array of goalIds they can view/nudge
  addedAt: string;    // ISO date string
}

export interface StreakHistory {
  date: string;       // ISO date string
  completed: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  goalId: string;
  type: 'reminder' | 'streak' | 'partner_nudge';
  title: string;
  body: string;
  scheduledFor: string; // ISO date string
  delivered: boolean;
  createdAt: string;    // ISO date string
}
