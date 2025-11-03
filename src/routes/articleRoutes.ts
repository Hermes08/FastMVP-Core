import express, { Router, Request, Response } from 'express';
import { ArticleService } from '../services/articleService';

const router = Router();

/**
 * POST /api/articles
 * Create a new article
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, content, authorId, userId, image } = req.body;
    if (!title || !content || !authorId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const article = await ArticleService.createArticle(title, content, authorId, userId, image);
    res.status(201).json(article);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/articles
 * Get all articles with pagination and filtering
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const published = req.query.published === 'true' ? true : undefined;
    const articles = await ArticleService.getAllArticles(limit, offset, published);
    const total = await ArticleService.countArticles(published);
    res.json({ data: articles, total, limit, offset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/articles/:id
 * Get article by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await ArticleService.getArticleById(parseInt(id));
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    // Increment views
    await ArticleService.incrementViews(parseInt(id));
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/articles/author/:authorId
 * Get articles by author
 */
router.get('/author/:authorId', async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const articles = await ArticleService.getArticlesByAuthor(parseInt(authorId), limit, offset);
    res.json({ data: articles });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/articles/:id
 * Update article
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const article = await ArticleService.updateArticle(parseInt(id), updateData);
    res.json(article);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/articles/:id
 * Delete article
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await ArticleService.deleteArticle(parseInt(id));
    res.json({ message: 'Article deleted', article });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/articles/:id/publish
 * Publish article
 */
router.post('/:id/publish', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await ArticleService.publishArticle(parseInt(id));
    res.json(article);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
