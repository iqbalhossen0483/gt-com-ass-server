import { PrismaPg } from '@prisma/adapter-pg';
import config from '../config/config';
import { PrismaClient } from '../prisma/client';

const adapter = new PrismaPg({ connectionString: config.databaseUrl });
const prisma = new PrismaClient({ adapter });

export { prisma };
