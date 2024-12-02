import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    component: () => import('../views/Main.vue'),
    name: 'home1',
    redirect: '/home',
    // children: [
    //   {
    //     path: '/',
    //     name: 'home',
    //     component: () => import('../views/Home/home.vue'),
    //   },
    //   {
    //     path: '/good',
    //     name: 'good',
    //     component: () => import('../views/Good/good.vue'),
    //   },
    //   {
    //     path: '/record',
    //     name: 'record',
    //     component: () => import('../views/Record/record.vue'),
    //   },
    //   {
    //     path: '/type',
    //     name: 'type',
    //     component: () => import('../views/Type/type.vue'),
    //   },
    //   {
    //     path: '/usermanage',
    //     name: 'usermanage',
    //     component: () => import('../views/UserManage/usermange.vue'),
    //   },
    //   {
    //     path: '/page1',
    //     name: 'page1',
    //     component: () => import('../views/Other/page1.vue'),
    //   },
    //   {
    //     path: '/page2',
    //     name: 'page2',
    //     component: () => import('../views/Other/page2.vue'),
    //   },
    // ],
    children: [],
  },
  {
    path: '/login',
    component: () => import('../views/Login/login.vue'),
    name: 'login',
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
