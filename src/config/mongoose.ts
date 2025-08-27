import mongoose from 'mongoose';
import config from './config';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
