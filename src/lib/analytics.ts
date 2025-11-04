import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AnalyticsEvent = 
  | 'project_created'
  | 'feature_selected'
  | 'template_used'
  | 'api_key_created'
  | 'deployment_started'
  | 'deployment_completed'
  | 'error_occurred'
  | 'user_login'
  | 'user_logout'
  | 'content_generated'
  | 'ai_feature_used'
  | 'github_integration_connected'
  | 'trend_detected'
  | 'notification_sent';

export interface AnalyticsData {
  event: AnalyticsEvent;
  userId?: string;
  projectId?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
}

/**
 * Log an analytics event to Supabase
 * @param data - Analytics event data
 * @returns Promise with the logged event or error
 */
export async function logEvent(data: AnalyticsData) {
  try {
    const eventData = {
      event: data.event,
      user_id: data.userId || null,
      project_id: data.projectId || null,
      metadata: data.metadata || {},
      timestamp: data.timestamp || new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const { data: result, error } = await supabase
      .from('analytics')
      .insert(eventData)
      .select()
      .single();

    if (error) {
      console.error('Error logging analytics event:', error);
      return { success: false, error };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Exception logging analytics event:', error);
    return { success: false, error };
  }
}

/**
 * Log project creation event
 */
export async function logProjectCreated(userId: string, projectId: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'project_created',
    userId,
    projectId,
    metadata,
  });
}

/**
 * Log feature selection event
 */
export async function logFeatureSelected(userId: string, projectId: string, feature: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'feature_selected',
    userId,
    projectId,
    metadata: { feature, ...metadata },
  });
}

/**
 * Log template usage event
 */
export async function logTemplateUsed(userId: string, projectId: string, templateName: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'template_used',
    userId,
    projectId,
    metadata: { templateName, ...metadata },
  });
}

/**
 * Log API key creation event
 */
export async function logApiKeyCreated(userId: string, service: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'api_key_created',
    userId,
    metadata: { service, ...metadata },
  });
}

/**
 * Log deployment started event
 */
export async function logDeploymentStarted(userId: string, projectId: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'deployment_started',
    userId,
    projectId,
    metadata,
  });
}

/**
 * Log deployment completed event
 */
export async function logDeploymentCompleted(userId: string, projectId: string, success: boolean, metadata?: Record<string, any>) {
  return logEvent({
    event: 'deployment_completed',
    userId,
    projectId,
    metadata: { success, ...metadata },
  });
}

/**
 * Log error event
 */
export async function logError(userId: string | undefined, error: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'error_occurred',
    userId,
    metadata: { error, ...metadata },
  });
}

/**
 * Log user login event
 */
export async function logUserLogin(userId: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'user_login',
    userId,
    metadata,
  });
}

/**
 * Log user logout event
 */
export async function logUserLogout(userId: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'user_logout',
    userId,
    metadata,
  });
}

/**
 * Log content generation event
 */
export async function logContentGenerated(userId: string, projectId: string, contentType: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'content_generated',
    userId,
    projectId,
    metadata: { contentType, ...metadata },
  });
}

/**
 * Log AI feature usage event
 */
export async function logAiFeatureUsed(userId: string, feature: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'ai_feature_used',
    userId,
    metadata: { feature, ...metadata },
  });
}

/**
 * Log GitHub integration connection event
 */
export async function logGithubIntegrationConnected(userId: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'github_integration_connected',
    userId,
    metadata,
  });
}

/**
 * Log trend detection event
 */
export async function logTrendDetected(trend: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'trend_detected',
    metadata: { trend, ...metadata },
  });
}

/**
 * Log notification sent event
 */
export async function logNotificationSent(userId: string, notificationType: string, metadata?: Record<string, any>) {
  return logEvent({
    event: 'notification_sent',
    userId,
    metadata: { notificationType, ...metadata },
  });
}

/**
 * Batch log multiple events
 * @param events - Array of analytics events to log
 * @returns Promise with batch insert results
 */
export async function logEventsBatch(events: AnalyticsData[]) {
  try {
    const eventsData = events.map(data => ({
      event: data.event,
      user_id: data.userId || null,
      project_id: data.projectId || null,
      metadata: data.metadata || {},
      timestamp: data.timestamp || new Date().toISOString(),
      created_at: new Date().toISOString(),
    }));

    const { data: result, error } = await supabase
      .from('analytics')
      .insert(eventsData)
      .select();

    if (error) {
      console.error('Error batch logging analytics events:', error);
      return { success: false, error };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Exception batch logging analytics events:', error);
    return { success: false, error };
  }
}

/**
 * Get analytics events for a user
 * @param userId - User ID to fetch events for
 * @param limit - Maximum number of events to return
 * @returns Promise with analytics events
 */
export async function getUserAnalytics(userId: string, limit: number = 100) {
  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user analytics:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching user analytics:', error);
    return { success: false, error };
  }
}

/**
 * Get analytics events for a project
 * @param projectId - Project ID to fetch events for
 * @param limit - Maximum number of events to return
 * @returns Promise with analytics events
 */
export async function getProjectAnalytics(projectId: string, limit: number = 100) {
  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching project analytics:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching project analytics:', error);
    return { success: false, error };
  }
}

/**
 * Get analytics event counts by event type
 * @param startDate - Start date for the query (ISO string)
 * @param endDate - End date for the query (ISO string)
 * @returns Promise with event counts
 */
export async function getEventCounts(startDate?: string, endDate?: string) {
  try {
    let query = supabase
      .from('analytics')
      .select('event, count');

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching event counts:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching event counts:', error);
    return { success: false, error };
  }
}
