import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/less/index.less'
import pinia from './stores'
import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.use(Highcharts)
app.use(HighchartsVue)
import useMenu from '../src/stores/menustore'
const menuStore = useMenu()
menuStore.addMenu(router)
//路由守护
const checkRouter = (path) => {
  let hasCheck = router.getRoutes().filter((route) => route.path == path).length
  if (hasCheck) {
    return true
  } else {
    return false
  }
}
checkRouter()
import useToken from '../src/stores/tokenStore'
const tokenStore = useToken()
router.beforeEach((to, from, next) => {
  tokenStore.getToken()
  const token = tokenStore.token
  if (!token && to.name !== 'login') {
    next({ name: 'login' })
  } else if (!checkRouter(to.path)) {
    next({ name: 'home' })
  } else {
    next()
  }
})

app.mount('#app')
