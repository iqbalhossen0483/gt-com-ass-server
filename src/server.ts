import { Server } from 'http';
import app from './app';
import config from './config/config';
import { connectDB } from './config/mongoose';
import { redis } from './config/redis';

let server: Server;

const startServer = async () => {
  await connectDB();

  server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    // Initialize Redis connection by referencing it
    redis.get('test');
  });
};

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});

startServer();
