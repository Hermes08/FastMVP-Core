import { OpenAI } from 'openai';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ContentTemplate {
  id: string;
  niche: string;
  structure: string[];
  tone: 'professional' | 'casual' | 'educational' | 'promotional';
  seoKeywords: string[];
  minWords: number;
  maxWords: number;
}

export interface SeoOptimization {
  title: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  slugUrl: string;
  readabilityScore: number;
}

export interface GeneratedContent {
  title: string;
  content: string;
  seo: SeoOptimization;
  niche: string;
  generatedAt: Date;
  model: 'openai' | 'claude';
}

export interface ContentRequest {
  topic: string;
  niche: 'tech' | 'health' | 'finance' | 'lifestyle' | 'business' | 'marketing';
  tone?: 'professional' | 'casual' | 'educational' | 'promotional';
  keywords?: string[];
  maxTokens?: number;
}

// ============================================================================
// NICHE-BASED TEMPLATES
// ============================================================================

const NICHE_TEMPLATES: Record<string, ContentTemplate> = {
  tech: {
    id: 'tech-001',
    niche: 'technology',
    structure: [
      'hook',
      'problem_statement',
      'technical_overview',
      'implementation_guide',
      'best_practices',
      'common_pitfalls',
      'conclusion',
    ],
    tone: 'professional',
    seoKeywords: ['how to', 'guide', 'tutorial', 'implementation'],
    minWords: 1500,
    maxWords: 3000,
  },
  health: {
    id: 'health-001',
    niche: 'health',
    structure: [
      'introduction',
      'medical_background',
      'symptoms_overview',
      'treatment_options',
      'lifestyle_changes',
      'when_to_seek_help',
      'conclusion',
    ],
    tone: 'educational',
    seoKeywords: ['health', 'wellness', 'symptoms', 'treatment'],
    minWords: 1200,
    maxWords: 2500,
  },
  finance: {
    id: 'finance-001',
    niche: 'finance',
    structure: [
      'market_context',
      'financial_overview',
      'investment_options',
      'risk_analysis',
      'strategies',
      'case_studies',
      'conclusion',
    ],
    tone: 'professional',
    seoKeywords: ['investment', 'financial', 'money', 'returns'],
    minWords: 1800,
    maxWords: 3500,
  },
  lifestyle: {
    id: 'lifestyle-001',
    niche: 'lifestyle',
    structure: [
      'relatable_intro',
      'why_it_matters',
      'step_by_step_guide',
      'tips_and_tricks',
      'before_after',
      'personal_stories',
      'call_to_action',
    ],
    tone: 'casual',
    seoKeywords: ['how to', 'tips', 'guide', 'lifestyle'],
    minWords: 1000,
    maxWords: 2000,
  },
  business: {
    id: 'business-001',
    niche: 'business',
    structure: [
      'business_context',
      'market_analysis',
      'strategy_overview',
      'implementation_steps',
      'metrics_kpis',
      'success_stories',
      'next_steps',
    ],
    tone: 'professional',
    seoKeywords: ['business', 'strategy', 'growth', 'success'],
    minWords: 1600,
    maxWords: 3000,
  },
  marketing: {
    id: 'marketing-001',
    niche: 'marketing',
    structure: [
      'audience_insight',
      'problem_statement',
      'marketing_strategies',
      'channel_tactics',
      'content_calendar',
      'measurement_framework',
      'conclusion',
    ],
    tone: 'promotional',
    seoKeywords: ['marketing', 'strategy', 'growth', 'engagement'],
    minWords: 1400,
    maxWords: 2800,
  },
};

// ============================================================================
// SEO OPTIMIZATION ENGINE
// ============================================================================

class SeoOptimizer {
  /**
   * Calculates readability score based on Flesch Reading Ease
   */
  static calculateReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const syllables = this.countSyllables(text);

    const score =
      206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Estimates syllable count (simplified)
   */
  private static countSyllables(text: string): number {
    const words = text.match(/\b\w+\b/g) || [];
    let count = 0;
    const vowels = 'aeiouy';
    const consonants = 'bcdfghjklmnpqrstvwxz';

    for (const word of words) {
      let vowelGroup = false;
      let syllableCount = 0;

      for (const char of word.toLowerCase()) {
        if (vowels.includes(char)) {
          if (!vowelGroup) {
            syllableCount++;
            vowelGroup = true;
          }
        } else if (consonants.includes(char)) {
          vowelGroup = false;
        }
      }

      if (word.toLowerCase().endsWith('e')) syllableCount--;
      if (word.toLowerCase().endsWith('le')) syllableCount++;

      count += Math.max(1, syllableCount);
    }

    return count;
  }

