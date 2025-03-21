import { useEffect } from 'react';

type EventName = 
  | 'goal_created'
  | 'goal_completed'
  | 'goal_updated'
  | 'goal_deleted'
  | 'streak_achieved'
  | 'goals_loaded';

type EventProperties = Record<string, string | number | boolean>;

export function useAnalytics() {
  const logEvent = (eventName: EventName, properties?: EventProperties) => {
    // Implement your analytics logging here
    console.log(`Analytics Event: ${eventName}`, properties);
  };

  const logError = (error: Error, context?: string) => {
    // Implement your error logging here
    console.error(`Error in ${context}:`, error);
  };

  return { logEvent, logError };
} 