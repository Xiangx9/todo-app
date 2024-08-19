// 用户登录注册路由
import Router from 'koa-router';
import { register, login,refreshToken } from '../controllers/authController';

const router = new Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);  // 刷新 Token 路由

export default router;
