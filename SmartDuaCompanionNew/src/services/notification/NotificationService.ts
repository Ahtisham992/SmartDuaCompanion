// src/services/notification/NotificationService.ts
import notifee, {
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
  AndroidImportance,
} from '@notifee/react-native';
import { Platform } from 'react-native';

class NotificationService {
  private channelId = 'dua-reminders';

  /**
   * Initialize notification channels (Android)
   */
  async initialize() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: this.channelId,
        name: 'Dua Reminders',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermission(): Promise<boolean> {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1; // 1 = authorized
  }

  /**
   * Schedule a daily notification
   * @param hour - Hour in 24-hour format (0-23)
   * @param minute - Minute (0-59)
   * @param title - Notification title
   * @param body - Notification body
   */
  async scheduleDailyNotification(
    hour: number,
    minute: number,
    title: string,
    body: string
  ): Promise<string> {
    await this.initialize();

    // Create a date for the notification
    const now = new Date();
    const scheduledDate = new Date();
    scheduledDate.setHours(hour);
    scheduledDate.setMinutes(minute);
    scheduledDate.setSeconds(0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledDate.getTime() <= now.getTime()) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: scheduledDate.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };

    const notificationId = await notifee.createTriggerNotification(
      {
        title,
        body,
        android: {
          channelId: this.channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      },
      trigger
    );

    return notificationId;
  }

  /**
   * Schedule morning Azkar reminder
   */
  async scheduleMorningReminder(hour: number = 8, minute: number = 0) {
    const titles = [
      'Morning Azkar Reminder',
      'صباح الخیر - ذکر صبح',
      'Good Morning - Start with Azkar',
    ];
    const bodies = [
      'Have you read your morning Azkar today?',
      'کیا آپ نے آج صبح کے اذکار پڑھ لیے؟',
      "Don't forget to recite your morning supplications!",
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomBody = bodies[Math.floor(Math.random() * bodies.length)];

    return await this.scheduleDailyNotification(hour, minute, randomTitle, randomBody);
  }

  /**
   * Schedule evening Azkar reminder
   */
  async scheduleEveningReminder(hour: number = 18, minute: number = 0) {
    const titles = [
      'Evening Azkar Reminder',
      'مساء الخیر - ذکر شام',
      'Good Evening - Time for Azkar',
    ];
    const bodies = [
      'Have you read your evening Azkar today?',
      'کیا آپ نے آج شام کے اذکار پڑھ لیے؟',
      'Remember to recite your evening supplications!',
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomBody = bodies[Math.floor(Math.random() * bodies.length)];

    return await this.scheduleDailyNotification(hour, minute, randomTitle, randomBody);
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications() {
    await notifee.cancelAllNotifications();
  }

  /**
   * Cancel a specific notification
   */
  async cancelNotification(notificationId: string) {
    await notifee.cancelNotification(notificationId);
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications() {
    return await notifee.getTriggerNotifications();
  }

  /**
   * Display an instant notification (for testing)
   */
  async displayInstantNotification(title: string, body: string) {
    await this.initialize();

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: this.channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: 'default',
      },
    });
  }
}

export default new NotificationService();