<template>
  <div>
    <!-- 面包屑导航：----------------------------------------- -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区域：-------------------------------------- -->
    <el-card class="box-card">
      <!-- 柱状图——报表的容器： -->
    <div id="report" style="width:750px; height:400px;"></div>
    </el-card>

    <el-card class="box-card">
      <!-- 饼状图——报表的容器： -->
    <div id="report1" style="width:750px; height:400px;"></div>
    </el-card>

    <el-card class="box-card">
      <!-- 折线图——报表的容器： -->
    <div id="report2" style="width:750px; height:400px;"></div>
    </el-card>

    <el-card class="box-card">
      <!-- 矩形树图——报表的容器： -->
    <div id="report3" style="width:750px; height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 全局引入数据可视化图表：
import echarts from 'echarts'

export default {
  // 生命周期——挂载结束阶段（此阶段：Vue实例对象已经完成了编译，并且已经将编译好的内容渲染给了div容器）
  mounted () {
    // 调用绘制柱状图的方法：
    this.paintDataPic()

    // 调用绘制饼状图的方法：
    this.pieChart()

    // 调用绘制折线图的方法：
    this.lineChart()

    // 调用绘制矩形树图的方法：
    this.recChart()
  },

  methods: {
    // 制作柱状图表：
    paintDataPic () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('report'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    },

    // 制作饼状图表：
    pieChart () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('report1'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '某站点用户访问来源',
          subtext: '使用的是定死的假数据：',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['华东', '华南', '华北', '西部', '其它']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '65%',
            center: ['65%', '55%'],
            data: [
              { value: 335, name: '华东' },
              { value: 310, name: '华南' },
              { value: 234, name: '华北' },
              { value: 135, name: '西部' },
              { value: 1000, name: '其它' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },

    // 制作折线图表：
    lineChart () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('report2'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['华东', '华南', '华北', '西部', '其它']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['2019-7-12', '2019-7-13', '2019-7-14', '2019-7-15', '2019-7-16', '2019-7-17', '2019-7-18']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '华东',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [1200, 1320, 1010, 1340, 900, 2300, 2100]
          },
          {
            name: '华南',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [2200, 1802, 1901, 2340, 2900, 3300, 3100]
          },
          {
            name: '华北',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [1500, 2302, 2010, 1504, 1900, 3300, 4100]
          },
          {
            name: '西部',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [3200, 3320, 3010, 3340, 3900, 3300, 3200]
          },
          {
            name: '其它',
            type: 'line',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            areaStyle: { normal: {} },
            data: [8200, 9302, 9001, 9304, 12900, 13300, 13200]
          }
        ]
      })
    },

    // 制作矩形树图表：
    recChart () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('report3'))
      // 绘制图表
      myChart.setOption({
        series: [{
          type: 'treemap',
          data: [{
            name: 'nodeA', // First tree
            value: 10,
            children: [{
              name: 'nodeAa', // First leaf of first tree
              value: 4
            }, {
              name: 'nodeAb', // Second leaf of first tree
              value: 6
            }]
          }, {
            name: 'nodeB', // Second tree
            value: 20,
            children: [{
              name: 'nodeBa', // Son of first tree
              value: 20,
              children: [{
                name: 'nodeBa1', // Granson of first tree
                value: 20
              }]
            }]
          }]
        }]
      })
    }
  }

}
</script>

<style lang="less" scoped>
</style>
