import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.devtools = true
app.use(ElementPlus).mount('#app')
