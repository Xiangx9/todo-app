import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';

// 验证token中间件
export const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization?.split(' ')[1];
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: '请登录' };
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    ctx.state.user = user;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: 'token过期' };
  }
};
