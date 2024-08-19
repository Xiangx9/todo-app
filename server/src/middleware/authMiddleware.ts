import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';

export const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization?.split(' ')[1];
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Authentication required' };
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    ctx.state.user = user;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid token' };
  }
};
