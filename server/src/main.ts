import Koa from 'koa';
import bodyParser from 'koa-body';
import { connectDB } from './utils/db';
import router from './routes';
// import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv'
dotenv.config({ path: '.env' }) //config()中是配置.env文件的位置，如果在根目录，此处括号中可以留空

const app = new Koa();

app.use(bodyParser());
// app.use(errorHandler);
// 通过app.use启用路由,其他中间件也由app.use启用

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.APP_PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
