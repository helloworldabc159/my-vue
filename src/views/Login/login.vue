<template>
  <el-form :model="loginForm" class="login-container">
    <h3 class="tipinfo">仓库管理系统登录</h3>
    <el-form-item
      prop="name"
      label="账号"
      :rules="[{ required: true, message: '账号为必填项' }]"
    >
      <el-input
        type="input"
        placeholder="请输入账号"
        v-model="loginForm.name"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="密码"
      prop="password"
      :rules="[{ required: true, message: '密码为必填项' }]"
    >
      <el-input
        type="password"
        placeholder="请输入密码"
        v-model="loginForm.password"
      ></el-input>
    </el-form-item>
    <el-form-item
      ><el-button type="primary" @click="onshow">登录</el-button></el-form-item
    >
  </el-form>
  <div class="yanzhengma">
    <Vcode :show="isShow" @success="onSuccess" @close="onClose"></Vcode>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const loginForm = reactive({
  name: '',
  password: '',
})
import useMenu from '../../stores/menustore'
const menuStore = useMenu()
//获取token
import useToken from '../../stores/tokenStore'
const tokenStore = useToken()
//验证码功能
import Vcode from 'vue3-puzzle-vcode'
const isShow = ref(false)
const onshow = () => {
  isShow.value = true
  // console.log('11')
}
const onClose = () => {
  isShow.value = false
}
const router = useRouter()
const onSuccess = async () => {
  onClose()
  let res = await axios.post('http://127.0.0.1/api/login', loginForm)
  if (res.data.status == 1) {
    ElMessage('您不是本公司员工或已离职,也可能是密码错误，请联系人事管理部门')
  } else if (res.data.status == 0) {
    menuStore.menu = res.data.menu
    menuStore.storeMenu()
    menuStore.addMenu(router)
    tokenStore.setToken(res.data.token, res.data.name, res.data.position)
    router.push({
      name: 'home',
    })
  }
}
//登录功能
// const router = useRouter()
// const login = async () => {
//   let res = await axios.post('http://127.0.0.1/api/login', loginForm)
//   if (res.data.status == 1) {
//     ElMessage('您不是本公司员工或已离职,也可能是密码错误，请联系人事管理部门')
//   } else if (res.data.status == 0) {
//     menuStore.menu = res.data.menu
//     menuStore.storeMenu()
//     menuStore.addMenu(router)
//     tokenStore.setToken(res.data.token, res.data.name, res.data.position)
//     router.push({
//       name: 'home',
//     })
//   }
// }

onMounted(() => {})
</script>

<style lang="less" scoped>
.login-container {
  width: 350px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
  margin: 180px auto;
  opacity: 80%;
  .tipinfo {
    margin-bottom: 15px;
    text-align: center;
    color: #505450;
  }
}
:deep(.el-form-item__content) {
  justify-content: center;
}
</style>
