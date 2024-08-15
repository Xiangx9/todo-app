import {
  createWebHashHistory,
  createWebHistory,
  createRouter,
} from "vue-router"; //导入路由系列：
import { routes } from 'vue-router/auto-routes';

console.log("routes",routes);
//创建路由
const router = createRouter({
  // history: createWebHashHistory(), //hash模式
  history: createWebHistory(), //History模式
  routes:routes, //路由路径
  scrollBehavior(to, from, savedPosition) {
    //滚动行为
    // 滚动到锚点
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
  },
});

//全局前置守卫
// router.beforeEach(async (to, from,next) => {
//   if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
//   // 如果用户未能验证身份，则 `next` 会被调用两次
//   else  next()
// })

// 全局后置钩子
router.afterEach((to, from) => {
  const toDepth = to.path.split("/").length;
  const fromDepth = from.path.split("/").length;
  to.meta.transition = toDepth < fromDepth ? "slide-right" : "slide-left";
});

export default router;
