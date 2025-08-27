"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const mongoose_1 = require("./config/mongoose");
const redis_1 = require("./config/redis");
let server;
const startServer = async () => {
    await (0, mongoose_1.connectDB)();
    server = app_1.default.listen(config_1.default.port, () => {
        console.log(`Server running on port ${config_1.default.port}`);
        // Initialize Redis connection by referencing it
        redis_1.redis.get('test');
    });
};
const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
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
