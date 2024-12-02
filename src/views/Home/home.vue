<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img src="../../../image/user2.png" alt="" />
          <div class="user-info">
            <p class="name" style="margin-bottom: 20px">
              {{ tokenStore.name }}
            </p>
            <p class="role">
              {{ tokenStore.position == 1 ? '管理人员' : '普通职工' }}
            </p>
          </div>
        </div>
        <div class="login-info"></div>
      </el-card>
      <el-card shadow="hover" style="margin-top: 20px; height: 350px">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <el-card style="height: 380px">
        <div class="ChartBox">
          <div id="pillarChart" style="width: 100%; height: 350px"></div>
        </div>
      </el-card>
      <el-card style="height: 180px; margin-top: 31px" class="datashow">
        <el-row
          ><el-col :span="6">
            <el-statistic title="Daily active users" :value="268500" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="Daily active users" :value="268500" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="Daily active users" :value="268500" /> </el-col
        ></el-row>
        <el-row> </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { onUpdated, reactive, ref } from 'vue'
//1.主页的部分库存展示
const tableData = ref([])
const tableLabel = {
  goodname: '库存商品名字',
  weight: '重量(kg/每件)',
  price: '价值(￥)',
  number: '数量(个/件)',
}
//请求数据
import useToken from '../../stores/tokenStore'
const tokenStore = useToken()
let config = {
  headers: {
    Authorization: tokenStore.token,
    'Content-Type': 'application/json',
  },
}
import { onMounted, onBeforeUpdate } from 'vue'
import axios from 'axios'
const getTableList = async () => {
  let result = await axios.get('http://127.0.0.1/good/getallgoodit', config)
  if (result.data.status == 0) {
    tableData.value = result.data.msg.slice(0, 6)
  }
}

//图表区域
import Highcharts from 'highcharts'
// 引用所需外部资源
import Highcharts3d from 'highcharts/highcharts-3d'
import exporting from 'highcharts/modules/exporting'
// 注册所需外部资源
Highcharts3d(Highcharts)
exporting(Highcharts)
let dataList = ref([
  {
    name: '高露洁',
    y: 121,
  },
  {
    name: '美的冰箱',
    y: 19,
  },
  {
    name: '海尔空调',
    y: 10,
  },
  {
    name: '乐事薯片',
    y: 52,
  },
  {
    name: '黑人牙膏',
    y: 13,
  },
  {
    name: '立白袋装洗衣液',
    y: 6,
  },
])
let dataListTwo = ref([
  {
    name: '洁柔厕纸',
    y: 6,
  },
  {
    name: '帮宝适纸尿裤',
    y: 26,
  },
  {
    name: 'tcl柜式空调',
    y: 13,
  },
  {
    name: '小老板紫菜',
    y: 81,
  },
  {
    name: '费列罗朱古力',
    y: 15,
  },
  {
    name: '明治抹茶朱古力',
    y: 81,
  },
])
let dataListTherr = ref([
  {
    name: '维他盒装柠檬茶250ml',
    y: 5,
  },
  {
    name: '维他盒装维他奶',
    y: 0,
  },
  {
    name: '维他黑豆奶',
    y: 17,
  },
  {
    name: '欧莱雅男士洗面奶',
    y: 15,
  },
  {
    name: '士巴拿',
    y: 3,
  },
  {
    name: '小米14 256g',
    y: 2,
  },
])
const init = () => {
  Highcharts.chart('pillarChart', {
    chart: {
      type: 'area', //类型
      options3d: {
        enabled: true, // 是否启用 3D 功能,默认为false
        alpha: 15, // 内旋转角度
        beta: 30, // 外旋转角度
        depth: 200, //3D场景的大小(深度)
      },
    },
    title: {
      text: '数据展示', //标题
    },
    yAxis: {
      title: {
        text: '数量',
        x: -40, //x方向
      },
      labels: {
        //图例
        format: '{value:,.0f} ',
      },
      gridLineDashStyle: 'Dash', //网格线线条样式，Solid、Dot、Dash
    },
    xAxis: [
      {
        visible: false, //加载时，数据序列默认隐藏。
      },
      {
        visible: false, //加载时，数据序列默认隐藏。
      },
      {
        visible: false, //加载时，数据序列默认隐藏。
      },
    ],
    plotOptions: {
      area: {
        depth: 100,
        marker: {
          enabled: false,
        },
        states: {
          inactive: {
            enabled: false,
          },
        },
      },
    },
    tooltip: {
      valueSuffix: '件', //提示框内容拼接的文字
    },
    series: [
      {
        name: '数据一', //名称
        lineColor: 'rgb(180,90,50)', //线条颜色
        color: 'rgb(200,110,50)', //文字颜色
        fillColor: 'rgb(200,110,50)', //背景色
        data: dataList.value, //数据
      },
      {
        name: '数据二',
        xAxis: 1,
        lineColor: 'rgb(120,160,180)',
        color: 'rgb(140,180,200)',
        fillColor: 'rgb(140,180,200)',
        data: dataListTwo.value,
      },
      {
        name: '数据三',
        xAxis: 2,
        lineColor: 'rgb(200, 190, 140)',
        color: 'rgb(200, 190, 140)',
        fillColor: 'rgb(230, 220, 180)',
        data: dataListTherr.value,
      },
    ],
  })
}
//实现天气等功能
let weatherData = reactive({})

const getCity = () => {
  AMap.plugin('AMap.CitySearch', function () {
    var citySearch = new AMap.CitySearch()
    citySearch.getLocalCity(function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        getWeather(result.city)
      }
    })
  })
}
const getWeather = (city) => {
  AMap.plugin('AMap.Weather', function () {
    //创建天气查询实例
    let weather = new AMap.Weather()
    //执行实时天气信息查询
    weather.getLive(city, function (err, data) {
      if (data.info == 'OK') {
        weatherData = data
        console.log(weatherData)
      }
    })
  })
}
//引入用户的相关信息
let usename = ref(tokenStore.name)
let position = ref(tokenStore.position)
//为3d图提供数据
const forechart = async () => {
  let res = await axios.get('http://127.0.0.1/good/forechart', {
    headers: config.headers,
  })
  console.log(res)
  if (res.data.status == 0) {
    for (let i = 0; i < res.data.list.length; i++) {
      dataList.value[i].name = res.data.list[i].goodname
      dataList.value[i].y = res.data.list[i].number
      dataListTwo.value[i].name = res.data.list2[i].goodname
      dataListTwo.value[i].y = res.data.list2[i].number
      dataListTherr.value[i].name = res.data.list3[i].goodname
      dataListTherr.value[i].y = res.data.list3[i].number
    }
    console.log(dataList.value)
  }
}
import longClock from '../clock/clock.vue'
//钩子，在这个周期执行
onMounted(() => {
  getTableList()
  // getChartData()
  getCity()
  init()
  forechart()
})
onUpdated(() => {
  getCity()
})
</script>

<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    margin: bottom 20px;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
    .login-info {
      line-height: 30px;
      font-size: 14px;
      color: #999;
      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }
  #columnchart {
    width: 100%;
    height: 100%;
  }
  .cityinfo {
    width: 100px;
    height: 100px;
    margin-left: 30px;
    p {
      font-size: 18px;
      margin: 30px 0;
    }
  }
}
.ChartBox {
  width: 100%;
  height: 100%;
}
</style>