  /**
   * Generates SEO-optimized metadata
   */
  static generateSeoMetadata(
    title: string,
    content: string,
    keywords: string[]
  ): SeoOptimization {
    const metaDescription = this.generateMetaDescription(title, content);
    const slug = this.generateSlug(title);
    const h1 = `${title}`;
    const readabilityScore = this.calculateReadabilityScore(content);

    return {
      title,
      metaDescription,
      keywords,
      h1,
      slugUrl: slug,
      readabilityScore,
    };
  }

  /**
   * Generates meta description (155-160 chars)
   */
  private static generateMetaDescription(
    title: string,
    content: string
  ): string {
    const firstSentence = content.split(/[.!?]+/)[0];
    const description = `${title} - ${firstSentence}`.substring(0, 160);
    return description.endsWith('.') ? description : description + '...';
  }

  /**
   * Generates URL slug
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

// ============================================================================
// CONTENT GENERATOR ENGINE
// ============================================================================

export class ContentGenerator {
  private client: OpenAI;
  private templates: Map<string, ContentTemplate>;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
    this.templates = new Map(Object.entries(NICHE_TEMPLATES));
  }

  /**
   * Generates content using template-based AI generation
   */
  async generateContent(request: ContentRequest): Promise<GeneratedContent> {
    const template = this.templates.get(request.niche);
    if (!template) {
      throw new Error(`Unknown niche: ${request.niche}`);
    }

    const prompt = this.buildPrompt(request, template);

    const response = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: request.maxTokens || 2000,
      temperature: 0.7,
    });

    const content =
      response.choices[0]?.message?.content || 'Content generation failed';
    const title = this.extractTitle(content, request.topic);

    const seo = SeoOptimizer.generateSeoMetadata(
      title,
      content,
      request.keywords || template.seoKeywords
    );

    return {
      title,
      content,
      seo,
      niche: request.niche,
      generatedAt: new Date(),
      model: 'openai',
    };
  }

  /**
   * Builds AI prompt from template
   */
  private buildPrompt(request: ContentRequest, template: ContentTemplate): string {
    const tone = request.tone || template.tone;
    const keywords = request.keywords || template.seoKeywords;
    const structure = template.structure.join(', ');

    return `You are an expert content writer specializing in ${template.niche} topics.

Generate a comprehensive article about: "${request.topic}"

Requirements:
- Tone: ${tone}
- Include sections for: ${structure}
- Word count: between ${template.minWords} and ${template.maxWords} words
- Incorporate these SEO keywords naturally: ${keywords.join(', ')}
- Start with a compelling title
- Use clear headings and subheadings
- Ensure content is unique, engaging, and informative
- Optimize for search engines without sacrificing readability
- Include practical tips or actionable advice
- End with a strong conclusion or call-to-action

Format the output with markdown headings (# for main title, ## for sections).`;
  }

  /**
   * Extracts title from generated content
   */
  private extractTitle(content: string, topic: string): string {
    const titleMatch = content.match(/^#\s+(.+)/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    return `${topic} - Complete Guide`;
  }

  /**
   * Batch generates content for multiple topics
   */
  async generateBatch(
    requests: ContentRequest[]
  ): Promise<GeneratedContent[]> {
    const results = await Promise.all(
      requests.map((req) => this.generateContent(req))
    );
    return results;
  }

  /**
   * Optimizes existing content for SEO
   */
  optimizeForSeo(
    title: string,
    content: string,
    keywords: string[]
  ): SeoOptimization {
    return SeoOptimizer.generateSeoMetadata(title, content, keywords);
  }

  /**
   * Gets template for a specific niche
   */
  getTemplate(niche: string): ContentTemplate | undefined {
    return this.templates.get(niche);
  }

  /**
   * Lists all available niches
   */
  getAvailableNiches(): string[] {
    return Array.from(this.templates.keys());
  }
}

// ============================================================================
// EXPORT SINGLETON FOR EASY ACCESS
// ============================================================================

let generatorInstance: ContentGenerator | null = null;

export function initializeContentGenerator(apiKey: string): ContentGenerator {
  if (!generatorInstance) {
    generatorInstance = new ContentGenerator(apiKey);
  }
  return generatorInstance;
}

export function getContentGenerator(): ContentGenerator {
  if (!generatorInstance) {
    throw new Error('ContentGenerator not initialized. Call initializeContentGenerator() first.');
  }
  return generatorInstance;
}
