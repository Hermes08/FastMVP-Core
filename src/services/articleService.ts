import { PrismaClient, Article, Author } from '@prisma/client';

const prisma = new PrismaClient();

export class ArticleService {
  /**
   * Create a new article
   */
  static async createArticle(
    title: string,
    content: string,
    authorId: number,
    userId: number,
    image?: string
  ): Promise<Article> {
    return prisma.article.create({
      data: {
        title,
        content,
        image,
        authorId,
        userId,
      },
      include: { author: true, user: true },
    });
  }

  /**
   * Get article by ID
   */
  static async getArticleById(id: number): Promise<Article | null> {
    return prisma.article.findUnique({
      where: { id },
      include: { author: true, user: true },
    });
  }

  /**
   * Get all articles with pagination
   */
  static async getAllArticles(limit: number = 10, offset: number = 0, published?: boolean): Promise<Article[]> {
    return prisma.article.findMany({
      where: published !== undefined ? { published } : {},
      take: limit,
      skip: offset,
      include: { author: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get articles by author
   */
  static async getArticlesByAuthor(authorId: number, limit: number = 10, offset: number = 0): Promise<Article[]> {
    return prisma.article.findMany({
      where: { authorId },
      take: limit,
      skip: offset,
      include: { author: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update article
   */
  static async updateArticle(id: number, data: Partial<Omit<Article, 'id' | 'createdAt'>>): Promise<Article> {
    return prisma.article.update({
      where: { id },
      data,
      include: { author: true, user: true },
    });
  }

  /**
   * Delete article
   */
  static async deleteArticle(id: number): Promise<Article> {
    return prisma.article.delete({
      where: { id },
    });
  }

  /**
   * Publish article
   */
  static async publishArticle(id: number): Promise<Article> {
    return prisma.article.update({
      where: { id },
      data: { published: true },
      include: { author: true, user: true },
    });
  }

  /**
   * Increment views
   */
  static async incrementViews(id: number): Promise<Article> {
    return prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  /**
   * Count articles
   */
  static async countArticles(published?: boolean): Promise<number> {
    return prisma.article.count({
      where: published !== undefined ? { published } : {},
    });
  }
}
