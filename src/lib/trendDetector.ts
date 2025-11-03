import axios from 'axios';
import NodeCache from 'node-cache';
import { ContentGenerator } from './contentGenerator';

interface Trend {
  keyword: string;
  volume: number;
  interest_over_time: { date: string; value: number }[];
  related_searches: string[];
}

interface ScheduledPost {
  id: string;
  content: string;
  scheduledTime: Date;
  platform: string;
  status: 'pending' | 'published' | 'failed';
  error?: string;
}

interface BatchProcessConfig {
  batchSize: number;
  maxRetries: number;
  delayBetweenBatches: number; // ms
  timeoutPerRequest: number; // ms
}

export class TrendDetector {
  private contentGenerator: ContentGenerator;
  private cache: NodeCache;
  private scheduledPosts: Map<string, ScheduledPost> = new Map();
  private batchConfig: BatchProcessConfig = {
    batchSize: 10,
    maxRetries: 3,
    delayBetweenBatches: 2000,
    timeoutPerRequest: 10000,
  };

  constructor() {
    this.contentGenerator = new ContentGenerator();
    this.cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache
  }

  /**
   * Fetch trending keywords from Google Trends API
   */
  async fetchTrendingKeywords(region: string = 'US'): Promise<Trend[]> {
    const cacheKey = `trends_${region}`;
    const cached = this.cache.get<Trend[]>(cacheKey);

    if (cached) {
      console.log(`[TrendDetector] Fetching trends from cache for ${region}`);
      return cached;
    }

    try {
      console.log(`[TrendDetector] Fetching trending keywords for region: ${region}`);

      // Using Google Trends Unofficial API (pytrends wrapper)
      // In production, use official Google Trends API
      const response = await axios.get(
        `https://trends.google.com/trends/api/dailytrends?hl=en-US&geo=${region}`,
        {
          timeout: this.batchConfig.timeoutPerRequest,
          headers: {
            'User-Agent': 'FastMVP-TrendDetector/1.0',
          },
        }
      );

      // Parse response (Google returns )]}' prefix)
      const jsonStr = response.data.replace(/^\)\]\}'\n/, '');
      const data = JSON.parse(jsonStr);

      const trends: Trend[] = data.default.trendingSearchesDays[0].trendingSearches.map(
        (trend: any) => ({
          keyword: trend.title.query,
          volume: trend.formattedTraffic.replace('+', '').replace('K', '000'),
          interest_over_time: [],
          related_searches: trend.relatedQueries.map((q: any) => q.query),
        })
      );

