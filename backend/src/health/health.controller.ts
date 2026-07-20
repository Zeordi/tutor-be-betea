import { Controller, Get } from '@nestjs/common';
import { Public } from '../modules/auth/decorators/public.decorator';
import { CacheService } from '../services/cache.service';

@Controller('health')
export class HealthController {
  constructor(private readonly cache: CacheService) {}

  @Public()
  @Get()
  async check() {
    const cacheBackend = this.cache.backend();
    let redis: 'up' | 'down' | 'skipped' = 'skipped';
    if (cacheBackend === 'redis') {
      redis = (await this.cache.ping()) ? 'up' : 'down';
    }

    return {
      status: redis === 'down' ? 'degraded' : 'ok',
      service: 'tutor-be-betea-backend',
      cache: cacheBackend,
      redis,
      timestamp: new Date().toISOString(),
    };
  }
}
