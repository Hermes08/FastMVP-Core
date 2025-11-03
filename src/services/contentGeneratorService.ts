export class ContentGeneratorService {
  /**
   * Generate a title for an article
   */
  static generateTitle(topic: string, maxWords: number = 10): string {
    const titles = [
      `Discover the Latest Trends in ${topic}`,
      `Everything You Need to Know About ${topic}`,
      `The Ultimate Guide to ${topic}`,
      `${topic}: What You Need to Know`,
      `Mastering ${topic}: A Comprehensive Guide`,
      `${topic} 101: Getting Started`,
      `Top 10 Tips for ${topic}`,
      `The Future of ${topic}`,
      `How to Succeed in ${topic}`,
      `${topic} for Beginners: What to Know`,
    ];
    const randomIndex = Math.floor(Math.random() * titles.length);
    return titles[randomIndex];
  }

  /**
   * Generate article content based on topic and keywords
   */
  static generateContent(topic: string, keywords: string[] = []): string {
    const sections = [
      `Introduction to ${topic}`,
      `Key Concepts in ${topic}`,
      `Benefits of Understanding ${topic}`,
      `Common Misconceptions About ${topic}`,
      `Best Practices for ${topic}`,
      `Future Trends in ${topic}`,
    ];

    let content = `# ${topic}\n\n`;

    content += `## Introduction\n`;
    content += `${topic} is an important concept that has gained significant attention in recent times. This comprehensive guide will provide you with insights and knowledge about ${topic}.\n\n`;

    sections.forEach((section, index) => {
      content += `## ${section}\n`;
      content += `This section covers essential information about ${section.toLowerCase()}. `;
      if (keywords.length > 0) {
        content += `Key points include: ${keywords.slice(0, 3).join(', ')}.`;
      }
      content += `\n\n`;
    });

    content += `## Conclusion\n`;
    content += `Understanding ${topic} is crucial for success in today's world. We hope this guide has provided you with valuable information and insights.\n`;

    return content;
  }

  /**
   * Generate meta description
   */
  static generateMetaDescription(title: string, maxLength: number = 160): string {
    const base = `Learn about ${title}. Comprehensive guide with tips, tricks, and best practices.`;
    return base.substring(0, maxLength);
  }

  /**
   * Generate keywords from topic
   */
  static generateKeywords(topic: string, count: number = 5): string[] {
    const keywordTemplates = [
      `${topic}`,
      `${topic} guide`,
      `${topic} tips`,
      `${topic} tutorial`,
      `${topic} best practices`,
      `learn ${topic}`,
      `${topic} for beginners`,
      `${topic} advanced`,
      `${topic} trends`,
      `${topic} news`,
    ];

    const keywords: string[] = [];
    for (let i = 0; i < Math.min(count, keywordTemplates.length); i++) {
      keywords.push(keywordTemplates[i]);
    }
    return keywords;
  }

  /**
   * Generate article excerpt/summary
   */
  static generateExcerpt(content: string, maxLength: number = 200): string {
    let excerpt = content.split('\n').find(line => line.trim().length > 0 && !line.startsWith('#')) || '';
    if (excerpt.length > maxLength) {
      excerpt = excerpt.substring(0, maxLength) + '...';
    }
    return excerpt;
  }

  /**
   * Generate hashtags for article
   */
  static generateHashtags(topic: string, count: number = 5): string[] {
    const hashtags = [
      `#${topic.replace(/\s+/g, '')}`,
      `#${topic.split(' ')[0]}`,
      `#Learn`,
      `#Guide`,
      `#Tutorial`,
      `#Tips`,
      `#Trending`,
      `#Content`,
    ];

    return hashtags.slice(0, count);
  }

  /**
   * Generate a complete article object
   */
  static generateArticle(topic: string, includeImage: boolean = true): object {
    const title = this.generateTitle(topic);
    const keywords = this.generateKeywords(topic);
    const content = this.generateContent(topic, keywords);
    const excerpt = this.generateExcerpt(content);
    const metaDescription = this.generateMetaDescription(title);
    const hashtags = this.generateHashtags(topic);

    return {
      title,
      content,
      excerpt,
      keywords,
      metaDescription,
      hashtags,
      generatedAt: new Date().toISOString(),
      publishRecommendation: true,
    };
  }
}
