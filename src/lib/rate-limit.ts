// Rate limiting abstraction and in-memory implementation
// Designed behind an interface so it can be swapped for a distributed provider (e.g. Upstash Redis) in the future.

export interface RateLimiter {
  check(key: string, limit: number, windowSeconds: number): Promise<{ success: boolean; retryAfter?: number }>;
}

class MemoryRateLimiter implements RateLimiter {
  private records: Map<string, { count: number; resetTime: number }> = new Map();

  public async check(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ success: boolean; retryAfter?: number }> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const record = this.records.get(key);

    if (!record || now > record.resetTime) {
      this.records.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return { success: true };
    }

    if (record.count >= limit) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return { success: false, retryAfter };
    }

    record.count += 1;
    return { success: true };
  }

  // Periodic cleanup of expired keys
  public cleanup(): void {
    const now = Date.now();
    this.records.forEach((record, key) => {
      if (now > record.resetTime) {
        this.records.delete(key);
      }
    });
  }
}

export const rateLimiter: RateLimiter = new MemoryRateLimiter();

// Run memory cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    (rateLimiter as MemoryRateLimiter).cleanup();
  }, 10 * 60 * 1000).unref?.();
}
