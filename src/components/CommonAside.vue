<template>
  <el-aside :width="iscollapse ? '64px' : '180px'" class="el-menu">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      :collapse="iscollapse"
      :collapse-transition="false"
    >
      <h3 v-show="!iscollapse">仓库管理系统</h3>
      <h3 v-show="iscollapse">仓管</h3>
      <el-menu-item
        :index="item.path"
        v-for="item in noChildren()"
        :key="item.path"
        @click="clickMenu(item)"
      >
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <el-sub-menu
        :index="item.label"
        v-for="item in hasChildren()"
        :key="item.path"
      >
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            :index="subItem.path"
            v-for="(subItem, subIndex) in item.children"
            :key="subIndex"
            @click="clickMenu(subItem)"
          >
            <component class="icons" :is="subItem.icon"></component>
            <span>{{ subItem.label }}</span></el-menu-item
          >
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
const list = [
  {
    path: '/',
    name: 'home',
    label: '首页',
    icon: 'video-play',
    url: 'MallManage/MallManage',
  },
  {
    path: '/good',
    name: 'good',
    label: '库存管理',
    icon: 'TakeawayBox',
    url: 'UserManage/UserManage',
  },
  {
    path: '/record',
    name: 'record',
    label: '出入库记录',
    icon: 'Monitor',
    url: 'UserManage/UserManage',
  },
  {
    path: '/type',
    name: 'type',
    label: '库存种类',
    icon: 'Van',
    url: 'UserManage/UserManage',
  },
  {
    path: '/usermanage',
    name: 'usermanage',
    label: '职工管理',
    icon: 'Management',
    url: 'UserManage/UserManage',
  },
]
//给menu取值，根据职位
import useMenu from '../stores/menustore'
const menuStore = useMenu()
const asyncList = Array.from(menuStore.menu)

const noChildren = () => {
  return asyncList.filter((item) => !item.children)
}
const hasChildren = () => {
  return asyncList.filter((item) => item.children)
}
//控制侧边栏伸缩
import shenshuoCounter from '../stores/shensuostore'
import { storeToRefs } from 'pinia'
const shenshuoStore = shenshuoCounter()
const { iscollapse } = storeToRefs(shenshuoStore)
//点击侧菜单路由跳转
import { useRouter } from 'vue-router'
const router = useRouter()
const clickMenu = (item) => {
  router.push({
    name: item.name,
  })
}
</script>
<style lang="less" scoped>
.el-aside {
  background-color: #2b5c71;
}
.icons {
  width: 16px;
  height: 16px;
}
.el-menu {
  border-right: 0px;
  h3 {
    line-height: 48px;
    color: #fff;
    text-align: center;
  }
}
</style>
