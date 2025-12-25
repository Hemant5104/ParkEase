import mongoose from 'mongoose';

const connectDB = async (uri) => {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

export default connectDB;

