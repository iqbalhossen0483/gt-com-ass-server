import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  corsOrigin: string[];
  mongoUrl: string;
  redisHost: string;
  redisPort: number;
  redisPassword: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000'],
  mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  redisHost:
    process.env.REDIS_HOST ||
    'redis-12013.c8.us-east-1-4.ec2.redns.redis-cloud.com',
  redisPort: Number(process.env.REDIS_PORT) || 12013,
  redisPassword:
    process.env.REDIS_PASSWORD || 'sOiI6YZF6BKxuZ1VUU5ixlBLerYOFsoK',
};

export default config;
