"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = __importDefault(require("./config"));
const redisConfig = {
    host: config_1.default.redisHost,
    port: config_1.default.redisPort,
    password: config_1.default.redisPassword,
};
class RedisClient {
    constructor(options) {
        this.options = options || redisConfig;
        this.redis = new ioredis_1.default(this.getRedisOptions());
        this.redis.on('connect', () => {
            console.log('Connected to Redis Cache Server');
        });
    }
    getRedisOptions() {
        const { host, port, password } = this.options;
        return {
            host,
            port,
            password,
            maxRetriesPerRequest: null, // Prevents unnecessary retries
            enableOfflineQueue: false, // Prevents queuing commands when Redis is down
            retryStrategy: (times) => Math.min(times * 50, 2000), // Limit retries
        };
    }
    // Method to set a key-value pair in Redis
    async set(key, value, expire = 300) {
        try {
            await this.redis.set(key, JSON.stringify(value), 'EX', expire);
        }
        catch (error) {
            console.error(`Error setting key '${key}' in Redis:`, error);
        }
    }
    // Method to get the value of a key from Redis
    async get(key) {
        try {
            const value = await this.redis.get(key);
            if (value) {
                return JSON.parse(value);
            }
            return null;
        }
        catch (error) {
            console.error(`Error retrieving value for key '${key}' from Redis:`, error);
            return null;
        }
    }
    // Method to remove a key from Redis
    async remove(key) {
        try {
            const result = await this.redis.del(key);
            if (result === 1) {
                console.log(`Key '${key}' removed successfully from Redis.`);
            }
            else {
                console.log(`Key '${key}' does not exist in Redis.`);
            }
        }
        catch (error) {
            console.error(`Error removing key '${key}' from Redis:`, error);
        }
    }
    // Method to close the Redis connection
    async close() {
        try {
            await this.redis.quit();
            console.log('Redis connection closed.');
        }
        catch (error) {
            console.error('Error closing Redis connection:', error);
        }
    }
    // Method to pop an item from a list in Redis
    async lpop(listKey) {
        try {
            const item = await this.redis.lpop(listKey);
            if (item) {
                console.log(`Item '${item}' popped from list '${listKey}'.`);
                return JSON.parse(item);
            }
            else {
                console.log(`List '${listKey}' is empty.`);
                return null;
            }
        }
        catch (error) {
            console.error(`Error popping item from list '${listKey}':`, error);
            return null;
        }
    }
    // method to get list length
    async llen(listKey) {
        try {
            const length = await this.redis.llen(listKey);
            console.log(`Length of list '${listKey}': ${length}`);
            return length;
        }
        catch (error) {
            console.error(`Error getting length of list '${listKey}':`, error);
            return 0;
        }
    }
    // method to push new item in a existing list
    async rpush(listKey, item) {
        try {
            await this.redis.rpush(listKey, JSON.stringify(item));
            console.log(`Item '${item}' pushed to list '${listKey}'.`);
        }
        catch (error) {
            console.error(`Error pushing item to list '${listKey}':`, error);
        }
    }
    // Method to flush all data from Redis
    async flushAll() {
        try {
            await this.redis.flushall();
            console.log('All Redis data flushed.');
        }
        catch (error) {
            console.error('Error flushing all Redis data:', error);
        }
    }
}
// Export Singleton Instance
const redisInstance = new RedisClient();
exports.redis = redisInstance;
Object.freeze(redisInstance); // Prevent new instances