      this.cache.set(cacheKey, trends);
      return trends;
    } catch (error) {
      console.error('[TrendDetector] Error fetching trends:', error);
      throw new Error(`Failed to fetch trends for region ${region}`);
    }
  }

  /**
   * Generate content for Mode B (Automatic Content Generation based on Trends)
   */
  async generateContentForTrends(
    trends: Trend[],
    modeB: boolean = true
  ): Promise<{ content: string; trend: Trend }[]> {
    if (!modeB) {
      throw new Error('Mode B must be enabled for trend-based content generation');
    }

    console.log(`[TrendDetector] Generating content for ${trends.length} trends`);

    const generatedContent: { content: string; trend: Trend }[] = [];

    // Process trends in batches
    for (let i = 0; i < trends.length; i += this.batchConfig.batchSize) {
      const batch = trends.slice(i, i + this.batchConfig.batchSize);
      const batchPromises = batch.map(async (trend) => {
        try {
          const content = await this.contentGenerator.generate({
            topic: trend.keyword,
            platform: 'twitter', // Default, can be parameterized
            trendVolume: trend.volume,
            relatedSearches: trend.related_searches.slice(0, 3),
          });

          return {
            content,
            trend,
          };
        } catch (error) {
          console.error(`[TrendDetector] Failed to generate content for trend: ${trend.keyword}`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      generatedContent.push(...batchResults.filter((r) => r !== null));

      // Delay between batches to avoid rate limiting
      if (i + this.batchConfig.batchSize < trends.length) {
        await this.delay(this.batchConfig.delayBetweenBatches);
      }
    }

    return generatedContent;
  }

  /**
   * Schedule a post for later publication
   */
  async schedulePost(
    content: string,
    scheduledTime: Date,
    platform: string = 'twitter'
  ): Promise<ScheduledPost> {
    const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const scheduledPost: ScheduledPost = {
      id,
      content,
      scheduledTime,
      platform,
      status: 'pending',
    };

    this.scheduledPosts.set(id, scheduledPost);
    console.log(`[TrendDetector] Post scheduled: ${id} for ${scheduledTime.toISOString()}`);

    // Schedule execution
    this.scheduleExecution(scheduledPost);

    return scheduledPost;
  }

  /**
   * Schedule batch posts for later publication
   */
  async scheduleBatchPosts(
    posts: Array<{ content: string; scheduledTime: Date; platform?: string }>
  ): Promise<ScheduledPost[]> {
    console.log(`[TrendDetector] Scheduling ${posts.length} posts in batch`);

    const scheduledPosts = await Promise.all(
      posts.map((post) =>
        this.schedulePost(post.content, post.scheduledTime, post.platform || 'twitter')
      )
    );

    return scheduledPosts;
  }

  /**
   * Process scheduled posts with retry logic
   */
  private async scheduleExecution(scheduledPost: ScheduledPost): Promise<void> {
    const now = new Date();
    const delay = scheduledPost.scheduledTime.getTime() - now.getTime();

    if (delay <= 0) {
      await this.publishPost(scheduledPost);
      return;
    }

    setTimeout(async () => {
      await this.publishPost(scheduledPost);
    }, delay);
  }

  /**
   * Publish a post with retry logic
   */
  private async publishPost(scheduledPost: ScheduledPost, retryCount: number = 0): Promise<void> {
    try {
      console.log(
        `[TrendDetector] Publishing post: ${scheduledPost.id} to ${scheduledPost.platform}`
      );

      // Simulate API call to platform
      // In production, integrate with actual platform APIs
      const success = await this.publishToPlatform(
        scheduledPost.content,
        scheduledPost.platform
      );

      if (success) {
        scheduledPost.status = 'published';
        console.log(`[TrendDetector] Post published successfully: ${scheduledPost.id}`);
      } else {
        throw new Error('Platform API returned failure');
      }
    } catch (error) {
      console.error(
        `[TrendDetector] Error publishing post: ${scheduledPost.id}`,
        error
      );

      if (retryCount < this.batchConfig.maxRetries) {
        console.log(
          `[TrendDetector] Retrying post publication (${retryCount + 1}/${this.batchConfig.maxRetries})`
        );
        await this.delay(2000 * (retryCount + 1)); // Exponential backoff
        await this.publishPost(scheduledPost, retryCount + 1);
      } else {
        scheduledPost.status = 'failed';
        scheduledPost.error = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[TrendDetector] Post failed after ${this.batchConfig.maxRetries} retries`);
      }
    }
  }

  /**
   * Publish to platform (placeholder for actual implementation)
   */
  private async publishToPlatform(content: string, platform: string): Promise<boolean> {
    // This would integrate with actual platform APIs (Twitter, Instagram, LinkedIn, etc.)
    // For now, returning success
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[TrendDetector] Published to ${platform}: ${content.substring(0, 50)}...`);
        resolve(true);
      }, 100);
    });
  }

  /**
   * Get scheduled posts status
   */
  getScheduledPostsStatus(): ScheduledPost[] {
    return Array.from(this.scheduledPosts.values());
  }

  /**
   * Get scheduled posts by status
   */
  getPostsByStatus(status: 'pending' | 'published' | 'failed'): ScheduledPost[] {
    return Array.from(this.scheduledPosts.values()).filter((post) => post.status === status);
  }

  /**
   * Update batch configuration
   */
  updateBatchConfig(config: Partial<BatchProcessConfig>): void {
    this.batchConfig = { ...this.batchConfig, ...config };
    console.log('[TrendDetector] Batch configuration updated:', this.batchConfig);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.flushAll();
    console.log('[TrendDetector] Cache cleared');
  }

  /**
   * Utility function to delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default TrendDetector;
