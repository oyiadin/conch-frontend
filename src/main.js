import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import App from './App.vue'
import Record from "@/pages/Record";
import Person from "@/pages/Person";
import Search from "@/pages/Search";
import User from "@/pages/User";



const routes = [
    { path: '/', redirect: { name: 'search' }},
    { name: 'record', path: '/record/:key(.+)', component: Record },
    { name: 'person', path: '/person/:key(.+)', component: Person },
    { name: 'search', path: '/search', component: Search },
    { name: 'user', path: '/user', component: User },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const app = createApp(App)
app.config.devtools = true
app.use(router)
app.use(ElementPlus)

app.mount('#app')
