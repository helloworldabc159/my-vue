import { defineStore } from 'pinia'
export const useMenu = defineStore('menu', {
  state: () => ({
    menu: [],
    menuArray: [],
  }),
  getters: {},
  actions: {
    storeMenu() {
      localStorage.setItem('menu', JSON.stringify(this.menu))
    },
    //解决数据持久化，不做这个之后，刷新之后menu的值就为空
    addMenu(router) {
      if (!localStorage.getItem('menu')) {
        return
      }
      const menu = JSON.parse(localStorage.getItem('menu'))
      this.menu = menu
      //做动态路由
      const menuArray = []
      menu.forEach((item) => {
        if (item.children) {
          item.children = item.children.map((item) => {
            let url = `../views/${item.url}.vue`
            item.component = () => import(url)
            return item
          })
          menuArray.push(...item.children)
        } else {
          let url = `../views/${item.url}.vue`
          item.component = () => import(url)
          menuArray.push(item)
        }
      })
      menuArray.forEach((item) => {
        router.addRoute('home1', item)
      })
      this.menuArray = menuArray
    },
    //退出功能
    cleanMenu() {
      this.menu = []
      localStorage.removeItem('menu')
    },
  },
})
export default useMenu
