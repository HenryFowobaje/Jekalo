import {
    collection,
    query,
    orderBy,
    getDocs,
    limit,
} from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { collections } from '../../config/firebaseConfig';
import { Notification } from '../../types/models';
import { createDocument, updateDocument } from './utils';
import { v4 as uuidv4 } from 'uuid';

export class NotificationsService {
    static async requestPermissions(): Promise<boolean> {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            return finalStatus === 'granted';
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
            return false;
        }
    }

    static async scheduleNotification(
        title: string,
        body: string,
        trigger: Notifications.NotificationTriggerInput
    ): Promise<string | null> {
        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) return null;

            return await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                },
                trigger,
            });
        } catch (error) {
            console.error('Error scheduling notification:', error);
            return null;
        }
    }

    static async createNotification(
        userId: string,
        notification: Omit<Notification, 'id' | 'userId' | 'createdAt' | 'delivered'>
    ): Promise<Notification | null> {
        try {
            const newNotification: Notification = {
                id: uuidv4(),
                userId,
                ...notification,
                delivered: false,
                createdAt: new Date().toISOString(),
            };

            await createDocument(`users/${userId}/notifications`, newNotification);
            return newNotification;
        } catch (error) {
            console.error('Error creating notification in Firestore:', error);
            return null;
        }
    }

    static async markAsDelivered(userId: string, notificationId: string): Promise<void> {
        try {
            await updateDocument<Notification>(
                `users/${userId}/notifications`,
                notificationId,
                { delivered: true }
            );
        } catch (error) {
            console.error(`Error marking notification ${notificationId} as delivered:`, error);
        }
    }

    static async getUserNotifications(userId: string, limitCount = 50): Promise<Notification[]> {
        try {
            const notificationsRef = collections.notifications(userId);
            const q = query(
                notificationsRef,
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Notification);
        } catch (error) {
            console.error('Error fetching user notifications:', error);
            return [];
        }
    }

    static async scheduleGoalReminder(
        userId: string,
        goalId: string,
        title: string,
        body: string,
        scheduledFor: Date
    ): Promise<string | null> {
        const secondsFromNow = Math.floor((scheduledFor.getTime() - Date.now()) / 1000);

        if (secondsFromNow <= 0) {
            console.warn('Scheduled time is in the past or too close.');
            return null;
        }

        // Explicitly cast the type property to satisfy the expected type
        const trigger: Notifications.NotificationTriggerInput = {
            type: 'timeInterval' as Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: secondsFromNow,
            repeats: false,
        };

        try {
            const notificationId = await this.scheduleNotification(title, body, trigger);
            if (notificationId) {
                const record = await this.createNotification(userId, {
                    goalId,
                    type: 'reminder',
                    title,
                    body,
                    scheduledFor: scheduledFor.toISOString(),
                });
                if (!record) {
                    // Rollback the scheduled notification if Firestore record creation fails
                    await Notifications.cancelScheduledNotificationAsync(notificationId);
                    return null;
                }
            }
            return notificationId;
        } catch (error) {
            console.error('Error scheduling goal reminder:', error);
            return null;
        }
    }

    static async cancelNotification(notificationId: string): Promise<void> {
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (error) {
            console.error(`Error canceling notification ${notificationId}:`, error);
        }
    }

    static setupNotificationHandler(): void {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });
    }
}
