import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // 用户名
  password: { type: String, required: true },// 密码
  refreshToken: String,  // 存储刷新Token
  admin: { type: Boolean, default: false },// 是否为管理员
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
