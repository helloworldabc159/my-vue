<template>
  <el-header>
    <div class="l-content">
      <el-button size="small" @click="shenshuo">
        <el-icon><Menu /></el-icon>
      </el-button>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img src="../../image/user2.png" class="user" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="dialogVisible = true"
              >个人信息</el-dropdown-item
            >
            <el-dropdown-item @click="dialogVisible1 = true"
              >修改个人信息</el-dropdown-item
            >
            <el-dropdown-item @click="dialogVisible2 = true"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
  <el-dialog
    v-model="dialogVisible"
    title="个人信息"
    width="700"
    :before-close="handleClose"
    class="dialog"
  >
    <el-descriptions class="margin-top" :column="3" :size="size">
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <user />
            </el-icon>
            用户名
          </div>
        </template>
        {{ infoForm.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Star />
            </el-icon>
            年龄
          </div>
        </template>
        {{ infoForm.age }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Message />
            </el-icon>
            e-mail
          </div>
        </template>
        {{ infoForm.email }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <Female />
            </el-icon>
            性别
          </div>
        </template>
        {{ infoForm.gender }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle"> <Avatar /> </el-icon>
            职位
          </div>
        </template>
        {{ infoForm.position }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <iphone />
            </el-icon>
            联系方式
          </div>
        </template>
        {{ infoForm.tel }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
  <el-dialog
    v-model="dialogVisible1"
    title="修改员工信息"
    width="500"
    :before-close="handleClose1"
  >
    <div class="username">
      <p>用户：{{ tokenStore.name }}</p>
    </div>

    <el-form :inline="true" :model="changeInfoForm" ref="userForm">
      <el-form-item
        label="年龄"
        prop="age"
        :rules="[
          { required: true, message: '必填项' },
          { type: 'number', message: '必须为数字' },
        ]"
      >
        <el-input v-model.number="changeInfoForm.age"></el-input>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
        :rules="[
          { required: true, message: '必填项' },
          { type: 'email', message: '必须为邮箱的形式' },
        ]"
      >
        <el-input v-model="changeInfoForm.email"></el-input>
      </el-form-item>
      <el-form-item
        label="性别"
        prop="gender"
        :rules="[{ required: true, message: '必填项' }]"
      >
        <el-select
          v-model="changeInfoForm.gender"
          placeholder="性别"
          style="width: 240px"
        >
          <el-option
            v-for="item in optionsForGender"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="联系方式"
        prop="tel"
        :rules="[{ required: true, message: '联系方式不能为空' }]"
      >
        <el-input v-model="changeInfoForm.tel"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="changeInfo"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogVisible2"
    title="修改密码"
    width="500"
    :before-close="handleClose2"
  >
    <div class="pwdForm">
      <el-form :inline="true" ref="Formpwd" :model="pwdform">
        <el-form-item
          label="旧密码"
          prop="newpwd"
          :rules="[{ required: true, message: '此项不能为空' }]"
        >
          <el-input
            placeholder="旧密码"
            v-model="pwdform.oldPwd"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newpwd"
          :rules="[{ required: true, message: '此项不能为空' }]"
        >
          <el-input
            placeholder="新密码"
            v-model="pwdform.newPwd"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="yanzhengma">
      <Vcode :show="isShow" @success="onSuccess" @close="onClose"></Vcode>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="onShow"> 修改密码 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #2b5c71;
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
  h3 {
    color: #fff;
  }
  .dialog {
    border-radius: 50px;
  }
}
.username {
  margin: 10px 0;
  p {
    font-size: 20px;
  }
}
</style>
<script setup>
//控制侧边栏伸缩
import shenshuoCounter from '../stores/shensuostore'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const shenshuoStore = shenshuoCounter()
const { iscollapse } = storeToRefs(shenshuoStore)
const { proxy } = getCurrentInstance()
function shenshuo() {
  iscollapse.value = !iscollapse.value
}
//退出功能
import { useRouter } from 'vue-router'
const router = useRouter()
import useMenu from '../stores/menustore'
const menuStore = useMenu()
import useToken from '../stores/tokenStore'
import axios from 'axios'
const tokenStore = useToken()
const handleLoginOut = () => {
  menuStore.cleanMenu()
  // console.log(tokenStore.token)
  tokenStore.clearToken()
  router.push({
    name: 'login',
  })
}
//header配置
let config = {
  headers: {
    Authorization: tokenStore.token,
    'Content-Type': 'application/json',
  },
}
//控制个人信息对话框信息
const dialogVisible = ref(false)
const handleClose = () => {
  ElMessageBox.confirm('关闭这个对话框吗?')
    .then(() => {
      dialogVisible.value = false
    })
    .catch(() => {
      // catch error
    })
}
//用于修改的数据，放在前面为了可以浅拷贝
let changeInfoForm = ref({
  name: '',
  age: '',
  email: '',
  tel: '',
  gender: null,
})
//获取信息给个人信息
let infoForm = ref({
  name: '',
  age: null,
  email: '',
  tel: '',
  gender: '',
  position: '',
})
const getInfo = async () => {
  let result = await axios.get('http://127.0.0.1/my/userinfo', {
    headers: config.headers,
  })
  // console.log(result)
  if (result.data.status == 1) {
    ElMessage('获取个人信息失败')
  } else {
    infoForm.value = result.data.result
    Object.assign(changeInfoForm.value, result.data.result)
  }
}
//修改个人信息
let dialogVisible1 = ref(false)
const handleClose1 = () => {
  ElMessageBox.confirm('关闭这个对话框吗?')
    .then(() => {
      dialogVisible1.value = false
    })
    .catch(() => {
      // catch error
    })
}

//为性别提供select
const optionsForGender = [
  { value: 0, label: '女' },
  { value: 1, label: '男' },
]
const changeInfo = async () => {
  let result = await axios.post(
    'http://127.0.0.1/my/updinfo',
    changeInfoForm.value,
    config
  )
  // console.log(result)
  if (result.data.status == 0) {
    ElMessage('修改成功')
    getInfo()
  } else {
    ElMessage(result.data.msg)
  }
}
//修改密码
let pwdform = ref({
  oldPwd: '',
  newPwd: '',
})
let dialogVisible2 = ref(false)
const handleClose2 = () => {
  ElMessageBox.confirm('关闭这个对话框吗?')
    .then(() => {
      dialogVisible2.value = false
    })
    .catch(() => {
      // catch error
    })
}
const changepwd = () => {
  // console.log(pwdform.value)
}
//验证码功能
import Vcode from 'vue3-puzzle-vcode'

const isShow = ref(false)

const onShow = () => {
  isShow.value = true
  dialogVisible2.value = false
}

const onClose = () => {
  isShow.value = false
}

const onSuccess = async () => {
  onClose() // 验证成功，需要手动关闭模态框
  dialogVisible2.value = true
  let result = await axios.post(
    'http://127.0.0.1/my/updatepwd',
    pwdform.value,
    config
  )
  if (result.data.status == 1) {
    return ElMessage(result.data.message)
  } else {
    ElMessage('修改密码成功')
    pwdform.value = {
      oldPwd: '',
      newPwd: '',
    }
  }
}
//hooks
onMounted(() => {
  getInfo()
})
</script>
