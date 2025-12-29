import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  corsOrigin: string[];
  redisHost: string;
  redisPort: number;
  redisPassword: string;
  tokenSecret: string;
  cloudinary: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  };
}

const config: Config = {
  port: Number(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000'],
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: Number(process.env.REDIS_PORT) || 12013,
  redisPassword: process.env.REDIS_PASSWORD || '',
  tokenSecret: process.env.JWT_SECRET || '',
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
  },
};

export default config;
