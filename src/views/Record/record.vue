<template>
  <div class="record-header">
    <div>
      <el-button type="primary" @click="returnback">返回</el-button
      ><el-button type="primary" @click="exportExcel">导出数据</el-button>
    </div>

    <el-form :inline="true" class="form-search">
      <el-form-item label="请选择要查询的日期">
        <el-date-picker v-model="date" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dateSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="record-table">
    <el-table
      :data="tableData"
      style="width: 100%; height: 500px"
      id="data-table"
    >
      <el-table-column prop="rid" label="rid" width="180" />
      <el-table-column prop="operaid" label="操作人id" width="180" />
      <el-table-column prop="goodname" label="操作库存名" />
      <el-table-column prop="inorout" label="出入库" />
      <el-table-column prop="num" label="数量" />
      <el-table-column prop="date" label="日期" />
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
</template>
<script setup>
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'
//header配置
import useToken from '../../stores/tokenStore'
const tokenStore = useToken()
let config = {
  headers: {
    Authorization: tokenStore.token,
    'Content-Type': 'application/json',
  },
}
//看看是实现查询还是显示
let flag = 1
//日期查询功能
let date = ref()
//日期格式化的函数
const dateFormat = (data) => {
  let date = new Date(data)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month >= 10 ? month : '0' + month
  let day = date.getDate()
  day = day >= 10 ? day : '0' + day
  let formatedDate = `${year}-${month}-${day}`
  return formatedDate
}
//table数据
const tableData = ref([])
//实现分页(包含查询和显示数据)
let pagenow = reactive({
  length: 100,
  page: null,
})
//实现暂存list的数据，当进行查询时存入显示数据时的page信息
let pageTemp = {
  length: null,
  page: null,
}
const changePage = async (page) => {
  if (flag === 1) {
    pagenow.page = page
    let res = await axios.get('http://127.0.0.1/good/record', {
      headers: config.headers,
      params: {
        page: page,
      },
    })
    if (res.data.status == 0) {
      pagenow.length = res.data.length
      tableData.value = res.data.data
    }
  } else if (flag === 0) {
    pageTemp = pagenow
    //处理后的数据
    let dateData = dateFormat(date.value)
    let res = await axios.get('http://127.0.0.1/good/searchRec', {
      headers: config.headers,
      params: { page: page, date: dateData },
    })
    console.log(res)
    if (res.data.status == 0) {
      pagenow.length = res.data.length
      tableData.value = res.data.data
    }
  }
}
//返回功能

const returnback = () => {
  pagenow = pageTemp
  console.log(pagenow)
  flag = 1
  changePage()
}

const dateSearch = () => {
  flag = 0
  changePage()
}
//导出功能
import * as XLSX from 'xlsx'
import filesaver from 'file-saver'
const exportExcel = () => {
  let wb = XLSX.utils.table_to_book(document.querySelector('#data-table'))
  let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
  try {
    filesaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      '出入库记录.xlsx'
    )
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout)
  }
  return wbout
}
onMounted(() => {
  changePage()
})
</script>

<style lang="less" scoped>
.record-table {
  position: relative;
  .page {
    position: absolute;
    right: 0;
    bottom: 20px;
  }
}
.record-header {
  display: flex;
  justify-content: space-between;
}
</style>
