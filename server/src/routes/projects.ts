import Router from 'koa-router';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = new Router();

router.use(authMiddleware);

router.get('/', getProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
