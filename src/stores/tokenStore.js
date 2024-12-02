import { defineStore } from 'pinia'
import Cookie from 'js-cookie'
const useToken = defineStore('token', {
  state: () => ({
    token: '',
    name: '',
    position: '',
  }),
  getters: {},
  actions: {
    //设置token
    setToken(val, val2, val3) {
      this.token = val
      this.name = val2
      this.position = val3
      Cookie.set('token', val)
      Cookie.set('name', val2)
      Cookie.set('position', val3)
    },

    //退出登录
    clearToken() {
      this.token = ''
      this.name = ''
      this.position = ''
      Cookie.remove('token')
      Cookie.remove('name')
      Cookie.remove('position')
    },
    //获取token
    getToken() {
      this.token = this.token || Cookie.get('token')
      this.name = this.name || Cookie.get('name')
      this.position = this.position || Cookie.get('position')
    },
  },
})
export default useToken
