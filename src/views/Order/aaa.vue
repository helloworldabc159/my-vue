<template>
  <div class="order-table">
    <el-table style="width: 100%; height: 650px" :data="orderdata">
      <el-table-column prop="name" label="收货人信息" />
      <el-table-column prop="address" label="送货地址" />
      <el-table-column prop="tel" label="联系方式" />
      <el-table-column prop="msg" label="备注" />
      <el-table-column prop="goodname" label="货品" />
      <el-table-column prop="num" label="数量" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="time" label="订单创建时间" />
      <el-table-column prop="operastaff" label="订单操作者" />
    </el-table>
  </div>
  <div class="pagebox">
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
//分页功能
let pagenow = ref({
  total: 100,
  page: 1,
})
//展示订单
let orderdata = ref([])
//向后端请求展示数据
const fordata = async () => {
  let res = await axios.get('http://127.0.0.1/order/getorder', {
    headers: config.headers,
  })
  if (res.data.status == 1) {
    ElMessage('请求数据失败')
  } else {
    orderdata.value = res.data.data
    pagenow.value.total = res.data.length
  }
}

const changePage = async (page) => {
  let res = await axios.get('http://127.0.0.1/order/getorder', {
    headers: config.headers,
    params: { page: page },
  })
  if (res.data.status == 1) {
    ElMessage('请求数据失败')
  } else {
    orderdata.value = res.data.data
    pagenow.value.total = res.data.length
    pagenow.value.page = page
  }
}
onMounted(() => {
  fordata()
})
</script>

<style lang="less" scoped>
.pagebox {
  width: 100%;
  position: relative;
  background-color: white;
  height: 40px;
  .page {
    position: absolute;
    right: 0;
  }
}
</style>
