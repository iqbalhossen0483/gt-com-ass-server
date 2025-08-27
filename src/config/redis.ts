import Redis, { RedisOptions } from 'ioredis';
import config from './config';

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

const redisConfig: RedisConfig = {
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword,
};

class RedisClient {
  private redis: Redis;
  private options: RedisConfig;

  constructor(options?: RedisConfig) {
    this.options = options || redisConfig;
    this.redis = new Redis(this.getRedisOptions());
    this.redis.on('connect', () => {
      console.log('Connected to Redis Cache Server');
    });
  }

  private getRedisOptions(): RedisOptions {
    const { host, port, password } = this.options;
    return {
      host,
      port,
      password,
      maxRetriesPerRequest: null, // Prevents unnecessary retries
      enableOfflineQueue: false, // Prevents queuing commands when Redis is down
      retryStrategy: (times: number): number => Math.min(times * 50, 2000), // Limit retries
    };
  }

  // Method to set a key-value pair in Redis
  async set(key: string, value: any, expire: number = 300): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', expire);
    } catch (error) {
      console.error(`Error setting key '${key}' in Redis:`, error);
    }
  }

  // Method to get the value of a key from Redis
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      console.error(
        `Error retrieving value for key '${key}' from Redis:`,
        error,
      );
      return null;
    }
  }

  // Method to remove a key from Redis
  async remove(key: string): Promise<void> {
    try {
      const result = await this.redis.del(key);
      if (result === 1) {
        console.log(`Key '${key}' removed successfully from Redis.`);
      } else {
        console.log(`Key '${key}' does not exist in Redis.`);
      }
    } catch (error) {
      console.error(`Error removing key '${key}' from Redis:`, error);
    }
  }

  // Method to close the Redis connection
  async close(): Promise<void> {
    try {
      await this.redis.quit();
      console.log('Redis connection closed.');
    } catch (error) {
      console.error('Error closing Redis connection:', error);
    }
  }

  // Method to pop an item from a list in Redis
  async lpop<T>(listKey: string): Promise<T | null> {
    try {
      const item = await this.redis.lpop(listKey);
      if (item) {
        console.log(`Item '${item}' popped from list '${listKey}'.`);
        return JSON.parse(item) as T;
      } else {
        console.log(`List '${listKey}' is empty.`);
        return null;
      }
    } catch (error) {
      console.error(`Error popping item from list '${listKey}':`, error);
      return null;
    }
  }

  // method to get list length
  async llen(listKey: string): Promise<number> {
    try {
      const length = await this.redis.llen(listKey);
      console.log(`Length of list '${listKey}': ${length}`);
      return length;
    } catch (error) {
      console.error(`Error getting length of list '${listKey}':`, error);
      return 0;
    }
  }

  // method to push new item in a existing list
  async rpush(listKey: string, item: any): Promise<void> {
    try {
      await this.redis.rpush(listKey, JSON.stringify(item));
      console.log(`Item '${item}' pushed to list '${listKey}'.`);
    } catch (error) {
      console.error(`Error pushing item to list '${listKey}':`, error);
    }
  }

  // Method to flush all data from Redis
  async flushAll(): Promise<void> {
    try {
      await this.redis.flushall();
      console.log('All Redis data flushed.');
    } catch (error) {
      console.error('Error flushing all Redis data:', error);
    }
  }
}

// Export Singleton Instance
const redisInstance = new RedisClient();
Object.freeze(redisInstance); // Prevent new instances

export { redisInstance as redis };
