import Router from 'koa-router';
import userRoutes from './user';
import taskRoutes from './tasks';
import projectRoutes from './projects';

const router = new Router();

router.use('/api/user', userRoutes.routes()); // 登录注册接口
router.use('/api/tasks', taskRoutes.routes());
// router.use('/api/projects', projectRoutes.routes());

export default router;
