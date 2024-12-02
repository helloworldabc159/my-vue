//控制侧边菜单伸缩的数据
import { defineStore } from 'pinia'
const shenshuoCounter = defineStore('shensuo', {
  state: () => ({
    iscollapse: false,
  }),
  getters: {},
  actions: {},
})
export default shenshuoCounter
