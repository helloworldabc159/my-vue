<template>
  <div class="type-header">
    <div>
      <el-button type="primary" @click="returnback">返回</el-button>
      <el-button type="primary" @click="dialogVisible = true"
        >添加新类型</el-button
      >
    </div>
    <el-form :inline="true" class="type-search" ref="searchForm">
      <el-form-item label="请输入要查询的类型名称">
        <el-input placeholder="输入类型名" v-model="searchtype"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="type-table">
    <el-table :data="TypeData" style="width: 100%; height: 500px">
      <el-table-column prop="id" label="类型编号" width="550" />
      <el-table-column prop="type" label="类型名字" width="550" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button type="danger" size="small" @click="delClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pagenow.length"
        @current-change="changePage"
      />
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="增加新库存类型名"
    width="500"
    :before-close="handleClose"
  >
    <div class="addTypeTable">
      <el-form :inline="true" ref="typeForm" :model="addtypeForm">
        <el-form-item
          label="请输入想要新增的类型名:"
          prop="type"
          :rules="[{ required: true, message: '此项为必填项' }]"
          ><el-input
            placeholder="请输入类型名"
            v-model="addtypeForm.type"
          ></el-input
        ></el-form-item>
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
import axios from 'axios'
import { onMounted, reactive, ref, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance()
//记录分页数据
let pagenow = {
  length: null,
  page: 1,
}
//header配置
import useToken from '../../stores/tokenStore'
const tokenStore = useToken()
let config = {
  headers: {
    Authorization: tokenStore.token,
    'Content-Type': 'application/json',
  },
}
let TypeData = ref([])
//显示各个种类
const showall = async () => {
  let result = await axios.get('http://127.0.0.1/type/showall', {
    headers: config.headers,
  })
  // console.log(result)
  TypeData.value = result.data.data
  pagenow.length = result.data.length
}
//分页功能
const changePage = async (page) => {
  pagenow.page = page
  let result = await axios.get('http://127.0.0.1/type/showall', {
    headers: config.headers,
    params: {
      page: page,
    },
  })
  TypeData.value = result.data.data
  pagenow.length = result.data.length
}
//查询功能
let searchtype = ref()
const search = async () => {
  let res = await axios.get('http://127.0.0.1/type/search', {
    headers: config.headers,
    params: {
      type: searchtype.value,
    },
  })
  if (res.data.status == 0) {
    TypeData.value = res.data.data
    proxy.$refs.searchForm.resetFields()
  } else {
    ElMessage('查询失败')
    proxy.$refs.searchForm.resetFields()
  }
}
//返回功能
const returnback = () => {
  showall()
}
//删除功能
const delClick = async (data) => {
  // console.log(data)
  let res = await axios.get('http://127.0.0.1/type/deltype', {
    headers: config.headers,
    params: {
      id: data.id,
    },
  })
  if (res.data.status == 1) {
    ElMessage(res.data.msg)
  } else {
    ElMessage('删除成功')
    showall()
  }
}
//控制对话框
const dialogVisible = ref(false)
const handleClose = () => {
  ElMessageBox.confirm('确认关闭？')
    .then(() => {
      dialogVisible.value = false
    })
    .catch(() => {
      // catch error
    })
  proxy.$refs.typeForm.resetFields()
}
//增加类型
let addtypeForm = ref({
  type: null,
})
const comfirmadd = async () => {
  // console.log(addtypeForm.value.type)
  let res = await axios.post(
    'http://127.0.0.1/type/addtype',
    addtypeForm.value,
    config
  )
  if (res.data.status == 0) {
    ElMessage('添加成功')
    showall()
    proxy.$refs.typeForm.resetFields()
  } else {
    ElMessage(res.data.msg)
    proxy.$refs.typeForm.resetFields()
  }
  // console.log(res)
}
//生命周期钩子
onMounted(() => {
  showall()
})
</script>

<style lang="less" scoped>
.type-header {
  display: flex;
  justify-content: space-between;
}
.type-table {
  position: relative;
  .page {
    position: absolute;
    right: 0;
    bottom: 20px;
  }
}
</style>
