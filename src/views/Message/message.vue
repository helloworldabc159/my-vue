<template>
  <div class="type-header">
    <el-button
      type="primary"
      v-if="tokenStore.position == 1"
      @click="opendialog"
      >发布信息</el-button
    >
  </div>
  <div class="msg-table">
    <el-table :data="MsgData" style="width: 100%; height: 500px">
      <el-table-column prop="author" label="发布者" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="time" label="发布时间" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button type="primary" size="small" @click="readmsg(scope.row)"
            >查看详情</el-button
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
    title="公告"
    width="500"
    :before-close="handleClose"
  >
    <el-descriptions class="margin-top" :column="2" :size="size">
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <user />
            </el-icon>
            发布者
          </div>
        </template>
        {{ msgDetail.author }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <clock />
            </el-icon>
            发布时间
          </div>
        </template>
        {{ msgDetail.time }}
      </el-descriptions-item>
      <br />
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <clock />
            </el-icon>
            具体内容
          </div>
        </template>
        <div style="width: 400px">{{ msgDetail.content }}</div>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
  <el-dialog
    v-model="dialogVisible1"
    title="发布新消息"
    width="500"
    :before-close="handleClose1"
  >
    <el-form :inline="true" :model="msgDetail" ref="msgForm">
      <el-form-item
        label="标题"
        prop="title"
        :rules="[{ required: true, message: '此项不能为空' }]"
      >
        <el-input v-model="msgDetail.title"></el-input>
      </el-form-item>
      <el-form-item
        label="内容"
        prop="content"
        :rules="[{ required: true, message: '此项不能为空' }]"
      >
        <el-input
          v-model="msgDetail.content"
          type="textarea"
          size="large"
          :rows="5"
          maxlength="500"
          style="width: 300px"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="addmsg"> 发布 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from 'vue'
import axios from 'axios'
import useToken from '../../stores/tokenStore'
import { ElMessage } from 'element-plus'
import { replace, filtion } from 'verification-sensitive'
const tokenStore = useToken()
const { proxy } = getCurrentInstance()
let config = {
  headers: {
    Authorization: tokenStore.token,
    'Content-Type': 'application/json',
  },
}
//为table提供数据
let MsgData = ref([])
//页码数据
let pagenow = ref({
  page: 1,
  length: 30,
})
//分页
const changePage = async (val) => {
  let result = await axios.get('http://127.0.0.1/msg/pagemsg', {
    params: {
      page: val,
    },
    headers: config.headers,
  })
  if (result.data.status == 0) {
    pagenow.page = val
    pagenow.length = result.data.length
    MsgData.value = result.data.data
  } else {
    ElMessage('请求失败')
  }
}

//初试化为页面提供数据
const dataForMsg = async () => {
  let result = await axios.get('http://127.0.0.1/msg/showmsg', {
    headers: config.headers,
  })
  if (result.data.status == 1) {
    return ElMessage(result.data.msg)
  }
  MsgData.value = result.data.data
  pagenow.value.length = result.data.length
}

//查看详情
let msgDetail = ref({
  author: '',
  time: '',
  content: '',
})
let dialogVisible = ref(false)
const handleClose = () => {
  ElMessageBox.confirm('确认关闭吗?')
    .then(() => {
      dialogVisible.value = false
    })
    .catch(() => {
      // catch error
    })
}
const readmsg = async (val) => {
  dialogVisible.value = true
  let result = await axios.get('http://127.0.0.1/msg/readmsg', {
    params: { id: val.id },
    headers: config.headers,
  })
  if (result.data.status == 1) {
    ElMessage(result.data.msg)
  } else {
    msgDetail.value = result.data.data[0]
  }
}
const opendialog = () => {
  dialogVisible1.value = true
  msgDetail.value.author = ''
  msgDetail.value.content = ''
  msgDetail.value.title = ''
}
//添加新的信息
let dialogVisible1 = ref(false)
const handleClose1 = () => {
  ElMessageBox.confirm('确认关闭吗?')
    .then(() => {
      dialogVisible1.value = false
    })
    .catch(() => {
      // catch error
    })
}
const addmsg = async () => {
  msgDetail.value.content = replace(msgDetail.value.content, '*')

  let result = await axios.post(
    'http://127.0.0.1/msg/addmsg',
    msgDetail.value,
    config
  )
  if (result.data.status == 1) {
    ElMessage(`添加失败+${result.data.msg}`)
  } else {
    changePage(pagenow.page)
    proxy.$refs.msgForm.resetFields()
    ElMessage('发布成功')
  }
}
const test = () => {
  // let str2 = replace('', '*')
  // console.log(str2)
}
//hooks
onMounted(() => {
  dataForMsg()
  test()
})
</script>

<style lang="less" scoped>
.msg-table {
  position: relative;
  margin-top: 20px;
  .page {
    position: absolute;
    right: 0;
    bottom: 0.25rem;
  }
}
</style>
