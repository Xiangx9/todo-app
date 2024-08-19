import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: String,  // 存储刷新Token
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
