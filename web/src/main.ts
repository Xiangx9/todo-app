import './style/index.scss' 
import { createApp } from 'vue'
import router from '@/router/index'
import App from './App.vue'
import i18n from './langurage'


// 创建app
const app = createApp(App)
// 注入
app.use(i18n)
app.use(router)

// 挂载实例
app.mount('#app')

