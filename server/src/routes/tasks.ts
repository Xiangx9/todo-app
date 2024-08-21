import Router from 'koa-router';
import { getTasks, createTask, updateTask, deleteTask,completeTask } from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = new Router();

router.use(authMiddleware);

router.get('/', getTasks); // 获取任务列表
router.post('/', createTask); // 创建任务
router.put('/:id', updateTask); // 更新任务
router.delete('/:id', deleteTask); // 删除任务
router.put('/completed/:id', completeTask); // 获取已完成任务列表

export default router;
