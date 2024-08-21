import { Context, Next } from 'koa';

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    console.error('Error:', err);
    ctx.status = ctx.status || 500;
    ctx.body = {
      message: ctx.message || '内部服务器错误',
    };
  }
};
