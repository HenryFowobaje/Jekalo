// GoalsService.ts

import 'react-native-get-random-values'; // Polyfill for crypto.getRandomValues
import { v4 as uuidv4 } from 'uuid';

import { 
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { collections } from '../../config/firebaseConfig';
import { Goal, StreakHistory } from '../../types/models';
import { createDocument, getDocument, updateDocument, deleteDocument } from './utils';

export class GoalsService {
  static getCollectionPath(userId: string): string {
    return `users/${userId}/goals`;
  }

  /**
   * Creates a goal in Firestore. Accepts goalData that may include additional fields 
   * (e.g. frequency or milestones) only if provided.
   */
  static async createGoal(
    userId: string, 
    goalData: Omit<Goal, 'id' | 'userId' | 'created' | 'lastUpdated' | 'streak' | 'progress'>
  ): Promise<Goal> {
    // Destructure optional fields so we conditionally include them
    const { frequency, milestones, ...rest } = goalData;
    
    const goal: Goal = {
      id: uuidv4(),
      userId,
      ...rest,
      // Include frequency only if it is defined, otherwise omit it
      ...(frequency !== undefined ? { frequency } : {}),
      // Include milestones if provided (this field is optional in your extended Goal type)
      ...(milestones !== undefined ? { milestones } : {}),
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      streak: {
        current: 0,
        best: 0,
        lastCompleted: new Date().toISOString(),
      },
      progress: 0,
    };

    await createDocument(this.getCollectionPath(userId), goal);
    return goal;
  }

  static async getGoal(userId: string, goalId: string): Promise<Goal | null> {
    return getDocument<Goal>(this.getCollectionPath(userId), goalId);
  }

  static async updateGoal(userId: string, goalId: string, updates: Partial<Goal>): Promise<void> {
    await updateDocument<Goal>(this.getCollectionPath(userId), goalId, {
      ...updates,
      lastUpdated: new Date().toISOString()
    });
  }

  static async deleteGoal(userId: string, goalId: string): Promise<void> {
    await deleteDocument(this.getCollectionPath(userId), goalId);
  }

  static async getUserGoals(userId: string): Promise<Goal[]> {
    const goalsRef = collections.goals(userId);
    const q = query(goalsRef, orderBy('created', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Goal);
  }

  static async updateStreak(userId: string, goalId: string, completed: boolean): Promise<void> {
    const goal = await this.getGoal(userId, goalId);
    if (!goal) return;

    const now = new Date();
    const lastCompleted = new Date(goal.streak.lastCompleted);
    const isToday = now.toDateString() === lastCompleted.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === lastCompleted.toDateString();

    const newStreak = { ...goal.streak };

    if (completed) {
      if (!isToday) {
        if (isYesterday) {
          newStreak.current += 1;
        } else {
          newStreak.current = 1;
        }
        newStreak.best = Math.max(newStreak.current, newStreak.best);
        newStreak.lastCompleted = new Date().toISOString();
      }
    } else if (isToday) {
      newStreak.current = Math.max(0, newStreak.current - 1);
      newStreak.lastCompleted = lastCompleted.toISOString();
    }

    await this.updateGoal(userId, goalId, { streak: newStreak });

    const streakHistory: StreakHistory = {
      date: new Date().toISOString(),
      completed
    };

    await createDocument(`users/${userId}/streaks/${goalId}/history`, {
      id: uuidv4(),
      ...streakHistory
    });
  }

  static async getStreakHistory(userId: string, goalId: string, limitCount = 30): Promise<StreakHistory[]> {
    const historyRef = collection(collections.streaks(userId), goalId, 'history');
    const q = query(historyRef, orderBy('date', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as StreakHistory);
  }
}
