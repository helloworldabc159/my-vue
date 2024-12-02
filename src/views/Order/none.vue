<template>
  <div class="order-header">
    <div>
      <el-button
        type="primary"
        v-if="tokenStore.position == 1"
        @click="openandsub"
        >发布新任务</el-button
      >
    </div>
  </div>
  <div class="order-table">
    <el-table style="width: 100%; height: 550px" :data="dataList">
      <el-table-column prop="name" label="收货人信息" />
      <el-table-column prop="address" label="送货地址" />
      <el-table-column prop="tel" label="联系方式" />
      <el-table-column prop="msg" label="备注" />
      <el-table-column prop="goodname" label="货品" />
      <el-table-column prop="num" label="数量" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="time" label="订单创建时间" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="success" size="small" @click="pass(scope.row)"
            >处理</el-button
          >
          <el-button type="danger" size="small" @click="reject(scope.row)"
            >驳回</el-button
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
    title="驳回"
    width="500"
    :before-close="handleClose"
  >
    <el-form :inline="true" :model="rejectMsg">
      <el-form-item
        label="驳回理由"
        prop="msg"
        :rules="[{ required: true, message: '此项不能为空' }]"
      >
        <el-input
          v-model="rejectMsg.msg"
          type="textarea"
          size="large"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmreject"> 确定驳回 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogVisible1"
    title="操作"
    width="500"
    :before-close="handleClose1"
  >
    <span>确定进行该操作吗</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="passok()"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogVisible2"
    title="发布新任务"
    width="500"
    :before-close="handleClose2"
  >
    <el-form :inline="true" :model="dataForm">
      <el-form-item
        label="客户名"
        prop="name"
        :rules="[{ required: true, message: '此项不能为空' }]"
      >
        <el-input v-model="dataForm.name"></el-input>
      </el-form-item>
      <el-form-item
        label="客户地址"
        prop="address"
        :rules="[{ required: true, message: '此项不能为空' }]"
      >
        <el-input v-model="dataForm.address"></el-input>
      </el-form-item>
      <el-form-item
        label="客户联系方式"
        prop="tel"
        :rules="[{ required: true, message: '此项不能为空' }]"
      >
        <el-input v-model="dataForm.tel"></el-input>
      </el-form-item>
      <el-form-item
        label="商品名"
        prop="goodname"
        :rules="[{ required: true, message: '此项不能为空' }]"
      >
        <el-input v-model="dataForm.goodname"></el-input>
      </el-form-item>
      <el-form-item
        label="订单数量"
        prop="num"
        :rules="[{ required: true, message: '此项不能为空' }]"
      >
        <el-input v-model="dataForm.num"></el-input>
      </el-form-item>
      <el-form-item
        label="订单备注"
        prop="msg"
        :rules="[{ required: true, message: '此项不能为空' }]"
      >
        <el-input v-model="dataForm.msg"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="confirmtoadd"> 发布 </el-button>
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
let dataList = ref([])
//页面信息
let pagenow = ref({ total: 100, page: 1 })
//请求信息
const fordata = async () => {
  let res = await axios.get('http://127.0.0.1/order/ordernot', {
    headers: config.headers,
  })
  if (res.data.status == 1) {
    return ElMessage('数据请求失败')
  } else {
    dataList.value = res.data.data
    pagenow.value.total = res.data.length
  }
}
//换页
const changePage = async (page) => {
  pagenow.value.page = page
  let res = await axios.get('http://127.0.0.1/order/ordernot', {
    headers: config.headers,
    params: { page: page },
  })
  if (res.data.status == 1) {
    return ElMessage('请求数据失败')
  } else {
    dataList.value = res.data.data
    pagenow.value.total = res.data.length
  }
}
//驳回操作
const dialogVisible = ref(false)
let rejectdata = {}
let rejectMsg = ref({
  msg: null,
})
const handleClose = () => {
  ElMessageBox.confirm('确认关闭吗')
    .then(() => {
      dialogVisible.value = false
    })
    .catch(() => {
      // catch error
    })
}
const reject = (data) => {
  dialogVisible.value = true
  rejectdata = data
}
const confirmreject = async () => {
  let res = await axios.post(
    'http://127.0.0.1/order/changestatus',
    {
      status: 2,
      msg: rejectMsg.value.msg,
      id: rejectdata.id,
    },
    config
  )
  if (res.data.status == 1) {
    return ElMessage('驳回失败，请重试')
  } else {
    ElMessage('驳回成功')
    changePage(pagenow.value.page)
    dialogVisible.value = false
    rejectMsg.value.msg = ''
  }
}
//通过操作
const dialogVisible1 = ref(false)
const handleClose1 = () => {
  ElMessageBox.confirm('确认关闭吗')
    .then(() => {
      dialogVisible1.value = false
    })
    .catch(() => {
      // catch error
    })
}
let passdata = {}
const pass = (data) => {
  dialogVisible1.value = true
  passdata = data
}
const passok = async () => {
  let res = await axios.post(
    'http://127.0.0.1/order/changestatus',
    {
      status: 0,
      msg: '该订单处理完成',
      id: passdata.id,
    },
    config
  )
  if (res.data.status == 1) {
    ElMessage('处理失败')
  } else {
    ElMessage('处理成功')
    changePage(pagenow.value.page)
    dialogVisible1.value = false
  }
}
//发布新任务
let dialogVisible2 = ref(false)
const handleClose2 = () => {
  ElMessageBox.confirm('确认关闭吗?')
    .then(() => {
      dialogVisible2.value = false
    })
    .catch(() => {
      // catch error
    })
}
let dataForm = ref({
  name: '',
  address: '',
  tel: '',
  msg: '',
  goodname: '',
  num: '',
})
const openandsub = () => {
  dialogVisible2.value = true
}
const confirmtoadd = async () => {
  // console.log(dataForm.value)
  let res = await axios.post(
    'http://127.0.0.1/order/addorder',
    dataForm.value,
    config
  )
  if (res.data.status == 1) {
    return ElMessage('增加新任务失败')
  } else {
    ElMessage('新增任务成功')
    changePage(pagenow.value.page)
    dataForm.value = {}
  }
}
onMounted(() => {
  fordata()
})
</script>

<style lang="less" scoped>
.order-header {
  margin-bottom: 10px;
}
.order-table {
  position: relative;
  .page {
    position: absolute;
    right: 0;
    bottom: 20px;
  }
}
</style>
