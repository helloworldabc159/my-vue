<template>
  <div class="good-header">
    <div>
      <el-button type="primary" @click="returnback">返回</el-button>
      <el-button type="warning" @click="opendialogforadd">添加新库存</el-button>
      <el-button type="info" @click="exportExcel">导出数据</el-button>
    </div>

    <el-form :inline="true" class="demo-form-inline" :model="formInline">
      <el-form-item label="请输入">
        <el-input
          placeholder="请输入商品名字"
          v-model="formInline.keyword"
        ></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <el-table :data="list" style="width: 100%" height="550px" id="data-table">
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="150"
      />
      <el-table-column
        fixed="right"
        label="操作"
        min-width="200"
        style="text-align: center"
      >
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="opendialogforas(scope.row)"
            >库存操作</el-button
          >
          <el-button
            type="success"
            size="small"
            @click="opendialogforchange(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="opendialogfordel(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      small
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="changePage"
      class="mt-4 pager"
    />
  </div>

  <!-- 添加新库存的dialog -->
  <el-dialog
    :title="action == 'addgood' ? '添加新库存' : '修改库存信息'"
    v-model="dialogVisible"
    width="500"
    :before-close="handleClose"
  >
    <el-form
      :inline="true"
      :model="formGoods"
      class="demo-form-inline"
      ref="goodForm"
    >
      <el-form-item
        label="货品名称"
        prop="goodname"
        :rules="[{ required: true, message: '货名是必填项' }]"
      >
        <el-input
          v-model="formGoods.goodname"
          placeholder="请输入库存货品名称"
        />
      </el-form-item>
      <el-form-item
        label="库存类型码"
        prop="type"
        :rules="[{ required: true, message: '类型码是必填项' }]"
      >
        <el-select
          v-model.number="formGoods.type"
          placeholder="库存类型码"
          clearable
        >
          <el-option
            v-for="item in goodtype"
            :key="item.id"
            :label="item.type"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="库存商品重量(kg)"
        prop="weight"
        :rules="[
          { required: true, message: '重量是必填项' },
          { type: 'number', message: '重量必须为数字' },
        ]"
      >
        <el-input
          v-model.number="formGoods.weight"
          placeholder="请输入库存货品重量"
        />
      </el-form-item>
      <el-form-item
        label="库存价值(￥)"
        prop="price"
        :rules="[
          { required: true, message: '库存价值是必填项' },
          { type: 'number', message: '库存价值必须为数字' },
        ]"
      >
        <el-input
          v-model.number="formGoods.price"
          placeholder="请输入库存价值"
        />
      </el-form-item>
      <el-form-item
        label="仓库号"
        prop="house"
        :rules="[
          { required: true, message: '此项为必填项' },
          { type: 'number', message: '此项必须为数字' },
        ]"
      >
        <el-input
          v-model.number="formGoods.house"
          placeholder="仓库号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="区域号"
        prop="area"
        :rules="[
          { required: true, message: '此项为必填项' },
          { type: 'number', message: '此项必须为数字' },
        ]"
      >
        <el-input
          v-model.number="formGoods.area"
          placeholder="区域号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="货架号"
        prop="box"
        :rules="[
          { required: true, message: '此项为必填项' },
          { type: 'number', message: '此项必须为数字' },
        ]"
      >
        <el-input
          v-model.number="formGoods.box"
          placeholder="货架号"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handlecancel">取消</el-button>
        <el-button type="primary" @click="onsubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 库存操作的dialog -->
  <el-dialog
    v-model="dialogVisible1"
    title="出入库操作"
    width="500"
    :before-close="handleClose1"
  >
    <span style="border-bottom: 15px"
      >库存商品名字：{{ inoutForm.goodname }}</span
    >
    <el-form
      ref="Formjj"
      :inline="true"
      :model="inoutForm"
      class="demo-form-inline"
    >
      <el-form-item
        label="出入库数量"
        prop="number"
        :rules="[{ required: true, message: '数量为必填项' }]"
      >
        <el-input v-model.number="inoutForm.number" placeholder="出入库数量" />
      </el-form-item>
      <el-form-item label="出入库" prop="inorout">
        <el-select
          v-model.number="inoutForm.inorout"
          placeholder="请选择出入库"
          clearable
        >
          <el-option label="入库" :value="0" />
          <el-option label="出库" :value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="submitjj(Formjj)"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { onMounted, ref, reactive, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import useToken from '../../stores/tokenStore'
const tokenStore = useToken()
let config = {
  headers: {
    Authorization: tokenStore.token,
    'Content-Type': 'application/json',
  },
}
//为当前页面的页码做一个记录
let pagenow = 1
//为对话框显示的内容而准备的一个变量
let action = ref('addgood')
//获取数据
const list = ref([])
let total = 0
const getGoodsData = async () => {
  let res = await axios.get('http://127.0.0.1/good/allgood', config)
  if (res.data.status == 0) {
    total = res.data.length
    list.value = res.data.msg
  }
}
//分页功能
const changePage = async (page) => {
  pagenow = page
  let res = await axios.get('http://127.0.0.1/good/allgood', {
    headers: config.headers,
    params: {
      page: page,
    },
  })
  if (res.data.status == 0) {
    total = res.data.length
    list.value = res.data.msg
  }
}
const tableLabel = reactive([
  { prop: 'id', label: '库存商品编号' },
  { prop: 'goodname', label: '库存商品名字' },
  { prop: 'type', label: '库存类型码' },
  { prop: 'weight', label: '重量(kg/件)' },
  { prop: 'price', label: '价值' },
  { prop: 'number', label: '库存量' },
  { prop: 'place', label: '存放处' },
])
//搜索功能
const formInline = reactive({
  keyword: '',
})
const handleSearch = async () => {
  let res = await axios({
    method: 'get',
    url: 'http://127.0.0.1/good/search',
    params: {
      goodname: formInline.keyword,
    },
    headers: config.headers,
  })
  if (res.data.status === 0) {
    list.value = []
    list.value[0] = res.data.result
  } else if (res.data.status === 1 && formInline.keyword !== '') {
    ElMessage('无此库存商品')
  }
  formInline.keyword = ''
}
//回退功能
const returnback = () => {
  changePage(pagenow)
}
//控制模态框的显示
const dialogVisible = ref(false)
const handleClose = (done) => {
  ElMessageBox.confirm('确定关闭吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
  proxy.$refs.goodForm.resetFields()
}
//打开模态框(关于打开增加新库存)
const opendialogforadd = () => {
  dialogVisible.value = true
  action.value = 'addgood'
}
//添加新的库存信息
const formGoods = reactive({
  id: null,
  goodname: '', //添加库存商品的名称
  type: null,
  weight: null,
  price: null,
  house: '',
  area: '',
  box: '',
})
//给el-select提供数据
let goodtype = reactive([])
const gettype = async () => {
  const res = await axios.get('http://127.0.0.1/good/searchtype', config)
  if (res.data.status == 0) {
    goodtype = res.data.data
  }
}

//添加新的库存以及修改
const onsubmit = () => {
  proxy.$refs.goodForm.validate(async (vaild) => {
    if (vaild) {
      if (action.value == 'addgood') {
        let res = await axios.post(
          'http://127.0.0.1/good/addgood',
          formGoods,
          config
        )
        if (res.data.status == 1) {
          ElMessage(res.data.msg)
        } else {
          ElMessage(res.data.msg)
          proxy.$refs.goodForm.resetFields()
        }
        changePage(pagenow)
      } else {
        let res = await axios.post(
          'http://127.0.0.1/good/changeinfo',
          formGoods,
          config
        )
        if (res.data.status == 1) {
          ElMessage(res.data.msg)
        } else {
          ElMessage(res.data.msg)
          proxy.$refs.goodForm.resetFields()
        }

        changePage(pagenow)
      }
    } else {
      ElMessage({
        showClose: true,
        message: '请输入正确的内容',
        type: 'error',
      })
    }
  })

  // dialogVisible.value = false
}
//按取消后清楚表单
const handlecancel = () => {
  dialogVisible.value = false
  proxy.$refs.goodForm.resetFields()
}
//修改商品信息
//打开修改商品模态框
const opendialogforchange = (data) => {
  // let res = data
  let str = data.place
  let [a, b, c] = str.split('-')
  ;(data.house = parseInt(a)),
    (data.area = parseInt(b)),
    (data.box = parseInt(c))
  action.value = 'changegood'
  dialogVisible.value = true
  proxy.$nextTick(() => {
    Object.assign(formGoods, data)
    formGoods.id = data.id
  })
}
const changegoodinfo = () => {}
//出入库操作

//出入库的模态框
const dialogVisible1 = ref(false)
//这是出入库的数据
let inoutForm = reactive({
  id: null,
  goodname: '',
  inorout: null,
  number: null,
})
const handleClose1 = (done) => {
  ElMessageBox.confirm('确认关闭吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
const opendialogforas = (item) => {
  dialogVisible1.value = true
  let res = item //用变量来接收数据
  inoutForm.id = res.id
  inoutForm.goodname = res.goodname
}
const submitjj = async (data) => {
  if (inoutForm.inorout == 0) {
    let res = await axios.post(
      'http://127.0.0.1/good/addgoodsnum',
      inoutForm,
      config
    )
    if (res.data.status == 1) {
      ElMessage(res.data.msg)
    } else {
      ElMessage(res.data.msg)
    }
    proxy.$refs.Formjj.resetFields()
    changePage(pagenow)
  } else {
    let res = await axios.post(
      'http://127.0.0.1/good/subgoodsnum',
      inoutForm,
      config
    )
    if (res.data.status == 1) {
      ElMessage(res.data.msg)
    } else {
      ElMessage(res.data.msg)
    }
    proxy.$refs.Formjj.resetFields()
    changePage(pagenow)
  }
}
//删除功能
let delForm = reactive({ id: null })
const opendialogfordel = (data) => {
  delForm.id = data.id
  ElMessageBox.confirm('确定删除吗?')
    .then(async () => {
      let res = await axios.post(
        'http://127.0.0.1/good/delgood',
        delForm,
        config
      )
      if (res.data.status == 0) {
        ElMessage({
          showClose: true,
          message: '删除成功',
          type: 'success',
        })
        changePage(pagenow)
      } else {
        ElMessage({
          showClose: true,
          message: '删除失败',
          type: 'error',
        })
      }
    })
    .catch(() => {
      // catch error
    })
}
//导出功能
import * as XLSX from 'xlsx'
import filesaver from 'file-saver'
const exportExcel = async () => {
  let wb = XLSX.utils.table_to_book(document.querySelector('#data-table'))
  let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
  try {
    filesaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      '仓库商品.xlsx'
    )
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout)
  }
  changePage(pagenow)
  return wbout
}
//生命周期钩子
onMounted(() => {
  getGoodsData()
  gettype()
})
</script>

<style lang="less" scoped>
.table {
  position: relative;
  .pager {
    position: absolute;
    right: 0;
    bottom: 20px;
  }
}
.good-header {
  display: flex;
  justify-content: space-between;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
