import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Redis client configuration
// TODO: Configure these environment variables in your .env file:
// - UPSTASH_REDIS_REST_URL
// - UPSTASH_REDIS_REST_TOKEN
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Rate limiter configuration: 5 requests per hour per IP
// for project generation endpoints
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

// Endpoints that require rate limiting
const RATE_LIMITED_ENDPOINTS = [
  '/api/generate',
  '/api/project/generate',
  '/api/builder/generate',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path matches any rate-limited endpoint
  const shouldRateLimit = RATE_LIMITED_ENDPOINTS.some((endpoint) =>
    pathname.startsWith(endpoint)
  );

  if (shouldRateLimit) {
    // Get IP address from request
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous';

    try {
      // Check rate limit
      const { success, limit, reset, remaining } = await ratelimit.limit(
        `ratelimit_${ip}`
      );

      // Add rate limit headers to response
      const response = success
        ? NextResponse.next()
        : NextResponse.json(
            {
              error: 'Too many requests',
              message: 'Rate limit exceeded. Please try again later.',
            },
            { status: 429 }
          );

      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', reset.toString());

      return response;
    } catch (error) {
      // If Redis is not configured or fails, allow the request to proceed
      // This prevents breaking the app if Redis is unavailable
      console.error('Rate limiting error:', error);
      return NextResponse.next();
    }
  }

  // Continue for non-rate-limited endpoints
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all API routes that need rate limiting
    '/api/generate/:path*',
    '/api/project/generate/:path*',
    '/api/builder/generate/:path*',
  ],
};
