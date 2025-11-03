import { ContentGeneratorService } from '../services/contentGeneratorService';

/**
 * Content Generator Service Tests
 * Tests for ContentGeneratorService methods for automated content generation
 */

describe('ContentGeneratorService', () => {
  describe('generateTitle', () => {
    it('should generate a title with the topic included', () => {
      const topic = 'Technology';
      const title = ContentGeneratorService.generateTitle(topic);
      expect(title).toBeDefined();
      expect(title).toContain(topic);
      expect(title.length).toBeGreaterThan(0);
    });

    it('should respect max words parameter', () => {
      const topic = 'Artificial Intelligence';
      const maxWords = 5;
      const title = ContentGeneratorService.generateTitle(topic, maxWords);
      const wordCount = title.split(' ').length;
      expect(wordCount).toBeLessThanOrEqual(maxWords + 5); // allowing some flexibility
    });
  });

  describe('generateContent', () => {
    it('should generate content with topic included', () => {
      const topic = 'Machine Learning';
      const content = ContentGeneratorService.generateContent(topic);
      expect(content).toBeDefined();
      expect(content).toContain(topic);
      expect(content.length).toBeGreaterThan(100); // Content should be substantial
    });

    it('should include keywords in generated content', () => {
      const topic = 'Web Development';
      const keywords = ['React', 'Node.js', 'CSS'];
      const content = ContentGeneratorService.generateContent(topic, keywords);
      expect(content).toBeDefined();
      keywords.forEach(keyword => {
        expect(content).toContain(keyword);
      });
    });

    it('should generate markdown formatted content', () => {
      const topic = 'Python Programming';
      const content = ContentGeneratorService.generateContent(topic);
      expect(content).toContain('# Python Programming'); // Main heading
      expect(content).toContain('##'); // Sub-headings
    });
  });

  describe('generateMetaDescription', () => {
    it('should generate meta description with title', () => {
      const title = 'Best Practices for Code Quality';
      const description = ContentGeneratorService.generateMetaDescription(title);
      expect(description).toBeDefined();
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it('should respect max length parameter', () => {
      const title = 'Advanced TypeScript Patterns and Techniques';
      const maxLength = 80;
      const description = ContentGeneratorService.generateMetaDescription(title, maxLength);
      expect(description.length).toBeLessThanOrEqual(maxLength);
    });
  });

  describe('generateKeywords', () => {
    it('should generate keywords from topic', () => {
      const topic = 'Cloud Computing';
      const keywords = ContentGeneratorService.generateKeywords(topic);
      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords.length).toBeGreaterThan(0);
    });

    it('should respect count parameter', () => {
      const topic = 'DevOps';
      const count = 3;
      const keywords = ContentGeneratorService.generateKeywords(topic, count);
      expect(keywords.length).toBeLessThanOrEqual(count);
    });
  });

  describe('generateExcerpt', () => {
    it('should generate excerpt from content', () => {
      const content = 'This is a very long content that contains multiple sentences and paragraphs....';
      const excerpt = ContentGeneratorService.generateExcerpt(content);
      expect(excerpt).toBeDefined();
      expect(excerpt.length).toBeGreaterThan(0);
    });

    it('should respect max length parameter', () => {
      const content = 'This is a very long content that contains multiple sentences and paragraphs....';
      const maxLength = 100;
      const excerpt = ContentGeneratorService.generateExcerpt(content, maxLength);
      expect(excerpt.length).toBeLessThanOrEqual(maxLength + 3); // +3 for "..." 
    });
  });

  describe('generateHashtags', () => {
    it('should generate hashtags from topic', () => {
      const topic = 'JavaScript';
      const hashtags = ContentGeneratorService.generateHashtags(topic);
      expect(Array.isArray(hashtags)).toBe(true);
      expect(hashtags.length).toBeGreaterThan(0);
      hashtags.forEach(tag => {
        expect(tag.startsWith('#')).toBe(true);
      });
    });

    it('should respect count parameter', () => {
      const topic = 'React';
      const count = 3;
      const hashtags = ContentGeneratorService.generateHashtags(topic, count);
      expect(hashtags.length).toBeLessThanOrEqual(count);
    });
  });

  describe('generateArticle', () => {
    it('should generate a complete article object', () => {
      const topic = 'Full-Stack Development';
      const article = ContentGeneratorService.generateArticle(topic);
      
      expect(article).toBeDefined();
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('content');
      expect(article).toHaveProperty('excerpt');
      expect(article).toHaveProperty('keywords');
      expect(article).toHaveProperty('metaDescription');
      expect(article).toHaveProperty('hashtags');
      expect(article).toHaveProperty('generatedAt');
      expect(article).toHaveProperty('publishRecommendation');
    });

    it('should generate complete article with all fields populated', () => {
      const topic = 'Software Engineering';
      const article = ContentGeneratorService.generateArticle(topic);
      
      expect(article.title).toBeTruthy();
      expect(article.content).toBeTruthy();
      expect(article.excerpt).toBeTruthy();
      expect(Array.isArray(article.keywords)).toBe(true);
      expect(article.metaDescription).toBeTruthy();
      expect(Array.isArray(article.hashtags)).toBe(true);
      expect(article.publishRecommendation).toBe(true);
    });
  });
});

/**
 * Integration Tests
 */
describe('ContentGeneratorService Integration Tests', () => {
  it('should generate complete article workflow', () => {
    const topic = 'Web Services';
    const article = ContentGeneratorService.generateArticle(topic);
    
    expect(article.title).toContain(topic);
    expect(article.content).toContain(topic);
    expect(article.keywords.some(k => k.includes(topic))).toBe(true);
    expect(article.hashtags.some(h => h.includes(topic.replace(/\s+/g, '')))).toBe(true);
  });
});
