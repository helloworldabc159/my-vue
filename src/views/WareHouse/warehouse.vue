<template>
  <div class="header">
    <div class="add">
      <el-button type="primary" @click="dialogVisible = true"
        >添加仓库货架</el-button
      >
    </div>
  </div>
  <div class="table">
    <el-table :data="WareTable" style="width: 100%; height: 550px">
      <el-table-column label="仓库编号" prop="house"></el-table-column>
      <el-table-column label="区域编号" prop="area"></el-table-column>
      <el-table-column label="货架编号" prop="box"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="danger" size="small" @click="delhouse(scope.row)"
            >删除</el-button
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
    title="添加新货架"
    width="500"
    :before-close="handleClose"
  >
    <div class="addWareTable">
      <el-form :inline="true" ref="WareForm" :model="wareForm">
        <el-form-item
          label="仓库号"
          prop="house"
          :rules="[
            { required: true, message: '此项为必填项' },
            { type: 'number', message: '此项为数字' },
          ]"
        >
          <el-input
            v-model.number="wareForm.house"
            placeholder="仓库号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="区域号"
          prop="area"
          :rules="[
            { required: true, message: '此项为必填项' },
            { type: 'number', message: '此项为数字' },
          ]"
        >
          <el-input
            v-model.number="wareForm.area"
            placeholder="区域号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="货架号"
          prop="box"
          :rules="[
            { required: true, message: '此项为必填项' },
            { type: 'number', message: '此项为数字' },
          ]"
        >
          <el-input
            v-model.number="wareForm.box"
            placeholder="货架号"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="comfirmadd"> 确认增加 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import useToken from '../../stores/tokenStore'
const tokenStore = useToken()
let config = {
  headers: {
    Authorization: tokenStore.token,
    'Content-Type': 'application/json',
  },
}
//换页数据
let pagenow = ref({
  page: 1,
  total: 30,
})
let WareTable = ref([])
//为table提供数据
const changePage = async (val) => {
  let result = await axios.get('http://127.0.0.1/warehouse/page', {
    params: { page: val },
    headers: config.headers,
  })
  if (result.data.status == 1) {
    ElMessage('请求数据有误')
  } else {
    WareTable.value = result.data.data
    pagenow.value.total = result.data.length
  }
}
//提供数据
const getData = async () => {
  let result = await axios.get('http://127.0.0.1/warehouse/showall', {
    headers: config.headers,
  })
  // console.log(result)
  if (result.data.status == 1) {
    ElMessage('请求数据失败')
  } else {
    WareTable.value = result.data.data
    pagenow.value.total = result.data.length
  }
}
//添加新的货架
let wareForm = ref({ house: '', area: '', box: '' })
const comfirmadd = async () => {
  let result = await axios.post(
    'http://127.0.0.1/warehouse/add',
    wareForm.value,
    config
  )
  if (result.data.status == 1) {
    ElMessage('添加失败')
  } else {
    ElMessage('添加成功')
    // pagenow.value.total = result.data.length
    changePage(pagenow.page)
    wareForm.value = { house: '', area: '', box: '' }
  }
}
//删除
const delhouse = async (val) => {
  let result = await axios.post(
    'http://127.0.0.1/warehouse/del',
    {
      id: val.id,
      house: val.house,
      area: val.area,
      box: val.box,
    },
    config
  )
  if (result.data.status == 1) {
    ElMessage(result.data.msg)
  } else {
    ElMessage('删除成功')
    changePage(pagenow.page)
  }
}
//控制dialog页面的
let dialogVisible = ref(false)
const handleClose = () => {
  ElMessageBox.confirm('确认要关闭吗?')
    .then(() => {
      dialogVisible.value = false
      proxy.$refs.staffForm.resetFields()
    })
    .catch(() => {
      // catch error
    })
}
onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>
.table {
  position: relative;
  margin-top: 20px;
  .page {
    position: absolute;
    right: 0;
    bottom: 0.25rem;
  }
}
</style>
