import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    databaseId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Database',
    },
    number: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    profile: {
      type: String,
      required: false,
    },
    balance: {
      type: Number,
      required: false,
    },
    debt: {
      type: Number,
      required: false,
    },
    totalSale: {
      type: Number,
      required: false,
    },
    totalDueSale: {
      type: Number,
      required: false,
    },
    totalDueCollection: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);
export default User;

export type User = mongoose.Document & {
  databaseId: mongoose.Types.ObjectId;
  number: string;
  password: string;
  name?: string;
  profile?: string;
  balance?: number;
  debt?: number;
  totalSale?: number;
  totalDueSale?: number;
  totalDueCollection?: number;
};
