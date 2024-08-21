import jwt from 'jsonwebtoken';

export const generateToken = (user: any) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET!, {
    expiresIn:  process.env.JWT_EXPIRES_IN || '15m',  // 访问 Token 有效期为 15 分钟
  });
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',  // 刷新 Token 有效期为 7 天
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret); // 验证 Token 是否有效
};
