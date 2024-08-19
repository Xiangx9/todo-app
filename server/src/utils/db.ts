import mongoose from 'mongoose';


export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, );
    console.log('MongoDB 启动成功');
  } catch (error) {
    console.error('"MongoDB 启动失败:', error);
    process.exit(1);
  }
};