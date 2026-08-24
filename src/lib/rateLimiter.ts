interface TokenBucket {
  tokens: number;
  lastRefillTime: number;
}

class InMemoryRateLimiter {
  private ipBuckets = new Map<string, TokenBucket>();
  private maxCapacity: number;
  private refillRatePerMs: number;
  private cleanupIntervalMs: number;
  private lastCleanupTime: number;

  /**
   * @param limitRequests Number of requests allowed in the window
   * @param windowMs Time window in milliseconds (e.g., 60000 for 1 minute)
   */
  constructor(limitRequests: number = 5, windowMs: number = 60000) {
    this.maxCapacity = limitRequests;
    // Calculate how many tokens are refilled per millisecond
    this.refillRatePerMs = limitRequests / windowMs;
    this.cleanupIntervalMs = 15 * 60 * 1000; // 15 minutes cleanup interval
    this.lastCleanupTime = Date.now();
  }

  /**
   * Checks if a request from the given IP should be allowed.
   * If allowed, consumes 1 token.
   */
  public limit(ip: string): { allowed: boolean; remaining: number; retryAfterSec: number } {
    const now = Date.now();
    this.periodicCleanup(now);

    let bucket = this.ipBuckets.get(ip);

    if (!bucket) {
      // First request from this IP: initialize with full capacity minus 1 (for current request)
      bucket = {
        tokens: this.maxCapacity - 1,
        lastRefillTime: now,
      };
      this.ipBuckets.set(ip, bucket);
      return { allowed: true, remaining: this.maxCapacity - 1, retryAfterSec: 0 };
    }

    // Calculate elapsed time and refill tokens
    const elapsedMs = now - bucket.lastRefillTime;
    const refilledTokens = elapsedMs * this.refillRatePerMs;
    const updatedTokens = Math.min(this.maxCapacity, bucket.tokens + refilledTokens);

    bucket.lastRefillTime = now;

    if (updatedTokens >= 1.0) {
      // Allow request, consume 1 token
      bucket.tokens = updatedTokens - 1.0;
      this.ipBuckets.set(ip, bucket);
      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        retryAfterSec: 0,
      };
    } else {
      // Rate limited, keep remaining tokens unchanged (or save the refilled value)
      bucket.tokens = updatedTokens;
      this.ipBuckets.set(ip, bucket);

      // Estimate seconds until at least 1 token is refilled
      const tokensNeeded = 1.0 - updatedTokens;
      const msNeeded = tokensNeeded / this.refillRatePerMs;
      const retryAfterSec = Math.ceil(msNeeded / 1000);

      return {
        allowed: false,
        remaining: 0,
        retryAfterSec,
      };
    }
  }

  /**
   * Purges old IP buckets that have not been active for a while to avoid memory leaks.
   */
  private periodicCleanup(now: number) {
    if (now - this.lastCleanupTime < this.cleanupIntervalMs) {
      return;
    }

    const maxAgeMs = 30 * 60 * 1000; // 30 minutes threshold for inactivity
    for (const [ip, bucket] of this.ipBuckets.entries()) {
      if (now - bucket.lastRefillTime > maxAgeMs) {
        this.ipBuckets.delete(ip);
      }
    }

    this.lastCleanupTime = now;
  }
}

// Export a singleton rate limiter instance
// Allows 5 requests per 30 seconds per IP, refilling 1 request every 6 seconds.
export const apiRateLimiter = new InMemoryRateLimiter(5, 30000);
export type { InMemoryRateLimiter };
