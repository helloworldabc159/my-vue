<template>
  <div class="user-header">
    <div>
      <el-button type="primary" @click="returnback">返回</el-button>
      <el-button type="primary" @click="dialogVisible = true"
        >添加新员工</el-button
      >
    </div>
    <el-form :inline="true" :model="userName">
      <el-form-item label="请输入要查询的人员名字" prop="name">
        <el-input placeholder="输入名字" v-model="userName.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="searchUser"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
  </div>
  <div class="user-table">
    <el-table :data="userInfo" style="width: 100%; height: 550px" :limit="10">
      <el-table-column prop="id" label="员工编号" />
      <el-table-column prop="name" label="员工名字" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="position" label="职位" />
      <el-table-column prop="tel" label="联系方式" />
      <el-table-column fixed="right" label="操作" width="250">
        <template #default="scope">
          <el-button
            type="danger"
            size="small"
            @click="delStaff(scope.row)"
            v-if="scope.row.name !== tokenStore.name"
            >删除</el-button
          >
          <el-button type="success" size="small" @click="rstpwd(scope.row)"
            >重设密码</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="opendig(scope.row)"
            v-if="scope.row.name !== tokenStore.name"
            >职位变更</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        small
        background
        layout="prev,pager,next"
        :total="pagenow.total"
        @current-change="changePage"
      />
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="添加新员工"
    width="500"
    :before-close="handleClose"
  >
    <el-form :inline="true" :model="staffinfo" ref="staffForm">
      <el-form-item
        label="名字"
        prop="name"
        :rules="[{ required: true, message: '必填项' }]"
      >
        <el-input v-model="staffinfo.name"></el-input>
      </el-form-item>
      <el-form-item
        label="年龄"
        prop="age"
        :rules="[
          { required: true, message: '必填项' },
          { type: 'number', message: '必须为数字' },
        ]"
      >
        <el-input v-model.number="staffinfo.age"></el-input>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
        :rules="[
          { required: true, message: '必填项' },
          { type: 'email', message: '必须为邮箱的形式' },
        ]"
      >
        <el-input v-model="staffinfo.email"></el-input>
      </el-form-item>
      <el-form-item
        label="职位"
        prop="position"
        :rules="[{ required: true, message: '必填项' }]"
      >
        <el-select
          v-model="staffinfo.position"
          placeholder="职位"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="性别"
        prop="gender"
        :rules="[{ required: true, message: '必填项' }]"
      >
        <el-select
          v-model="staffinfo.gender"
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
        <el-input v-model="staffinfo.tel"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addstaff"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogVisible1"
    title="职位变更"
    width="500"
    :before-close="handleClose1"
  >
    <el-form
      :inline="true"
      :model="posForm"
      prop="position"
      :rules="[{ required: true, message: '此项为必填项' }]"
    >
      <el-form-item label="职位选项">
        <el-select
          v-model="posForm.position"
          clearable
          placeholder="选择变更的岗位"
          style="width: 240px"
        >
          <el-option
            v-for="item in forselect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="changepos"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import { onMounted, ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
//配置头数据
import useToken from '../../stores/tokenStore'
const tokenStore = useToken()
let config = {
  headers: {
    Authorization: tokenStore.token,
    'Content-Type': 'application/json',
  },
}
//页码数据
let pagenow = {
  page: null,
  total: 30,
}
//搜索的数据
const userName = ref({ name: '' })
//表单的数据
const userInfo = ref([])
//请求员工信息
const foruseinfo = async () => {
  let result = await axios.get('http://127.0.0.1/user/showuser', {
    headers: config.headers,
  })

  if (result.data.status == 1) {
    ElMessage('请求数据失败')
  } else {
    userInfo.value = result.data.data
    pagenow.total = result.data.length
  }
}
//返回功能
const returnback = () => {
  foruseinfo()
}
//搜索功能
const searchUser = async () => {
  let result = await axios.get('http://127.0.0.1/user/usersearch', {
    params: { name: userName.value.name },
    headers: config.headers,
  })
  if (result.data.status === 1) {
    ElMessage('查询失败')
  } else {
    userInfo.value = result.data.data
    pagenow.total = 1
  }
}
//页码变换
const changePage = async (page) => {
  pagenow.page = page
  let result = await axios.get('http://127.0.0.1/user/userpage', {
    params: {
      page: page,
    },
    headers: config.headers,
  })
  pagenow.length = result.data.length
  userInfo.value = result.data.data
}
//添加新员工
let staffinfo = ref({
  name: '',
  age: '',
  email: '',
  position: null,
  tel: '',
  gender: null,
})
//为职位的select提供数据
const options = [
  {
    value: 0,
    label: '普通职工',
  },
  {
    value: 1,
    label: '管理人员',
  },
]
//为性别提供select
const optionsForGender = [
  { value: 0, label: '女性' },
  { value: 1, label: '男性' },
]
const addstaff = async () => {
  let result = await axios.post('http://127.0.0.1/api/reguser', staffinfo.value)
  if (result.data.status == 1) {
    ElMessage(`添加新员工失败,${result.data.message}`)
  } else {
    ElMessage('添加成功')
    changePage(pagenow.page)
    proxy.$refs.staffForm.resetFields()
  }
}
const dialogVisible = ref(false)

const handleClose = () => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      dialogVisible.value = false
      proxy.$refs.staffForm.resetFields()
    })
    .catch(() => {
      // catch error
    })
}
//删除用户
const delStaff = (val) => {
  ElMessageBox.confirm('确定删除这名员工吗？')
    .then(async () => {
      let result = await axios.get('http://127.0.0.1/user/deluser', {
        params: {
          id: val.id,
        },
        headers: config.headers,
      })
      if (result.data.status == 1) {
        ElMessage('删除失败')
      } else {
        ElMessage('删除成功')
        changePage(pagenow.page)
        // foruseinfo()
      }
    })
    .catch(() => {})
}
//重设密码
const rstpwd = async (data) => {
  let res = await axios.post(
    'http://127.0.0.1/user/resetpwd',
    { id: data.id },
    config
  )
  if (res.data.status == 1) {
    return ElMessage('重设密码失败，请重试')
  } else {
    ElMessage('重设密码成功')
  }
}
//变更职位
const dialogVisible1 = ref(false)
let id = ref()
let forselect = ref([
  {
    label: '管理人员',
    value: 1,
  },
  {
    label: '普通职工',
    value: 0,
  },
])
let posForm = ref({
  position: null,
})
const opendig = (data) => {
  dialogVisible1.value = true
  id.value = data.id
}
const changepos = async () => {
  let postdata = ref({})
  postdata.value.id = id.value
  postdata.value.position = posForm.value.position
  let res = await axios.post(
    'http://127.0.0.1/user/chgpos',
    postdata.value,
    config
  )
  if (res.data.status) {
    return ElMessage(res.data.message)
  } else {
    ElMessage(res.data.message)
    changePage(pagenow.page)
    posForm.value.position = ''
  }
}
const handleClose1 = () => {
  ElMessageBox.confirm('确定关闭吗?')
    .then(() => {
      dialogVisible1.value = false
    })
    .catch(() => {
      // catch error
    })
}
//生命周期钩子
onMounted(() => {
  foruseinfo()
})
</script>
<style lang="less" scoped>
.user-header {
  display: flex;
  justify-content: space-between;
}
.user-table {
  position: relative;
  .page {
    position: absolute;
    right: 0;
    bottom: 20px;
  }
}
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
