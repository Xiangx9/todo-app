import { Context, Next } from 'koa';
import fs from 'fs';
import path from 'path';

const logStream = fs.createWriteStream(path.join(__dirname, '../../logs/access.log'), { flags: 'a' });

export const logger = async (ctx: Context, next: Next) => {
  const start = Date.now();

  await next();

  const ms = Date.now() - start;
  const log = `${ctx.method} ${ctx.url} - ${ctx.status} ${ms}ms\n`;
  
  console.log(log);
  logStream.write(log);
};
